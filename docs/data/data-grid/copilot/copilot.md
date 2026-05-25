---
title: Data Grid - Copilot
---

# Copilot [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Chat alongside the Data Grid with a Copilot side panel powered by <code>@mui/x-chat</code>.</p>

{{"demo": "CopilotBackend.js", "bg": "inline"}}

```tsx
import { DataGridPremium } from '@mui/x-data-grid-premium';
// ...
<DataGridPremium copilot showToolbar />;
```

## Generating PDF reports (plugin)

PDF report generation is an opt-in plugin shipped as `@mui/x-copilot/pdf`. Install the package alongside the json-render PDF renderer, register the plugin via `copilotPlugins`, and Copilot gains the ability to compose printable artifacts.

```bash
npm install @mui/x-copilot @json-render/react-pdf @react-pdf/renderer
```

```tsx
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { pdfReportPlugin } from '@mui/x-copilot/plugins/pdf';

const COPILOT_PLUGINS = [pdfReportPlugin()];

<DataGridPremium copilot copilotPlugins={COPILOT_PLUGINS} showToolbar />;
```

The flow is approval-gated and **no grid data leaves the browser**:

1. Copilot calls the `queryGridData` tool to request a slice — raw rows, an aggregate, or the current selection.
2. The chat panel shows an approval card listing what Copilot is asking for (row count, columns, aggregations).
3. On **Approve**, the query runs locally against `apiRef`. Only the **shape** of the result (row count, column field ids, aggregation definitions) is sent back to the backend, plus a `stateBinding` JSON-pointer prefix.
4. Copilot emits a `composePdfReport` call carrying a [json-render](https://json-render.dev/docs/data-binding) Spec full of `$state` and `$template` placeholders that reference the bound state path.
5. The plugin renders the PDF **in the browser** using `renderToBuffer(spec, { state })` — placeholders are resolved against the user's live grid data at render-time.
6. A card in chat exposes an **Open report** button (opens the PDF in a new tab) plus a **Regenerate** button (re-renders against the current grid state — useful if the user has filtered/sorted after the report was first composed).

The backend tells the model the `composePdfReport` tool exists only when the request body includes `copilotPlugins: ['pdf-report']`. The Copilot wrapper auto-injects this from the registered plugin list.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
