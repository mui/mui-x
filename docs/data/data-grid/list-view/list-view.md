---
title: Data Grid - List view
---

# Data Grid - List view [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Display data in a single-column list view. Can be used to present a more compact grid on smaller screens and mobile devices.</p>

List view can be enabled by providing the `listView` prop.

Unlike the default grid view, the list view makes no assumptions on how data is presented to end users.

In order to display data in a list view, a `listColDef` prop must be provided with a `renderCell` function.

{{"demo": "ListView.js", "iframe": true, "disableLiveEdit": true, "height": 600, "maxWidth": 360}}
