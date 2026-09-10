# Charts Excel export

Exporting the data behind a chart to Excel, for [#14246](https://github.com/mui/mui-x/issues/14246).

[Open in StackBlitz](https://stackblitz.com/edit/xj4keswu?file=src%2FApp.tsx)

That project holds a copy of these files and installs the library from npm, so it boots in
seconds. Importing this folder through `stackblitz.com/github/...` instead would make
StackBlitz clone the whole monorepo first, which is far too slow to be usable.

## What it shows

The export produces tidy tables: one row per data point, one column per measure, one sheet
per column signature. Series types that share a signature merge into one sheet, so a chart
with bar and line series writes a single sheet while bar and scatter write two.

```
series | category | value
Sales  | France   | 68000000
Sales  | Spain    | 47000000
GDP    | France   | 2.8
```

Every one of the 13 series types appears, along with the cases that are easy to get wrong:
a scatter series whose points carry an optional color channel, a sparse heatmap, a range
bar whose start sits above its end, OHLC with real dates, a map feature with no value,
sankey's two sheets, and text that Excel would otherwise evaluate as a formula.

Four options change the output live:

| Option | Default | Effect |
| --- | --- | --- |
| `includeFormattedValues` | `false` | Adds a `formatted*` column beside each value |
| `includeHiddenSeries` | `true` | Exports series hidden through the legend |
| `escapeFormulas` | `true` | Prefixes text starting with `=`, `+`, `-` or `@` |
| `includeHeaders` | `true` | Writes a header row on each sheet |

Each scenario has its own download button, and there is one for the whole set. The files
are real `.xlsx`, so open them in Excel, LibreOffice or Sheets and check that numbers are
numbers and dates are dates.

## Two caveats while this is in review

The chart plugin that reads this off a live chart does not exist yet, so this example hands
series data to the extractors directly rather than rendering a chart and exporting it. That
is why no chart is drawn here.

The dependency points at a preview build rather than a release, pinned to a commit:

```json
"@mui/x-charts-premium": "https://pkg.pr.new/mui/mui-x/@mui/x-charts-premium@1b2c6a03659e0c23422d1c3f030e757688bf114f"
```

The commit hash matters. Pinning to the pull request instead, `@23569`, points at a URL
whose contents are replaced on every push, so any lockfile referring to it fails with
`EINTEGRITY` as soon as the next commit lands. Re-pin to a newer commit to pick up later
changes, and swap the whole thing for a normal version range once the feature ships.

## Running it locally

```bash
pnpm install
pnpm dev
```
