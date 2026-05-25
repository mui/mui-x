---
productId: x-scheduler
title: React Scheduler component - Virtualization
packageName: '@mui/x-scheduler-premium'
githubLabel: 'scope: scheduler'
---

# Event Timeline - Virtualization

<p class="description">Virtualize the Event Timeline for better performance with large datasets.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

The Event Timeline virtualizes its rows and columns to efficiently handle large numbers of resources and events.
Only the cells overlapping the visible viewport are mounted to the DOM as the user scrolls horizontally or vertically.

## Container shape

:::error
The Event Timeline has no intrinsic dimensions: you must give it a parent container with a bounded width **and** a bounded height, or it may not display correctly.
By default, the Event Timeline fills the space of its parent container, so that container must have intrinsic dimensions.
:::

Use a flex parent with a fixed height, a percentage height inside a sized ancestor, or an explicit `width`/`height` on the parent — the same rules that apply to the Data Grid apply here.
See the [Data Grid layout doc](/x/react-data-grid/layout/) for the full set of supported container shapes and trade-offs.
