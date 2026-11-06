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
LINKS_TEMP=""
trap 'rm -f "$TEMP_FILE"; [ -z "$LINKS_TEMP" ] || rm -f "$LINKS_TEMP"' EXIT HUP INT TERM
if [ -f "$CONFIG_FILE" ]; then
  awk '/^[[:space:]]*host[[:space:]]*:/ { print; exit }' "$CONFIG_FILE" > "$TEMP_FILE"
fi
chmod 644 "$TEMP_FILE"
mv "$TEMP_FILE" "$HOST_FILE"

# Expose only link fields, never the complete printer configuration.
LINKS_TEMP=$(mktemp "$FLUIDD_DIR/.dashboard-links.XXXXXX")
for LINK_CONFIG in "$CONFIG_DIR/extended/extended2.cfg" "$CONFIG_DIR/extended/ext_dash_links.cfg"; do
  [ -f "$LINK_CONFIG" ] || continue
  awk -v source="$LINK_CONFIG" '
    /^[[:space:]]*#+[[:space:]]*\[/ { selected=0; next }
    /^[[:space:]]*\[/ {
      section=$0
      sub(/^[[:space:]]*/, "", section)
      sub(/[[:space:]]*([#;].*)?$/, "", section)
      selected=((source ~ /\/extended2\.cfg$/ && section == "[spoolman]") ||
                (source ~ /\/ext_dash_links\.cfg$/ && (section == "[RFID Reader Link]" ||
                section ~ /^\[Dashboard Link[123]\]$/)))
      if (selected) print section
      next
    }
    selected && /^[[:space:]]*([Hh][Oo][Ss][Tt]|[Nn][Aa][Mm][Ee])[[:space:]]*:/ { print }
  ' "$LINK_CONFIG" >> "$LINKS_TEMP"
done
chmod 644 "$LINKS_TEMP"
mv "$LINKS_TEMP" "$FLUIDD_DIR/custom-dashboard-links.cfg"
