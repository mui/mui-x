---
title: React Data Grid - Server-side lazy loading
---

# Data Grid - Server-side lazy loading [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Row lazy-loading with server-side data source.</p>

## Viewport loading mode

The viewport loading mode is a lazy loading mode that loads new rows based on the viewport. It loads new rows in page size chunks as the user scrolls through the data grid and reveals empty rows.

{{"demo": "ServerSideLazyLoadingViewport.js", "bg": "inline"}}

## Infinite loading mode

The infinite loading mode is a lazy loading mode that loads new rows when the scroll reaches the bottom of the viewport area.

{{"demo": "ServerSideLazyLoadingInfinite.js", "bg": "inline"}}
