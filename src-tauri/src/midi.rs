use midir::{MidiOutput, MidiOutputConnection};
use midir::os::unix::VirtualOutput;

pub fn create_virtual_port(name: &str) -> Result<MidiOutputConnection, String> {
    let midi_out = MidiOutput::new("PulseControl Bridge").map_err(|e| e.to_string())?;
    midi_out.create_virtual(name).map_err(|e| e.to_string())
}

pub fn send_cc(conn: &mut MidiOutputConnection, channel: u8, cc: u8, value: u8) -> Result<(), String> {
    let status = 0xB0 | ((channel.saturating_sub(1)) & 0x0F);
    conn.send(&[status, cc & 0x7F, value & 0x7F])
        .map_err(|e| e.to_string())
}
