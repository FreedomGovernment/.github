#!/bin/bash
# Download OpenCasebook featured casebooks as Markdown
# Usage: ./download_casebooks.sh
#
# Requires: pandoc, python3, beautifulsoup4 (pip install beautifulsoup4)
#
# The site is behind Cloudflare. This script uses the Wayback Machine
# to fetch the printable HTML and converts it to Markdown.
#
# If you have a browser session that can pass Cloudflare, you can
# also use the direct export endpoints:
#   https://opencasebook.org/casebooks/<id>/export.docx
#   https://opencasebook.org/casebooks/<id>/as-printable-html/

set -euo pipefail

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
MAPPING="$BASE_DIR/casebook_mapping.json"
SCRATCH="/tmp/opencasebook_download"
mkdir -p "$SCRATCH"

# Check dependencies
for cmd in pandoc python3; do
    if ! command -v "$cmd" &>/dev/null; then
        echo "ERROR: $cmd not found. Install it first."
        exit 1
    fi
done

# Get casebook list from mapping
python3 -c "
import json, sys
with open('$MAPPING') as f:
    data = json.load(f)
for cid in sorted(data.keys(), key=int):
    print(cid)
" | while read -r CASEBOOK_ID; do
    # Get category info
    CATEGORY=$(python3 -c "
import json
with open('$MAPPING') as f:
    data = json.load(f)
info = data['$CASEBOOK_ID']
print(info['major'] + '/' + info['minor'])
")
    
    OUTPUT_DIR="$BASE_DIR/$CATEGORY"
    mkdir -p "$OUTPUT_DIR"
    
    echo "=== Casebook $CASEBOOK_ID → $CATEGORY ==="
    
    # Try Wayback Machine for the printable HTML
    URL="https://web.archive.org/web/2025/https://opencasebook.org/casebooks/$CASEBOOK_ID/as-printable-html/"
    HTML_FILE="$SCRATCH/casebook_${CASEBOOK_ID}.html"
    MD_FILE="$OUTPUT_DIR/casebook_${CASEBOOK_ID}.md"
    
    echo "  Fetching from Wayback: $URL"
    if curl -sL --max-time 60 -A "Mozilla/5.0" "$URL" -o "$HTML_FILE" 2>/dev/null; then
        # Check if we got actual content (not a 404 page)
        if grep -q "casebook" "$HTML_FILE" 2>/dev/null && [ $(wc -c < "$HTML_FILE") -gt 5000 ]; then
            echo "  Converting to Markdown..."
            if pandoc "$HTML_FILE" -f html -t gfm --wrap=none -o "$MD_FILE" 2>/dev/null; then
                SIZE=$(wc -c < "$MD_FILE")
                LINES=$(wc -l < "$MD_FILE")
                echo "  ✓ $MD_FILE ($SIZE bytes, $LINES lines)"
            else
                echo "  ✗ Pandoc conversion failed"
            fi
        else
            echo "  ✗ Wayback has no archive for this casebook"
        fi
    else
        echo "  ✗ Fetch failed"
    fi
    
    # Pause between requests to be polite
    sleep 2
done

echo ""
echo "=== Done ==="
echo "Check $BASE_DIR for downloaded casebooks."
