#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DIST="$REPO_ROOT/releases"
APP_VERSION="1.0.0"
APP_NAME="PulseControl Bridge"
CARGO_PKG="pulsecontrol-bridge"

GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; NC='\033[0m'
info() { echo -e "${CYAN}[build]${NC} $*"; }
ok()   { echo -e "${GREEN}[ok]${NC}    $*"; }
warn() { echo -e "${YELLOW}[warn]${NC}  $*"; }

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║  Ernest Keyz Studios — PulseControl Bridge            ║"
echo "║  Universal Build  •  macOS Intel + Apple Silicon      ║"
echo "║  Version: $APP_VERSION                                    ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

info "Checking toolchains…"

RUSTUP_BIN="rustup"
if ! command -v rustup &>/dev/null; then
  RUSTUP_BIN="$HOME/.cargo/bin/rustup"
  if [ ! -x "$RUSTUP_BIN" ]; then
    echo "❌  rustup not found. Install from https://rustup.rs/"
    exit 1
  fi
fi

if ! command -v node &>/dev/null; then
  echo "❌  Node.js not found. Install from https://nodejs.org/"
  exit 1
fi

if ! command -v lipo &>/dev/null; then
  echo "❌  lipo not found. Install Xcode Command Line Tools:"
  echo "    xcode-select --install"
  exit 1
fi

export PATH="$HOME/.cargo/bin:$PATH"

info "Installing Rust targets (x86_64 + arm64)…"
"$RUSTUP_BIN" target add x86_64-apple-darwin aarch64-apple-darwin
ok "Rust targets ready"

info "Installing Node dependencies…"
cd "$REPO_ROOT"
npm ci --silent
ok "Node dependencies installed"

mkdir -p "$DIST"

info "Building frontend…"
npm run build
ok "Frontend built"

info "Compiling Rust binary for x86_64-apple-darwin…"
cd "$REPO_ROOT/src-tauri"
cargo build --release --target x86_64-apple-darwin
cd "$REPO_ROOT"

X86_BIN="$REPO_ROOT/src-tauri/target/x86_64-apple-darwin/release/$CARGO_PKG"
if [ ! -f "$X86_BIN" ]; then
  echo "❌  x86_64 binary not found at: $X86_BIN"
  echo "    Ensure 'rustup target add x86_64-apple-darwin' succeeded and retry."
  exit 1
fi
ok "x86_64 binary compiled"

info "Building aarch64-apple-darwin app bundle (template)…"
npm run tauri build -- --target aarch64-apple-darwin --bundles app
ok "arm64 build complete"

ARM_APP="$REPO_ROOT/src-tauri/target/aarch64-apple-darwin/release/bundle/macos/${APP_NAME}.app"
if [ ! -d "$ARM_APP" ]; then
  echo "❌  arm64 .app not found at: $ARM_APP"
  exit 1
fi

ARM_BIN=$(find "$ARM_APP/Contents/MacOS" -maxdepth 1 -type f | head -1)
if [ -z "$ARM_BIN" ]; then
  echo "❌  No executable found inside: $ARM_APP/Contents/MacOS/"
  exit 1
fi
BIN_NAME=$(basename "$ARM_BIN")

UNIVERSAL_APP="$DIST/${APP_NAME}.app"
rm -rf "$UNIVERSAL_APP"
cp -r "$ARM_APP" "$UNIVERSAL_APP"
UNI_BIN="$UNIVERSAL_APP/Contents/MacOS/$BIN_NAME"

info "Assembling universal .app…"
lipo -create "$X86_BIN" "$ARM_BIN" -output "$UNI_BIN"
ok "Universal binary created"

echo ""
info "Architecture verification:"
echo "  $(lipo -archs "$UNI_BIN")"
echo ""
ok "Universal app → $UNIVERSAL_APP"
echo ""

info "Building installer package…"
bash "$SCRIPT_DIR/create-installer.sh"
