#!/usr/bin/env python3
"""Print compact oracle info for cards in data/cards.json.

Usage: python3 scripts/card.py "Sol Ring" "mox"   (case-insensitive substring match)
"""
import json
import sys
from pathlib import Path

cards = json.loads((Path(__file__).parent.parent / "data" / "cards.json").read_text())

for query in sys.argv[1:]:
    matches = [c for c in cards if query.lower() in c["name"].lower()]
    if not matches:
        print(f"## no match: {query}")
    for c in matches:
        for f in c.get("card_faces") or [c]:
            print(f"## {f['name']} | {f.get('mana_cost', '')} | {f['type_line']}")
            print(f.get("oracle_text", ""))
        print()
