---
title: React Server-side tree data
---

# Data Grid - Server-side tree data [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Tree data lazy-loading with server-side data source.</p>

To use the server-side tree data, pass the `unstable_dataSource` prop as explained in the overview section, in addition to that passing of some additional props is required for the server-side tree data to work properly.

Following is a demo of the server-side tree data working with server side data source. It supports server side filtering, sorting and pagination. It also uses the `unstable_dataSourceCache` prop to pass a cache object based on the `QueryClient` exposed by `@tanstack/query-core`.

{{"demo": "ServerSideTreeData.js", "bg": "inline"}}
