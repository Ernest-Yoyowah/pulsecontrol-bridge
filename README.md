# PulseControl Bridge

**PulseControl Bridge** is the macOS desktop companion to **PulseControl Mobile** (iOS / Android).  
It runs a WebSocket server that receives MIDI messages from the mobile app and forwards them to a CoreMIDI virtual port — visible in Logic Pro X, Ableton Live, and any DAW or hardware that reads MIDI.

Built and maintained by **Ernest Keyz Studios**.

---

## What It Does

- Runs a **WebSocket server** on port `8765`
- Receives **MIDI CC** and **transport** commands from PulseControl Mobile over Wi-Fi
- Forwards them to a **CoreMIDI virtual output port** named `PulseControl`
- Displays a **QR code** so the mobile app can scan and connect instantly
- Advertises itself via **mDNS** (`_pulsecontrol._tcp.local.`) for automatic discovery
- Shows a live **activity feed** of every incoming message

---

## Requirements

- macOS 11 Big Sur or later (Intel or Apple Silicon)
- Node.js 18 or later
- Rust (install via [rustup.rs](https://rustup.rs))
- Xcode Command Line Tools — `xcode-select --install`

---

## Development

```bash
# Install dependencies
npm install

# Start dev mode (hot-reload frontend + Rust watch)
npm run tauri dev
```

The app window opens at 520 × 640 px. Changes to `src/` hot-reload instantly. Rust changes trigger a recompile.

---

## Production Build

### Option A — Universal DMG (quick)

Builds a single `.dmg` containing a universal binary (Intel + Apple Silicon):

```bash
export PATH="$HOME/.cargo/bin:$PATH"
rustup target add x86_64-apple-darwin aarch64-apple-darwin
npm run tauri build -- --target universal-apple-darwin
```

Output: `src-tauri/target/universal-apple-darwin/release/bundle/dmg/`

---

### Option B — Universal `.pkg` Installer (recommended for distribution)

Produces a macOS Installer package with a branded welcome/conclusion screen.

**Step 1 — Build universal binary:**

```bash
./build/build-universal.sh
```

This compiles for both `x86_64-apple-darwin` and `aarch64-apple-darwin`, merges them with `lipo`, and places `PulseControl Bridge.app` in `dist/`.

**Step 2 — Create installer:**

```bash
./build/create-installer.sh
```

Output: `dist/PulseControl-Bridge-1.0.0-macOS.pkg`

The installer:

- Shows a branded welcome screen
- Removes any previous version automatically (pre-install script)
- Clears macOS quarantine flags after install (post-install script)
- Installs to `/Applications/PulseControl Bridge.app`

---

## Uninstall

```bash
./build/uninstall.sh
```

Or manually: drag `PulseControl Bridge.app` from `/Applications` to Trash.

---

## Architecture

```
src-tauri/src/
  lib.rs         Tauri commands + app bootstrap
  server.rs      axum WebSocket server (port 8765)
  midi.rs        CoreMIDI virtual port via midir
  discovery.rs   mDNS service registration via mdns-sd
  state.rs       Shared AppState + ActivityEntry types

src/
  App.tsx                       Root layout + polling
  store/useServerStore.ts       Zustand state
  hooks/useTauriEvents.ts       Tauri event listeners
  components/
    Header.tsx                  App title + status dot
    QrPanel.tsx                 QR code + ws:// URL
    StatusCard.tsx              WebSocket / MIDI / client status
    ActivityLog.tsx             Live activity feed
    Footer.tsx                  MIDI port rename + attribution
```

---

## WebSocket Protocol

Connects on `ws://<LAN_IP>:8765/` — text frames, JSON only.

| Direction       | Message                                                                            |
| --------------- | ---------------------------------------------------------------------------------- |
| Mobile → Bridge | `{ "type": "hello", "client": "pulsecontrol-mobile", "version": "1.0.0" }`         |
| Bridge → Mobile | `{ "type": "ack", "server": "pulsecontrol-bridge", "version": "1.0.0" }`           |
| Mobile → Bridge | `{ "type": "midi_cc", "cc": 7, "value": 90, "channel": 1, ... }`                   |
| Mobile → Bridge | `{ "type": "transport", "action": "play", "cc": 118, "value": 127, "channel": 1 }` |

---

## License

Copyright © 2026 Ernest Yoyowah / Ernest Keyz Studios. All rights reserved.

This software and all associated source code, assets, and documentation are the exclusive property of Ernest Yoyowah / Ernest Keyz Studios. No part of this software may be reproduced, distributed, modified, sublicensed, or used in any form without prior written permission of the copyright holder.
