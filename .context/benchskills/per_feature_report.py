#!/usr/bin/env python3
"""Per-priority-feature × per-arm × per-variant report.

Mirrors FEATURE_MAP from scripts/test-copilot-quality.ts. Each cell is the
pass rate (% and count) for that (feature, arm, variant) cell. Used to drive
the iterate-on-skills loop: low-scoring features point at SKILL.md tweaks.

Run: python3 .context/benchskills/per_feature_report.py <log>
"""

from __future__ import annotations

import collections
import datetime as dt
import pathlib
import sys

HERE = pathlib.Path(__file__).parent
sys.path.insert(0, str(HERE))
from parser import parse_log  # type: ignore  # noqa: E402


FEATURE_MAP = {
    'charts': {'chart-suggest', 'chart'},
    'pivot': {'pivot-builder', 'pivot'},
    'group-agg': {'group-agg'},
    'pdf-report': {'pdf-report'},
    'formula': {'formula', 'what-if-ghost'},
    'insights': {'outlier-hunt', 'surprise-me'},
    'narrative': {'data-story', 'investigation-log'},
    'basic': {'filter', 'sort'},
}


def feature_of(category: str) -> str:
    for feature, cats in FEATURE_MAP.items():
        if category in cats:
            return feature
    return 'other'


def pct(p: int, t: int) -> str:
    return f"{p * 100 / t:.0f}%" if t else "—"


def main() -> int:
    log = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "/tmp/v2-vs-v5.log")
    rows = parse_log(log)
    if not rows:
        print("(no rows)")
        return 1

    # Attach feature
    for r in rows:
        r['feature'] = feature_of(r['category'])

    arms = sorted({r['arm'] for r in rows})
    variants = sorted({r['variant'] for r in rows})
    features = [f for f in FEATURE_MAP if any(r['feature'] == f for r in rows)]

    by = collections.defaultdict(lambda: [0, 0])
    for r in rows:
        by[(r['feature'], r['arm'], r['variant'])][1] += 1
        if r['ok']:
            by[(r['feature'], r['arm'], r['variant'])][0] += 1

    body = ["# Per-priority-feature pass rates", ""]
    body.append(f"_Generated {dt.datetime.now().strftime('%Y-%m-%d %H:%M')} from `{log.name}`._")
    body.append("")
    body.append("Features map (`scripts/test-copilot-quality.ts` `FEATURE_MAP`):")
    body.append("")
    for f, cats in FEATURE_MAP.items():
        body.append(f"- **`{f}`** ← {', '.join(sorted(cats))}")
    body.append("")

    if len(variants) == 1:
        # Single-variant report: rows = arms, columns = features
        v = variants[0]
        body.append(f"## Single-variant report — {v.upper()}")
        body.append("")
        body.append("| arm | " + " | ".join(features) + " | model avg |")
        body.append("|---|" + "---|" * (len(features) + 1))
        for arm in arms:
            cells = [arm]
            p_arm = t_arm = 0
            for f in features:
                p, t = by[(f, arm, v)]
                p_arm += p; t_arm += t
                cells.append(f"{p}/{t} ({pct(p, t)})" if t else "—")
            cells.append(f"**{pct(p_arm, t_arm)}**")
            body.append("| " + " | ".join(cells) + " |")
        # Feature avg row
        feat_avg = ["**feature avg**"]
        for f in features:
            p = sum(1 for r in rows if r['feature'] == f and r['ok'])
            t = sum(1 for r in rows if r['feature'] == f)
            feat_avg.append(f"**{pct(p, t)}**")
        feat_avg.append("")
        body.append("| " + " | ".join(feat_avg) + " |")
    else:
        # Multi-variant report: side-by-side V2/V5 per feature, with delta
        body.append("## Multi-variant comparison")
        body.append("")
        for f in features:
            body.append(f"### Feature: `{f}`")
            body.append("")
            header = ['arm']
            for v in variants:
                header.append(f"{v.upper()} pass")
            header.append('delta')
            body.append("| " + " | ".join(header) + " |")
            body.append("|---|" + "---|" * (len(variants) + 1))
            for arm in arms:
                cells = [arm]
                rates = []
                for v in variants:
                    p, t = by[(f, arm, v)]
                    cells.append(f"{p}/{t} ({pct(p, t)})" if t else "—")
                    rates.append((p / t * 100) if t else 0)
                if len(rates) >= 2:
                    delta = rates[-1] - rates[0]
                    sign = '+' if delta > 0 else ''
                    cells.append(f"**{sign}{delta:.0f}pp**" if abs(delta) > 0.5 else "0")
                else:
                    cells.append('—')
                body.append("| " + " | ".join(cells) + " |")
            # Aggregate row
            agg = ["**TOTAL**"]
            tot_rates = []
            for v in variants:
                p = sum(by[(f, a, v)][0] for a in arms)
                t = sum(by[(f, a, v)][1] for a in arms)
                agg.append(f"**{p}/{t} ({pct(p, t)})**")
                tot_rates.append((p / t * 100) if t else 0)
            if len(tot_rates) >= 2:
                d = tot_rates[-1] - tot_rates[0]
                agg.append(f"**{'+' if d > 0 else ''}{d:.0f}pp**")
            else:
                agg.append('—')
            body.append("| " + " | ".join(agg) + " |")
            body.append("")

        # Cross-feature summary
        body.append("## Feature ranking by V5 pass rate")
        body.append("")
        body.append("| feature | V5 pass | V2 pass | delta |")
        body.append("|---|---|---|---|")
        ranked = []
        for f in features:
            v2_p = sum(by[(f, a, 'v2')][0] for a in arms)
            v2_t = sum(by[(f, a, 'v2')][1] for a in arms)
            v5_p = sum(by[(f, a, 'v5')][0] for a in arms)
            v5_t = sum(by[(f, a, 'v5')][1] for a in arms)
            v5r = (v5_p / v5_t * 100) if v5_t else 0
            v2r = (v2_p / v2_t * 100) if v2_t else 0
            ranked.append((v5r, f, v2_p, v2_t, v5_p, v5_t, v5r - v2r))
        ranked.sort(reverse=True)
        for v5r, f, v2p, v2t, v5p, v5t, d in ranked:
            body.append(
                f"| `{f}` | {v5p}/{v5t} ({pct(v5p, v5t)}) | "
                f"{v2p}/{v2t} ({pct(v2p, v2t)}) | "
                f"{'+' if d > 0 else ''}{d:.0f}pp |"
            )

    out_path = HERE / "09-per-feature.md"
    out_path.write_text("\n".join(body) + "\n")
    print(f"wrote {out_path} from {len(rows)} rows")
    return 0


if __name__ == "__main__":
    sys.exit(main())
