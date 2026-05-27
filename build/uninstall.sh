#!/usr/bin/env bash

set -euo pipefail

rm -f "/Library/Audio/Plug-Ins/VST3/PulseControl Bridge.app" 2>/dev/null || true

TARGETS=(
  "/Applications/PulseControl Bridge.app"
)

FOUND=0
for t in "${TARGETS[@]}"; do
  if [ -e "$t" ]; then
    echo "Removing $t"
    sudo rm -rf "$t"
    FOUND=1
  fi
done

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║  Ernest Keyz Studios — PulseControl Bridge Remove     ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

if [ "$FOUND" -eq 0 ]; then
  echo "Nothing to remove — PulseControl Bridge is not installed."
else
  echo "PulseControl Bridge uninstalled."
fi
echo ""
