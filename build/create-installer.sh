#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
RESOURCES="$SCRIPT_DIR/installer-resources"
SCRIPTS="$RESOURCES/scripts"
PKG_WORK="$REPO_ROOT/_pkgwork"
DIST="$REPO_ROOT/releases"
APP_VERSION="1.0.0"
APP_NAME="PulseControl Bridge"
IDENTIFIER="studio.ernestkeyz.pulsecontrol-bridge"

GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'
info() { echo -e "${CYAN}[pkg]${NC}   $*"; }
ok()   { echo -e "${GREEN}[ok]${NC}    $*"; }

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║  Ernest Keyz Studios — PulseControl Bridge Installer  ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

UNIVERSAL_APP="$DIST/${APP_NAME}.app"

if [ ! -d "$UNIVERSAL_APP" ]; then
  echo "❌  Universal app not found at: $UNIVERSAL_APP"
  echo "    Run ./build/build-universal.sh first."
  exit 1
fi

rm -rf "$PKG_WORK"
mkdir -p "$PKG_WORK/stage/Applications" "$PKG_WORK/components" "$DIST"

info "Staging ${APP_NAME}.app…"
cp -r "$UNIVERSAL_APP" "$PKG_WORK/stage/Applications/"

chmod +x "$SCRIPTS/preinstall" "$SCRIPTS/postinstall"

info "Building installer component…"
pkgbuild \
  --root "$PKG_WORK/stage" \
  --identifier "$IDENTIFIER" \
  --version "$APP_VERSION" \
  --scripts "$SCRIPTS" \
  "$PKG_WORK/components/pulsecontrol-bridge.pkg"

info "Verifying payload…"
pkgutil --payload-files "$PKG_WORK/components/pulsecontrol-bridge.pkg" | grep -q "PulseControl Bridge.app" \
  && ok "Payload verified — app is in /Applications" \
  || { echo "❌  App not found in package payload"; exit 1; }

ok "Component package built"

FINAL_PKG="$DIST/PulseControl-Bridge-${APP_VERSION}-macOS.pkg"

info "Assembling final installer → $FINAL_PKG"
productbuild \
  --distribution "$RESOURCES/distribution.xml" \
  --resources "$RESOURCES" \
  --package-path "$PKG_WORK/components" \
  "$FINAL_PKG"

rm -rf "$PKG_WORK"

echo ""
ok "Installer ready:"
echo ""
echo "  ▸  $FINAL_PKG"
echo "     $(du -sh "$FINAL_PKG" | cut -f1)"
echo ""
