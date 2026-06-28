#!/usr/bin/env python3
"""
Parse the test-copilot-quality.ts log into 5 markdown reports under
.context/benchskills/. Safe to re-run on partial logs (sweep in progress)
or final logs.

Usage:
    python3 .context/benchskills/parser.py /tmp/tool-scheme-multi.log
"""

from __future__ import annotations

import collections
import datetime as dt
import pathlib
import re
import sys


REPORT_DIR = pathlib.Path(__file__).parent
SECTION_HEADER = re.compile(
    r"^=== (?P<variant>\S+)/(?P<scheme>\S+) / arm: (?P<arm>\S+)(?:\s+\[[^\]]+\])? \(.*\) ==="
)
RESULT_LINE = re.compile(
    r"^\s+(?P<promptId>\S+)\s+(?P<stamp>[✓✗])\s+\((?P<ms>\d+)ms\)"
    r"(?:\s+\$(?P<cost>[0-9.]+))?(?:\s+—\s+(?P<failures>.+))?$"
)
# When the harness logger interleaves output between the `process.stdout.write(promptId)`
# and `console.log(stamp...)`, the stamp ends up on its own line with no prompt id
# prefix. We then attribute it to the last-seen prompt id.
PROMPT_ANNOUNCEMENT = re.compile(r"^\s+(?P<promptId>[a-z][\w-]*)\s+(?:\[\d|$)")
ORPHAN_STAMP = re.compile(
    r"^(?P<stamp>[✓✗])\s+\((?P<ms>\d+)ms\)"
    r"(?:\s+\$(?P<cost>[0-9.]+))?(?:\s+—\s+(?P<failures>.+))?$"
)


def parse_log(path: pathlib.Path) -> list[dict]:
    rows = []
    arm = scheme = variant = None
    last_announced_id: str | None = None  # for orphan-stamp recovery
    seen_prompt_ids_in_section: set[str] = set()

    for line in path.read_text(errors="ignore").splitlines():
        m = SECTION_HEADER.match(line)
        if m:
            variant = m.group("variant")
            scheme = m.group("scheme")
            arm = m.group("arm")
            last_announced_id = None
            seen_prompt_ids_in_section = set()
            continue
        if arm is None:
            continue
        m = RESULT_LINE.match(line)
        if m:
            pid = m.group("promptId")
            if pid in seen_prompt_ids_in_section:
                continue  # already accounted via orphan-stamp path
            seen_prompt_ids_in_section.add(pid)
            rows.append({
                "arm": arm,
                "scheme": scheme,
                "variant": variant,
                "promptId": pid,
                "category": derive_category(pid),
                "ok": m.group("stamp") == "✓",
                "ms": int(m.group("ms")),
                "cost": float(m.group("cost")) if m.group("cost") else None,
                "failures": (m.group("failures") or "").split(",") if m.group("failures") else [],
            })
            last_announced_id = None
            continue
        # Track lines that look like the harness wrote `promptId ` but a
        # logger interrupted before the stamp could land. The next ORPHAN_STAMP
        # we see belongs to this prompt id.
        m = PROMPT_ANNOUNCEMENT.match(line)
        if m and m.group("promptId").startswith(("skill-", "reg-")):
            last_announced_id = m.group("promptId")
            continue
        m = ORPHAN_STAMP.match(line)
        if m and last_announced_id and last_announced_id not in seen_prompt_ids_in_section:
            seen_prompt_ids_in_section.add(last_announced_id)
            rows.append({
                "arm": arm,
                "scheme": scheme,
                "variant": variant,
                "promptId": last_announced_id,
                "category": derive_category(last_announced_id),
                "ok": m.group("stamp") == "✓",
                "ms": int(m.group("ms")),
                "cost": float(m.group("cost")) if m.group("cost") else None,
                "failures": (m.group("failures") or "").split(",") if m.group("failures") else [],
            })
            last_announced_id = None
    return rows


