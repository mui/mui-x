---
title: Data Grid - Row customization recipes
---

# Data Grid - Row customization recipes

<p class="description">Advanced row customization recipes.</p>

## One expanded detail panel at a time

By default, the [Master-detail row panel <span class="plan-pro" />](/x/react-data-grid/master-detail/) feature supports multiple expanded detail panels simultaneously.

However, you can [control the expanded detail panels](/x/react-data-grid/master-detail/#controlling-expanded-detail-panels) to have only one detail panel expanded at a time.

{{"demo": "DetailPanelOneExpandedRow.js", "bg": "inline", "defaultCodeOpen": false}}

## Expand or collapse all detail panels

The following demo shows how to create a custom header element that expands or collapses all detail panels at once.

Here's how it works:

The custom header uses `gridRowsLookupSelector` to find all rows with a detail panel.
It checks the status of open panels using the [`useGridSelector()` hook](/x/react-data-grid/state/#with-usegridselector) to access the grid's state.
When clicked, it uses [`setExpandedDetailPanels`](/x/api/data-grid/grid-api/#grid-api-prop-setExpandedDetailPanels) from the [Grid API](/x/react-data-grid/api-object/#how-to-use-the-api-object) to expand or collapse all detail panels.

{{"demo": "DetailPanelExpandCollapseAll.js", "bg": "inline", "defaultCodeOpen": false}}

## Toggling detail panels on row click

In the demo below, you can toggle the detail panel by clicking anywhere on the row:

{{"demo": "DetailPanelExpandOnRowClick.js", "bg": "inline", "defaultCodeOpen": false}}

## Lazy loading detail panels with auto height

In the demo below, detail panels have a height based on content (auto height) and are lazy loaded.
To prevent scrolling issues, panel heights are cached once they are loaded and the cached height is returned from the `getDetailPanelHeight()` callback.

{{"demo": "LazyLoadingAutoHeightDetailPanel.js", "bg": "inline", "defaultCodeOpen": false}}

## Access Data Grid internal loading state

The following demo shows how to disable a button on the toolbar when the Data Grid is in loading state using the [`useGridSelector()`](https://mui.com/x/react-data-grid/state/#with-usegridselector) hook with the `gridRowsLoadingSelector()`.

{{"demo": "AccessingLoadingState.js", "bg": "inline"}}

:::info
The `useGridSelector()` is based on a React Context, so the component must be a child of the Data Grid in the React tree to access the internal state.

You could use a [React portal](https://react.dev/reference/react-dom/createPortal) to achieve the same while rendering the component outside the Data Grid DOM tree.
:::

## Drag rows between pages while reordering [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

By default, [row reordering](/x/react-data-grid/row-ordering/) requires both the dragged row and the drop target to be rendered on the same page.
You can use a custom [pagination](/x/react-data-grid/components/#pagination) component to switch pages while a row is being dragged.

The following demo listens to the `rowDragStart` and `rowDragEnd` events in a custom pagination component.
When a row is being dragged over the previous or next page button, the component changes the page during the `dragOver` phase.
After the page changes, drop it in the desired position in the new page.

{{"demo": "RowReorderingWithPagination.js", "bg": "inline", "defaultCodeOpen": false}}
