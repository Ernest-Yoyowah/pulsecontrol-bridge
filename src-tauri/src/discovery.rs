use mdns_sd::{ServiceDaemon, ServiceInfo};
use std::collections::HashMap;

/// Registers a _pulsecontrol._tcp.local. mDNS service on port 8765.
/// The returned daemon must be kept alive for the service to remain advertised.
pub fn register_mdns(local_ip: &str) -> Result<ServiceDaemon, String> {
    let mdns = ServiceDaemon::new().map_err(|e| e.to_string())?;

    let host_name = "pulsecontrol-bridge.local.";
    let props: HashMap<String, String> = HashMap::new();

    let service_info = ServiceInfo::new(
        "_pulsecontrol._tcp.local.",
        "PulseControl Bridge",
        host_name,
        local_ip,
        8765,
        props,
    )
    .map_err(|e| e.to_string())?;

    mdns.register(service_info).map_err(|e| e.to_string())?;

    Ok(mdns)
}