def derive_category(prompt_id: str) -> str:
    # Match category by id prefix; falls back to "other" for ids we don't
    # recognise (the parser is forgiving so partial logs still produce data).
    new_skill_prefixes = {
        "skill-pivot-": "pivot-builder",
        "skill-chart-": "chart-suggest",
        "skill-outlier-": "outlier-hunt",
        "skill-whatif-": "what-if-ghost",
        "skill-pin-": "investigation-log",
        "skill-story-": "data-story",
        "skill-surprise-": "surprise-me",
    }
    regression_prefixes = {
        "reg-pdf-": "pdf-report",
        "reg-formula-": "formula",
        "reg-filter-": "filter",
        "reg-sort-": "sort",
        "reg-group-": "group-agg",
        "reg-chart-": "chart",
        "reg-pivot-": "pivot",
    }
    # Per-feature expansion prompts. feat-chart-{1..4} are chart-suggest style
    # ("make a bar chart of X"), feat-chart-{5..7} are direct chart patches.
    # feat-pivot-{1..5} go to pivot-builder, {6..7} to raw pivot. Others are
    # uniformly mapped to their feature's flagship category.
    feat_prefixes_special = {
        "feat-chart-1": "chart-suggest",
        "feat-chart-2": "chart-suggest",
        "feat-chart-3": "chart-suggest",
        "feat-chart-4": "chart-suggest",
        "feat-chart-5": "chart",
        "feat-chart-6": "chart",
        "feat-chart-7": "chart",
        "feat-chart-8": "chart-suggest",
        "feat-pivot-1": "pivot-builder",
        "feat-pivot-2": "pivot-builder",
        "feat-pivot-3": "pivot-builder",
        "feat-pivot-4": "pivot-builder",
        "feat-pivot-5": "pivot-builder",
        "feat-pivot-6": "pivot",
        "feat-pivot-7": "pivot",
    }
    feat_prefixes = {
        "feat-group-": "group-agg",
        "feat-pdf-": "pdf-report",
        "feat-formula-": "formula",
    }
    if prompt_id in feat_prefixes_special:
        return feat_prefixes_special[prompt_id]
    for prefix, cat in {**new_skill_prefixes, **regression_prefixes, **feat_prefixes}.items():
        if prompt_id.startswith(prefix):
            return cat
    return "other"


def fmt_pct(p: int, t: int) -> str:
    if t == 0:
        return "—"
    return f"{p * 100 / t:.1f}%"


def render_table(headers: list[str], rows: list[list[str]]) -> str:
    out = ["| " + " | ".join(headers) + " |", "| " + " | ".join("---" for _ in headers) + " |"]
    for r in rows:
        out.append("| " + " | ".join(r) + " |")
    return "\n".join(out)


def write_summary(rows: list[dict], log_path: pathlib.Path) -> None:
    total = len(rows)
    passed = sum(1 for r in rows if r["ok"])
    by_arm = collections.defaultdict(lambda: [0, 0])
    by_scheme = collections.defaultdict(lambda: [0, 0])
    for r in rows:
        by_arm[r["arm"]][0 if r["ok"] else 1] += 1
        by_scheme[r["scheme"]][0 if r["ok"] else 1] += 1

    body = f"""# Skills benchmark — top-line summary

_Generated {dt.datetime.now().strftime('%Y-%m-%d %H:%M')} from `{log_path}`._

**Overall**: {passed} / {total} pass = **{fmt_pct(passed, total)}** across 6 arms × 7 tool-naming schemes × 50 V5 prompts.

## Pass rate by arm (all schemes)

{render_table(
    ['Arm', 'Pass', 'Fail', '%'],
    [
        [arm, str(p), str(f), fmt_pct(p, p + f)]
        for arm, (p, f) in sorted(by_arm.items(), key=lambda kv: -(kv[1][0] / max(kv[1][0] + kv[1][1], 1)))
    ],
)}

## Pass rate by tool-naming scheme (all arms)

{render_table(
    ['Scheme', 'Pass', 'Fail', '%'],
    [
        [scheme, str(p), str(f), fmt_pct(p, p + f)]
        for scheme, (p, f) in sorted(by_scheme.items(), key=lambda kv: -(kv[1][0] / max(kv[1][0] + kv[1][1], 1)))
    ],
)}

## Key takeaways

See `02-by-arm.md` for the arm × scheme grid, `03-by-scheme.md` for scheme deep-dives, `04-by-category.md` for per-skill performance, and `05-failure-modes.md` for what's going wrong.
"""
    (REPORT_DIR / "01-summary.md").write_text(body)


