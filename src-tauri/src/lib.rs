mod discovery;
mod midi;
mod server;
mod state;

use std::sync::{Arc, Mutex};
use state::{ActivityEntry, AppState, ServerInfo};

// ─── Tauri commands ──────────────────────────────────────────────────────────

#[tauri::command]
fn get_server_info(state: tauri::State<'_, Arc<Mutex<AppState>>>) -> ServerInfo {
    let s = state.lock().unwrap();
    ServerInfo {
        ip: s.local_ip.clone(),
        port: 8765,
        ws_url: format!("ws://{}:8765", s.local_ip),
        status: s.server_status.clone(),
        midi_port_name: s.midi_port_name.clone(),
    }
}

#[tauri::command]
fn get_activity_log(state: tauri::State<'_, Arc<Mutex<AppState>>>) -> Vec<ActivityEntry> {
    state.lock().unwrap().activity_log.clone()
}

#[tauri::command]
fn clear_activity_log(state: tauri::State<'_, Arc<Mutex<AppState>>>) {
    state.lock().unwrap().activity_log.clear();
}

#[tauri::command]
fn set_midi_port(
    name: String,
    state: tauri::State<'_, Arc<Mutex<AppState>>>,
) -> Result<(), String> {
    let mut s = state.lock().unwrap();
    // Drop the old connection first
    s.midi_out = None;
    // Create new virtual port with the requested name
    let conn = midi::create_virtual_port(&name)?;
    s.midi_out = Some(conn);
    s.midi_port_name = name;
    Ok(())
}

// ─── Entry point ─────────────────────────────────────────────────────────────

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let shared_state = Arc::new(Mutex::new(AppState::new()));

    // Resolve local LAN IP
    if let Ok(ip) = local_ip_address::local_ip() {
        shared_state.lock().unwrap().local_ip = ip.to_string();
    }

    // Open CoreMIDI virtual output port
    {
        let mut s = shared_state.lock().unwrap();
        match midi::create_virtual_port("PulseControl") {
            Ok(conn) => {
                s.midi_out = Some(conn);
                s.midi_port_name = "PulseControl".to_string();
            }
            Err(e) => eprintln!("MIDI init error: {}", e),
        }
    }

    let ws_state = shared_state.clone();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(shared_state)
        .setup(move |app| {
            let app_handle = app.handle().clone();
            let local_ip = {
                let s = ws_state.lock().unwrap();
                s.local_ip.clone()
            };

            // Mark server as running
            ws_state.lock().unwrap().server_status = "running".to_string();

            // Register mDNS service (non-fatal if it fails)
            if let Err(e) = discovery::register_mdns(&local_ip) {
                eprintln!("mDNS registration error: {}", e);
            }

            // Spawn the axum WebSocket server on the tokio runtime
            let state_for_ws = ws_state.clone();
            tauri::async_runtime::spawn(async move {
                server::start(state_for_ws, app_handle).await;
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_server_info,
            get_activity_log,
            clear_activity_log,
            set_midi_port,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
