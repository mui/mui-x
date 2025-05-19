---
title: React Data Grid - Server-side lazy loading
---

# Data Grid - Server-side lazy loading [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')🚧

<p class="description">Implement lazy-loading rows with server-side data in the Data Grid.</p>

:::success
Lazy loading of server-side data is available in MUI X v8+.
You must [upgrade from v7](https://mui.com/x/migration/migration-data-grid-v7/) to use this feature.
:::

Lazy loading is a technique for deferring the loading of resources until they are actually needed, rather than loading everything when a page is first requested.
Lazy loading changes the way pagination works in the Data Grid by removing page controls and instead loading data dynamically (in a single list) as the user scrolls.
