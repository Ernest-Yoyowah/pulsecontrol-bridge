use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        State,
    },
    response::IntoResponse,
    routing::get,
    Router,
};
use serde_json::{json, Value};
use std::net::SocketAddr;
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Emitter};

use crate::midi;
use crate::state::AppState;

#[derive(Clone)]
pub struct WsState {
    pub app_state: Arc<Mutex<AppState>>,
    pub app_handle: AppHandle,
}

pub async fn start(app_state: Arc<Mutex<AppState>>, app_handle: AppHandle) {
    let ws_state = WsState { app_state, app_handle };

    let app = Router::new()
        .route("/", get(ws_handler))
        .with_state(ws_state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8765));
    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind port 8765 — is another process using it?");

    axum::serve(listener, app)
        .await
        .expect("WebSocket server crashed");
}

async fn ws_handler(
    ws: WebSocketUpgrade,
    State(state): State<WsState>,
) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_socket(socket, state))
}

async fn handle_socket(mut socket: WebSocket, state: WsState) {
    {
        let mut s = state.app_state.lock().unwrap();
        s.add_log("connect", "Device connected");
    }
    let _ = state.app_handle.emit("client-connected", json!({}));

    loop {
        match socket.recv().await {
            Some(Ok(Message::Text(text))) => {
                handle_text(text.as_str(), &state, &mut socket).await;
            }
            Some(Ok(Message::Close(_))) | None => break,
            Some(Err(_)) => break,
            _ => {}
        }
    }

    {
        let mut s = state.app_state.lock().unwrap();
        s.add_log("disconnect", "Device disconnected");
        s.connected_client = None;
        s.connected_version = None;
    }
    let _ = state.app_handle.emit("client-disconnected", json!({}));
}

async fn handle_text(text: &str, state: &WsState, socket: &mut WebSocket) {
    let Ok(value): Result<Value, _> = serde_json::from_str(text) else {
        return;
    };

    let msg_type = match value.get("type").and_then(|v| v.as_str()) {
        Some(t) => t.to_string(),
        None => return,
    };

    match msg_type.as_str() {
        "hello" => {
            let client = value
                .get("client")
                .and_then(|v| v.as_str())
                .unwrap_or("unknown")
                .to_string();
            let version = value
                .get("version")
                .and_then(|v| v.as_str())
                .unwrap_or("?")
                .to_string();

            {
                let mut s = state.app_state.lock().unwrap();
                s.connected_client = Some(client.clone());
                s.connected_version = Some(version.clone());
                s.add_log("hello", &format!("hello — {}", client));
            }

            // Respond with ACK
            let ack = json!({ "type": "ack", "server": "pulsecontrol-bridge", "version": "1.0.0" });
            let _ = socket.send(Message::Text(ack.to_string().into())).await;

            let _ = state.app_handle.emit(
                "hello-received",
                json!({ "client": client, "version": version }),
            );

            emit_last_activity(state);
        }

        "midi_cc" => {
            let cc = value
                .get("cc")
                .and_then(|v| v.as_u64())
                .unwrap_or(0)
                .min(127) as u8;
            let val = value
                .get("value")
                .and_then(|v| v.as_u64())
                .unwrap_or(0)
                .min(127) as u8;
            let channel = value
                .get("channel")
                .and_then(|v| v.as_u64())
                .unwrap_or(1)
                .clamp(1, 16) as u8;

            let detail = format!("CH{} CC{} val={}", channel, cc, val);

            {
                let mut s = state.app_state.lock().unwrap();
                if let Some(ref mut conn) = s.midi_out {
                    if let Err(e) = midi::send_cc(conn, channel, cc, val) {
                        eprintln!("MIDI send error: {}", e);
                    }
                }
                s.add_log("midi_cc", &detail);
            }

            emit_last_activity(state);
        }

        "transport" => {
            let cc = value
                .get("cc")
                .and_then(|v| v.as_u64())
                .unwrap_or(0)
                .min(127) as u8;
            let val = value
                .get("value")
                .and_then(|v| v.as_u64())
                .unwrap_or(0)
                .min(127) as u8;
            let channel = value
                .get("channel")
                .and_then(|v| v.as_u64())
                .unwrap_or(1)
                .clamp(1, 16) as u8;
            let action = value
                .get("action")
                .and_then(|v| v.as_str())
                .unwrap_or("")
                .to_string();

            let detail = format!("{} — CH{} CC{} val={}", action, channel, cc, val);

            {
                let mut s = state.app_state.lock().unwrap();
                if let Some(ref mut conn) = s.midi_out {
                    if let Err(e) = midi::send_cc(conn, channel, cc, val) {
                        eprintln!("MIDI send error: {}", e);
                    }
                }
                s.add_log("transport", &detail);
            }

            emit_last_activity(state);
        }

        _ => {}
    }
}

fn emit_last_activity(state: &WsState) {
    let entry = {
        let s = state.app_state.lock().unwrap();
        s.activity_log.last().cloned()
    };
    if let Some(entry) = entry {
        let _ = state.app_handle.emit("activity", entry);
    }
}
