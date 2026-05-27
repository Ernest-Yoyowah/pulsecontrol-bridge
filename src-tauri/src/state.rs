use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActivityEntry {
    pub timestamp: u64,
    pub message_type: String,
    pub detail: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct ServerInfo {
    pub ip: String,
    pub port: u16,
    pub ws_url: String,
    pub status: String,
    pub midi_port_name: String,
}

pub struct AppState {
    pub midi_out: Option<midir::MidiOutputConnection>,
    pub activity_log: Vec<ActivityEntry>,
    pub connected_client: Option<String>,
    pub connected_version: Option<String>,
    pub server_status: String,
    pub midi_port_name: String,
    pub local_ip: String,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            midi_out: None,
            activity_log: Vec::new(),
            connected_client: None,
            connected_version: None,
            server_status: "starting".to_string(),
            midi_port_name: "PulseControl".to_string(),
            local_ip: "127.0.0.1".to_string(),
        }
    }

    pub fn add_log(&mut self, message_type: &str, detail: &str) {
        let ts = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis() as u64;
        self.activity_log.push(ActivityEntry {
            timestamp: ts,
            message_type: message_type.to_string(),
            detail: detail.to_string(),
        });
        // Keep only the last 50 entries
        if self.activity_log.len() > 50 {
            let drain = self.activity_log.len() - 50;
            self.activity_log.drain(0..drain);
        }
    }
}
