---
title: Data Grid - Copilot
---

# Copilot [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Chat alongside the Data Grid with a Copilot side panel powered by <code>@mui/x-chat</code>.</p>

Enable the feature with the `copilot` prop. The toolbar gets a Copilot button that toggles the side panel. With no adapter passed, a built-in echo adapter replies with `Echo: <your message>`.

{{"demo": "CopilotBackend.js", "bg": "inline"}}

```tsx
import { DataGridPremium } from '@mui/x-data-grid-premium';
// ...
<DataGridPremium copilot showToolbar />;
```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
