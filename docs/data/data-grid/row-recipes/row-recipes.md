---
title: Data Grid - Row customization recipes
---

# Data Grid - Row customization recipes

<p class="description">Advanced row customization recipes.</p>

## One expanded detail panel at a time

By default, the [Master detail <span class="plan-pro" />](/x/react-data-grid/master-detail/) feature supports multiple expanded detail panels simultaneously.

However, you can [control the expanded detail panels](/x/react-data-grid/master-detail/#controlling-expanded-detail-panels) to have only one detail panel expanded at a time.

{{"demo": "DetailPanelOneExpandedRow.js", "bg": "inline", "defaultCodeOpen": false}}

## Expand or collapse all detail panels with a custom header

This feature allows you to create a custom header element that expands or collapses all detail panels at once.

Here is how it works:

- Clicking the custom header triggers a expand/collapse action on all detail panels.
- It checks the status of open panels using the [`useGridSelector` hook](/x/react-data-grid/state/#with-usegridselector) to access the grid's state.
- For getting all rows that have a detail panel it uses the [`useGridSelector` hook](/x/react-data-grid/state/#with-usegridselector) as well.
- The example then leverages [`setExpandedDetailPanels`](/x/api/data-grid/grid-api/#grid-api-prop-setExpandedDetailPanels) from the [Grid API](/x/react-data-grid/api-object/#how-to-use-the-api-object) to expand or collapse all detail panels.

{{"demo": "DetailPanelExpandCollapseAll.js", "bg": "inline", "defaultCodeOpen": false}}
