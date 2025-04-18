---
productId: x-tree-view
title: Rich Tree View - Lazy loading
components: RichTreeViewPro, TreeItem
packageName: '@mui/x-tree-view-pro'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Lazy loading [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Lazy load the data from your Tree View.</p>

## Basic usage

To dynamically load data from the server, including lazy-loading of children, you must create a data source and pass the dataSource prop to the Rich Tree View.

The data source also requires the `getChildrenCount()` attribute to handle tree data:

`getChildrenCount()`: Returns the number of children for the item. If the children count is not available for some reason, but there are some children, returns -1.

The `items` prop serves as an initial state.

{{"demo": "LazyLoadingInitialState.js"}}

If you want to dynamically load all items of the Tree View, you can pass and empty array to the `items` prop, and the `getTreeItems` method will be called on the first render.

{{"demo": "BasicLazyLoading.js"}}

### Using react-query

The following demo uses `fetchQuery` from `react-query` to load data.

{{"demo": "FetchingWithReactQuery.js"}}

## Data caching

### Custom cache

To provide a custom cache, use `dataSourceCache` prop, which could be either written from scratch or based on another cache library.
This prop accepts a generic interface of type `DataSourceCache`.

The following demo uses `QueryClient` from `react-query` as a data source cache.

{{"demo": "ReactQueryCache.js"}}

### Customize the cache lifetime

The `DataSourceCacheDefault` has a default Time To Live (`ttl`) of 5 minutes. To customize it, pass the ttl option in milliseconds to the `DataSourceCacheDefault` constructor, and then pass it as the `dataSourceCache` prop.

{{"demo": "LowTTLCache.js"}}

## Error management

{{"demo": "ErrorManagement.js"}}

## Lazy loading and label editing

To store the updated item labels on your server use the `onItemLabelChange` callback function.

Changes to the label are not automatically updated in the `dataSourceCache` and will need to be updated manually. The demo below shows you how to update the cache once a label is changed so the changes are reflected in the tree.

{{"demo": "LazyLoadingAndLabelEditing.js"}}
