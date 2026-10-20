"""Check local Markdown targets and obvious publication mistakes.

No network requests; this is not a comprehensive secret scanner.
SPDX-License-Identifier: MIT
"""
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
errors = []
documents = sorted(ROOT.rglob("*.md"))
documents = [p for p in documents if ".git" not in p.parts and "node_modules" not in p.parts]

for path in documents:
    text = path.read_text(encoding="utf-8")
    label = path.relative_to(ROOT).as_posix()
    # Strip code fences before checking Markdown links.
    prose = re.sub(r"```.*?```", "", text, flags=re.S)
    for target in re.findall(r"!?\[[^\]]*\]\(([^)]+)\)", prose):
        target = target.strip().split(" ", 1)[0].strip("<>")
        parsed = urlsplit(target)
        if parsed.scheme or parsed.netloc or not parsed.path:
            continue
        destination = (path.parent / unquote(parsed.path)).resolve()
        if not destination.is_relative_to(ROOT) or not destination.exists():
            errors.append(f"{label}: missing or external local target: {target}")
    if re.search(r"(?:[A-Za-z]:[\\/](?:Users|codex|devtools)[\\/])", text):
        errors.append(f"{label}: machine-specific path found")
    if re.search(r"https?://(?:localhost|127\.0\.0\.1)(?::\d+)?", text):
        errors.append(f"{label}: local preview URL should not be a public reference")
    if re.search(r"(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|-----BEGIN .*PRIVATE KEY-----)", text):
        errors.append(f"{label}: possible credential found")

if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"OK: {len(documents)} Markdown documents; local targets and basic publication checks passed.")
