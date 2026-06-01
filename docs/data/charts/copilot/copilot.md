---
productId: x-charts
title: Charts - Copilot
packageName: '@mui/x-charts-premium'
githubLabel: 'scope: charts'
---

# Charts - Copilot 🧪

<p class="description">Build, refine, and analyze a chart from natural language.</p>

:::warning
This feature is **experimental** and the API may change.
:::

The Charts Copilot is built on top of [`@mui/x-copilot`](/x/react-data-grid/copilot/) and [`@mui/x-chat`](/x/react-chat/).
It wraps the premium `ChartsRenderer` in a controlled host that owns a serializable chart-spec document.
A chat agent shapes that document — chart type, dimensions, values, the data-shaping layer, and display configuration — through a single tool seam.
A built-in **Analyze** menu computes statistics, correlations, anomalies, forecasts, and technical indicators entirely on the client (no model calls).

The demos below POST to the `charts` Copilot backend at `/api/v1/charts/copilot`.
Run the backend locally on port `5055` in development.

## The six capabilities

The Copilot is one conversation, not six separate tools.
A typical session flows from **Ask** to **Refine** to **Reshape**, with **Annotate**, **Focus**, and **Explain** layered on top.
The editing capabilities (Ask, Refine, Reshape, Annotate) each leave an editable [receipt](#receipts-and-undo) and an undo; **Focus** is a transient view with its own reset, and **Explain** only reads the chart back.

### Ask

Type a question, and the Copilot selects a chart type and the matching dimensions and values from the dataset, then renders the chart.
A one-line numeric answer — the total and the change versus the start of the range — appears above the chart.
That headline is computed on the client from the rendered series, so the model never produces the number itself.

{{"demo": "ChartAskDemo.js", "bg": "inline"}}

### Refine

Adjust a chart on screen by describing the change: stack the series, hide one, recolor, or move the legend.
Each instruction applies a diff to the chart-spec document and appends a receipt clause, so every edit stays visible and reversible.

{{"demo": "ChartRefineDemo.js", "bg": "inline"}}

### Reshape

Switch the geometry between bar, line, area, and pie.
The Copilot re-selects the matching renderer and morphs the chart; the receipt records the new shape, and a single click reverts it.

{{"demo": "ChartReshapeDemo.js", "bg": "inline"}}

### Annotate

Add reference lines, bands, computed overlays (moving average, trend, cumulative, forecast), and markers for the highest, lowest, or anomalous points.
Each value is computed on the client from the visible data rather than guessed by the model — the model only chooses what to draw and where.
When the data contains an unmarked anomaly, the Copilot also offers a one-click suggestion to mark it.

{{"demo": "ChartAnnotateDemo.js", "bg": "inline"}}

### Focus

Control zoom and series highlighting with natural language.
Focus is ephemeral view state — separate from the chart document and the undo history — so it has its own breadcrumb showing the current view and a reset.
The Copilot drives it through view commands rather than document edits.

{{"demo": "ChartFocusDemo.js", "bg": "inline"}}

### Explain

Read back a grounded narrative of the chart — the trend, the extremes, and a specific value — built from the same client-side statistics, with factual statements kept separate from any speculative interpretation.
The Copilot reasons over a computed summary (per-series statistics, trend, and anomalies) sent alongside the chart, so the numbers it cites always match the data.
A screen-reader-only data table mirrors the chart for non-visual access.

{{"demo": "ChartExplainDemo.js", "bg": "inline"}}

## Receipts and undo

Every Copilot action renders a compact receipt under its reply — a summary of what changed, such as `Reshaped · Bar` — with a single-click undo.
The **History** panel above the conversation lists every step and offers a reset to the original chart, so editing a chart by conversation stays visible and reversible.

## Analyze (no model)

The **Analyze** menu runs deterministic client-side math, independent of the chat:

- **Summary stats** — min, max, mean, median, standard deviation, range, total, and percent change per series.
- **Correlations** — pairwise Pearson correlation between series.
- **Anomaly detection** — flags drops and spikes by rate of change.
- **Forecast** — least-squares linear trend with R² and a projection.
- **Indicators** — SMA, EMA, Bollinger Bands, Pivot Points, Linear Regression, RSI, and MACD.

## Limitations

The Copilot resolves the chart, applies the data-shaping layer (group-by aggregation, top-N, filters), and computes every statistic **on the client**, over the rows held in the browser.
This suits the dashboard-scale datasets the charts render today (up to the order of a hundred thousand rows).
It does not summarize or aggregate on a server, so it is not designed for very large or streaming datasets — that would move the data layer and the statistics behind a query engine.

## Quick start

```tsx
import {
  ChartCopilot,
  createChartsCopilotLocalStorageAdapter,
} from '@mui/x-charts-premium';

const chatAdapter = createChartsCopilotLocalStorageAdapter(myBackendAdapter, {
  key: 'app-namespace',
});

<ChartCopilot dataset={dataset} chatAdapter={chatAdapter} />;
```

The `dataset` holds the rows and column metadata the Copilot reasons over:

```tsx
const dataset = {
  id: 'beverage-sales',
  columns: [
    { field: 'month', type: 'string' },
    { field: 'coffee', type: 'number' },
    { field: 'tea', type: 'number' },
  ],
  rows,
};
```

Pass `state` + `onStateChange` to control the chart-spec document, or `defaultState` for an uncontrolled initial chart.
Pass `suggestions` to seed the prompts shown in the panel's empty state.
Omit `chatAdapter` to render the chart and the Analyze menu without the chat panel.
