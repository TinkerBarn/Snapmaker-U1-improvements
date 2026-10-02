#!/bin/sh
set -eu

# Capture the configured host during installation and printer startup.
if [ -n "${1:-}" ]; then
  CONFIG_DIR="$1"
elif [ -f /home/lava/printer_data/config/printer.cfg ]; then
  CONFIG_DIR=/home/lava/printer_data/config
else
  CONFIG_DIR=/oem/printer_data/config
fi
FLUIDD_DIR="${2:-/home/lava/fluidd}"
CONFIG_FILE="$CONFIG_DIR/extended/klipper/dragonbreath.cfg"
HOST_FILE="$FLUIDD_DIR/custom-dragonbreath-host.txt"
TEMP_FILE=$(mktemp "$FLUIDD_DIR/.dragonbreath-host.XXXXXX")
trap 'rm -f "$TEMP_FILE"' EXIT HUP INT TERM
if [ -f "$CONFIG_FILE" ]; then
  awk '/^[[:space:]]*host[[:space:]]*:/ { print; exit }' "$CONFIG_FILE" > "$TEMP_FILE"
fi
chmod 644 "$TEMP_FILE"
mv "$TEMP_FILE" "$HOST_FILE"
