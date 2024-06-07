---
title: Data Grid - Row customization recipes
---

# Data Grid - Row customization recipes

<p class="description">Advanced row customization recipes.</p>

## One expanded detail panel at a time

By default, the [Master detail <span class="plan-pro" />](/x/react-data-grid/master-detail/) feature supports multiple expanded detail panels simultaneously.

However, you can [control the expanded detail panels](/x/react-data-grid/master-detail/#controlling-expanded-detail-panels) to have only one detail panel expanded at a time.

{{"demo": "DetailPanelOneExpandedRow.js", "bg": "inline", "defaultCodeOpen": false}}

## Expand or collapse all detail panels

The following demo shows how to create a custom header element that expands or collapses all detail panels at once.

Here's how it works:

The custom header uses `gridRowsLookupSelector` to find all rows with a detail panel.
It checks the status of open panels using the [`useGridSelector` hook](/x/react-data-grid/state/#with-usegridselector) to access the grid's state.
When clicked, it uses [`setExpandedDetailPanels`](/x/api/data-grid/grid-api/#grid-api-prop-setExpandedDetailPanels) from the [Grid API](/x/react-data-grid/api-object/#how-to-use-the-api-object) to expand or collapse all detail panels.

{{"demo": "DetailPanelExpandCollapseAll.js", "bg": "inline", "defaultCodeOpen": false}}
