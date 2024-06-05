--
title: Data Grid - Row customization recipes
---

# Data Grid - Row customization recipes

<p class="description">Advanced row customization recipes.</p>

## One expanded detail panel at a time

By default, the [Master detail <span class="plan-pro" />](/x/react-data-grid/master-detail/) feature supports multiple expanded detail panels simultaneously.

However, you can [control the expanded detail panels](/x/react-data-grid/master-detail/#controlling-expanded-detail-panels) to have only one detail panel expanded at a time.

{{"demo": "DetailPanelOneExpandedRow.js", "bg": "inline", "defaultCodeOpen": false}}

## Collapse all detail panels with a custom header

This feature allows you to create a custom header element that collapses all currently expanded detail panels at once.

Here is how it works:

- Clicking the custom header triggers a collapse action on all open detail panels.
- It checks the status of open panels using the [`useGridSelector` hook](/x/react-data-grid/state/#with-usegridselector) to access the grid's state.
- The example leverages [`setExpandedDetailPanels`](/x/api/data-grid/grid-api/#grid-api-prop-setExpandedDetailPanels) from the [Grid API](/x/react-data-grid/api-object/#how-to-use-the-api-object).

{{"demo": "DetailPanelCollapseAll.js", "bg": "inline", "defaultCodeOpen": false}}