def write_by_arm(rows: list[dict]) -> None:
    arms = sorted({r["arm"] for r in rows})
    schemes = sorted({r["scheme"] for r in rows})
    if not arms or not schemes:
        return

    by_arm_scheme = collections.defaultdict(lambda: [0, 0])
    for r in rows:
        by_arm_scheme[(r["arm"], r["scheme"])][0 if r["ok"] else 1] += 1

    header = ["Arm \\ Scheme", *schemes, "Arm avg"]
    out_rows: list[list[str]] = []
    for arm in arms:
        cells = [arm]
        pa = fa = 0
        for s in schemes:
            p, f = by_arm_scheme[(arm, s)]
            pa += p
            fa += f
            cells.append(f"{p}/{p + f} ({fmt_pct(p, p + f)})" if (p + f) else "—")
        cells.append(f"**{fmt_pct(pa, pa + fa)}**")
        out_rows.append(cells)

    # Scheme avg row
    scheme_avg = ["**Scheme avg**"]
    for s in schemes:
        p = sum(1 for r in rows if r["scheme"] == s and r["ok"])
        t = sum(1 for r in rows if r["scheme"] == s)
        scheme_avg.append(f"**{fmt_pct(p, t)}**" if t else "—")
    scheme_avg.append("")
    out_rows.append(scheme_avg)

    body = f"""# Skills benchmark — pass rates by arm × scheme

_Each cell is `pass/total (rate%)` for the (arm, scheme) pair across the 50 V5 prompts._

{render_table(header, out_rows)}

## How to read this

- Look across a row → does any scheme outperform baseline for this model? If yes, that arm benefits from renamed tools.
- Look down a column → does the scheme work uniformly across models, or only on some?
- The bottom row gives the scheme average — the single number that answers "which naming convention should we ship?".
"""
    (REPORT_DIR / "02-by-arm.md").write_text(body)


def write_by_scheme(rows: list[dict]) -> None:
    schemes = sorted({r["scheme"] for r in rows})
    if not schemes:
        return

    out_rows: list[list[str]] = []
    for s in schemes:
        slice_ = [r for r in rows if r["scheme"] == s]
        p = sum(1 for r in slice_ if r["ok"])
        t = len(slice_)
        avg_ms = sum(r["ms"] for r in slice_) / t if t else 0
        cost = sum(r["cost"] or 0 for r in slice_)
        out_rows.append([s, str(t), str(p), fmt_pct(p, t), f"{avg_ms:.0f}ms", f"${cost:.4f}"])

    body = f"""# Skills benchmark — pass rates by tool-naming scheme

_Across all arms and all 50 prompts._

{render_table(['Scheme', 'Calls', 'Pass', '%', 'Avg latency', 'Total cost'], out_rows)}

## Interpretation

- A scheme that out-performs `baseline` across many arms is a candidate to ship as the new default.
- A scheme that wins on some arms and loses on others suggests model-specific naming preferences.
- Latency differences across schemes are largely incidental — they reflect arm sampling, not the scheme itself.
- Cost is informational; it does not factor into pass/fail.

See `02-by-arm.md` for the per-arm breakdown that shows whether a scheme's win is uniform.
"""
    (REPORT_DIR / "03-by-scheme.md").write_text(body)


