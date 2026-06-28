#!/usr/bin/env python3
"""Per-prompt × per-scheme report — show exactly which test cases pass on
which tool-naming schemes. Aggregates across all 6 arms.

Each cell shows `pass/total` for that (promptId, scheme) pair: total = arms
that ran this combo (up to 6), pass = arms that passed.

Re-runnable; safe on partial logs.
"""

from __future__ import annotations

import collections
import pathlib
import sys

HERE = pathlib.Path(__file__).parent
sys.path.insert(0, str(HERE))
from parser import parse_log  # type: ignore  # noqa: E402

CANONICAL_SCHEMES = ['baseline', 'verbs', 'short', 'verbose', 'nouns', 'domain', 'imperative']


def main() -> int:
    log = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "/tmp/tool-scheme-multi.log")
    rows = parse_log(log)
    if not rows:
        print("(no rows)")
        return 1

    schemes_seen = {r['scheme'] for r in rows}
    schemes = [s for s in CANONICAL_SCHEMES if s in schemes_seen]

    # Group by promptId × scheme → [pass, total]
    cell = collections.defaultdict(lambda: [0, 0])
    for r in rows:
        cell[(r['promptId'], r['scheme'])][1] += 1
        if r['ok']:
            cell[(r['promptId'], r['scheme'])][0] += 1

    # Stable prompt ordering: category first, then numeric id
    prompts = sorted({r['promptId'] for r in rows})

    def category_order_key(pid: str) -> tuple:
        cat_order = [
            'pivot-builder', 'chart-suggest', 'outlier-hunt', 'what-if-ghost',
            'investigation-log', 'data-story', 'surprise-me',
            'pdf-report', 'formula', 'filter', 'sort', 'group-agg', 'chart', 'pivot',
        ]
        prompt_to_cat = {r['promptId']: r['category'] for r in rows}
        cat = prompt_to_cat.get(pid, 'zzz')
        try:
            order = cat_order.index(cat)
        except ValueError:
            order = 99
        return (order, pid)

    prompts.sort(key=category_order_key)

    body = ["# Per-prompt × per-scheme report\n"]
    body.append("Each cell is the count of arms that passed this exact (prompt, scheme) "
                "pair out of arms that ran it. Total possible per cell = up to 6 arms.\n")
    body.append("This view exposes *which test cases* benefit from which tool naming. "
                "Cells with `0/N` show universal failures (e.g. SKILL.md authoring issue). "
                "Cells where one scheme wins by a clear margin reveal naming-sensitive prompts.\n")

    # Header
    headers = ['Prompt id', 'Category', *schemes]
    body.append("| " + " | ".join(headers) + " |")
    body.append("|" + "---|" * len(headers))

    prompt_to_cat = {r['promptId']: r['category'] for r in rows}
    for pid in prompts:
        row = [f"`{pid}`", prompt_to_cat[pid]]
        for s in schemes:
            p, t = cell[(pid, s)]
            if t == 0:
                row.append("—")
            else:
                row.append(f"{p}/{t}")
        body.append("| " + " | ".join(row) + " |")

    # Footer: per-scheme totals
    body.append("\n## Per-prompt summary (overall pass rate across all schemes × arms)\n")
    body.append("| Prompt id | Category | Total pass | Total runs | Pass% |")
    body.append("|---|---|---|---|---|")
    by_pid = collections.defaultdict(lambda: [0, 0])
    for r in rows:
        by_pid[r['promptId']][1] += 1
        if r['ok']:
            by_pid[r['promptId']][0] += 1
    for pid in sorted(by_pid.keys(), key=category_order_key):
        p, t = by_pid[pid]
        pct = f"{p * 100 / t:.0f}%" if t else "—"
        body.append(f"| `{pid}` | {prompt_to_cat.get(pid, '?')} | {p} | {t} | {pct} |")

    # Hard cases: prompts where ≤30% pass overall
    hard = [(pid, p, t) for pid, (p, t) in by_pid.items() if t and (p / t) <= 0.3]
    hard.sort(key=lambda x: x[1] / max(x[2], 1))
    if hard:
        body.append("\n## Hard prompts (≤30% overall pass rate)\n")
        body.append("| Prompt id | Category | Pass | Total | Pass% |")
        body.append("|---|---|---|---|---|")
        for pid, p, t in hard:
            pct = f"{p * 100 / t:.0f}%"
            body.append(f"| `{pid}` | {prompt_to_cat.get(pid, '?')} | {p} | {t} | {pct} |")

    # Naming-sensitive prompts: where best scheme - worst scheme > 50pp
    sensitive = []
    for pid in prompts:
        per_scheme = []
        for s in schemes:
            p, t = cell[(pid, s)]
            if t:
                per_scheme.append((p / t, s, p, t))
        if len(per_scheme) >= 2:
            per_scheme.sort()
            best = per_scheme[-1]
            worst = per_scheme[0]
            spread_pp = (best[0] - worst[0]) * 100
            if spread_pp >= 50:
                sensitive.append((pid, best, worst, spread_pp))

    sensitive.sort(key=lambda x: -x[3])
    if sensitive:
        body.append("\n## Naming-sensitive prompts (>=50pp spread between best/worst scheme)\n")
        body.append("| Prompt id | Category | Best scheme | Best | Worst scheme | Worst | Spread |")
        body.append("|---|---|---|---|---|---|---|")
        for pid, best, worst, spread in sensitive:
            body.append(f"| `{pid}` | {prompt_to_cat.get(pid, '?')} | "
                        f"{best[1]} | {best[2]}/{best[3]} ({best[0]*100:.0f}%) | "
                        f"{worst[1]} | {worst[2]}/{worst[3]} ({worst[0]*100:.0f}%) | "
                        f"{spread:.0f}pp |")

    out_path = HERE / "06-per-prompt.md"
    out_path.write_text("\n".join(body) + "\n")
    print(f"wrote {out_path} from {len(rows)} rows")
    return 0


if __name__ == "__main__":
    sys.exit(main())
