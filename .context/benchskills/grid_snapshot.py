#!/usr/bin/env python3
"""Print a single compact grid snapshot: arm × scheme pass rates + totals.

Re-runnable on a partial log so we can see live progress mid-sweep.
"""

from __future__ import annotations

import collections
import pathlib
import sys

# Reuse parser.py's parse_log so the parsing logic stays in one place.
HERE = pathlib.Path(__file__).parent
sys.path.insert(0, str(HERE))
from parser import parse_log  # type: ignore  # noqa: E402


def pct(p: int, t: int) -> str:
    return f"{p * 100 / t:.0f}%" if t else "—"


def cell(p: int, t: int) -> str:
    return f"{p}/{t} ({pct(p, t)})" if t else "-/-"


def main() -> int:
    log = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "/tmp/tool-scheme-multi.log")
    rows = parse_log(log)
    if not rows:
        print("(no benchmark rows yet)")
        return 1

    arms = sorted({r["arm"] for r in rows})
    schemes_seen = sorted({r["scheme"] for r in rows})
    canonical_order = ["baseline", "verbs", "short", "verbose", "nouns", "domain", "imperative"]
    schemes = [s for s in canonical_order if s in schemes_seen] + [
        s for s in schemes_seen if s not in canonical_order
    ]

    by_arm_scheme = collections.defaultdict(lambda: [0, 0])
    for r in rows:
        by_arm_scheme[(r["arm"], r["scheme"])][0 if r["ok"] else 1] += 1

    # Build text grid with padded cells for terminal-readability
    headers = ["arm"] + schemes + ["arm avg"]
    body: list[list[str]] = []
    for arm in arms:
        row = [arm]
        pa = fa = 0
        for s in schemes:
            p, f = by_arm_scheme[(arm, s)]
            pa += p
            fa += f
            row.append(cell(p, p + f))
        row.append(pct(pa, pa + fa))
        body.append(row)

    # Scheme totals row
    totals = ["TOTAL"]
    grand_p = grand_t = 0
    for s in schemes:
        slice_ = [r for r in rows if r["scheme"] == s]
        p = sum(1 for r in slice_ if r["ok"])
        t = len(slice_)
        grand_p += p
        grand_t += t
        totals.append(cell(p, t))
    totals.append(pct(grand_p, grand_t))
    body.append(totals)

    # Column widths
    all_rows = [headers] + body
    widths = [max(len(row[i]) for row in all_rows) for i in range(len(headers))]

    def fmt(row: list[str]) -> str:
        return "  " + "  ".join(c.ljust(w) for c, w in zip(row, widths))

    print(f"\n=== Grid snapshot ({len(rows)} rows parsed from {log}) ===\n")
    print(fmt(headers))
    print("  " + "  ".join("-" * w for w in widths))
    for row in body[:-1]:
        print(fmt(row))
    print("  " + "  ".join("-" * w for w in widths))
    print(fmt(body[-1]))
    print()

    return 0


if __name__ == "__main__":
    sys.exit(main())