def write_by_category(rows: list[dict]) -> None:
    categories = sorted({r["category"] for r in rows})
    schemes = sorted({r["scheme"] for r in rows})
    if not categories or not schemes:
        return

    header = ["Category", *schemes, "Total"]
    out_rows: list[list[str]] = []
    for cat in categories:
        cells = [cat]
        pa = fa = 0
        for s in schemes:
            slice_ = [r for r in rows if r["category"] == cat and r["scheme"] == s]
            p = sum(1 for r in slice_ if r["ok"])
            t = len(slice_)
            pa += p
            fa += t - p
            cells.append(fmt_pct(p, t) if t else "—")
        cells.append(f"**{fmt_pct(pa, pa + fa)}**")
        out_rows.append(cells)

    body = f"""# Skills benchmark — pass rates by prompt category × scheme

_Each cell is the pass rate (%) for that (category, scheme) pair across the 6 arms._

{render_table(header, out_rows)}

## How to read

- Categories starting with a skill name (e.g. `pivot-builder`) test V5's new skills — these are the cells where V5's lift over V2 lives.
- Categories like `filter`, `sort`, `group-agg`, `pdf-report` are regression baselines — V5 should hold parity with V2.
- A skill whose row is uniformly low across schemes is a SKILL.md authoring problem; revise the SKILL.md body.
- A category that swings widely across schemes is sensitive to tool naming.
"""
    (REPORT_DIR / "04-by-category.md").write_text(body)


def write_failure_modes(rows: list[dict]) -> None:
    counter = collections.Counter()
    by_scheme_mode = collections.defaultdict(collections.Counter)
    failed_samples = collections.defaultdict(list)

    for r in rows:
        if r["ok"]:
            continue
        for f in r["failures"]:
            mode = f.strip()
            if not mode:
                continue
            counter[mode] += 1
            by_scheme_mode[r["scheme"]][mode] += 1
            if len(failed_samples[mode]) < 5:
                failed_samples[mode].append(
                    f"  - **{r['arm']}** · scheme `{r['scheme']}` · `{r['promptId']}`"
                )

    histogram = "\n".join(
        f"| {mode} | {count} |"
        for mode, count in counter.most_common()
    )

    scheme_rows: list[list[str]] = []
    schemes = sorted({r["scheme"] for r in rows})
    modes = [m for m, _ in counter.most_common(10)]
    for s in schemes:
        scheme_rows.append([s, *[str(by_scheme_mode[s].get(m, 0)) for m in modes]])

    sample_blocks = []
    for mode in counter.keys():
        if not failed_samples[mode]:
            continue
        sample_blocks.append(
            f"### `{mode}` ({counter[mode]} occurrences)\n\n"
            + "\n".join(failed_samples[mode])
        )

    body = f"""# Skills benchmark — failure modes

_Generated {dt.datetime.now().strftime('%Y-%m-%d %H:%M')}._

## Overall histogram

| Failure mode | Count |
| --- | --- |
{histogram}

## Failures by scheme (top 10 modes)

{render_table(
    ['Scheme', *modes],
    scheme_rows,
) if modes else "_No failures recorded yet._"}

## Representative samples (first 5 per mode)

{chr(10).join(sample_blocks)}
"""
    (REPORT_DIR / "05-failure-modes.md").write_text(body)


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: parser.py <log-file>", file=sys.stderr)
        return 2
    log_path = pathlib.Path(sys.argv[1])
    if not log_path.exists():
        print(f"log file not found: {log_path}", file=sys.stderr)
        return 2

    rows = parse_log(log_path)
    if not rows:
        print(f"no benchmark rows parsed from {log_path} — sweep may not have started yet",
              file=sys.stderr)
        return 1

    write_summary(rows, log_path)
    write_by_arm(rows)
    write_by_scheme(rows)
    write_by_category(rows)
    write_failure_modes(rows)
    print(f"wrote 5 reports to {REPORT_DIR} from {len(rows)} parsed rows")
    return 0


if __name__ == "__main__":
    sys.exit(main())
