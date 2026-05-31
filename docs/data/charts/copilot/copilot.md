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
Each step leaves an editable [receipt](#receipts-and-undo) and an undo.

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

:::warning
In progress — the chart-spec slices and renderer overlays for this capability are still being built.
:::

Add reference lines, bands, computed overlays (moving average, trend, cumulative), and markers for the highest, lowest, or anomalous points.
Each value is computed on the client from the visible data rather than guessed by the model.

Planned prompts: _"Add a 3-month moving average"_, _"Mark the peak"_, _"Add a target line at 250"_.

### Focus

:::warning
In progress — the zoom and highlight view state for this capability is still being built.
:::

Control zoom and series highlighting with natural language, with a breadcrumb that shows the current view and a reset.

Planned prompts: _"Zoom to the second half of the year"_, _"Highlight coffee"_, _"Reset the view"_.

### Explain

:::warning
In progress — the grounded-summary context and narrative card for this capability are still being built.
:::

Read back a grounded narrative of the chart — the trend, the extremes, and what changed — built from the same client-side statistics, with factual statements kept separate from any speculative interpretation.

Planned prompts: _"Explain this chart"_, _"What is the trend?"_, _"What was coffee in July?"_.

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
