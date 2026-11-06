#!/bin/sh
set -eu

PERSIST_DIR="/home/lava/printer_data/misc/u1-ui-tweaks"
FLUIDD_DIR="/home/lava/fluidd"

INDEX_HTML="$FLUIDD_DIR/index.html"
INDEX_BAK="$FLUIDD_DIR/index.html.original"

CUSTOM_CSS_SRC="$PERSIST_DIR/custom.css"
CUSTOM_JS_SRC="$PERSIST_DIR/custom.js"

CUSTOM_CSS_DST="$FLUIDD_DIR/custom.css"
CUSTOM_JS_DST="$FLUIDD_DIR/custom.js"

echo "[u1-ui-tweaks] Installing UI tweaks..."

# backup once (useful for debugging)
if [ -f "$INDEX_HTML" ] && [ ! -f "$INDEX_BAK" ]; then
  cp "$INDEX_HTML" "$INDEX_BAK"
fi

cp "$CUSTOM_CSS_SRC" "$CUSTOM_CSS_DST"
cp "$CUSTOM_JS_SRC" "$CUSTOM_JS_DST"

# DragonBreath host snapshot (installation and printer startup).
if [ -f "$PERSIST_DIR/dragonbreath-config.sh" ]; then
  sh "$PERSIST_DIR/dragonbreath-config.sh"
fi

# inject custom.css and custom.js if missing
grep -q 'href="\./custom\.css"' "$INDEX_HTML" ||   sed -i '/assets\/index-.*\.css/a\ \ \ \ <link rel="stylesheet" href="./custom.css">' "$INDEX_HTML"

grep -q 'src="\./custom\.js[?"]' "$INDEX_HTML" ||   sed -i '/href="\.\/custom\.css"/a\ \ \ \ <script src="./custom.js"></script>' "$INDEX_HTML"

# A content-specific URL prevents an older UI variant from staying cached.
JS_VERSION=$(cksum "$CUSTOM_JS_DST" | awk '{print $1}')
sed -i "s|src=\"\./custom\.js[^\"]*\"|src=\"./custom.js?v=$JS_VERSION\"|g" "$INDEX_HTML"
