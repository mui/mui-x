---
title: Data Grid - List view
---

# Data Grid - List view [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')🧪

<p class="description">Display data in a single-column list view. Can be used to present a more compact grid on smaller screens and mobile devices.</p>

:::warning
This feature is marked as **unstable**. While you can use this feature in production, the API could change in the future.
:::

List view can be enabled by providing the `unstable_listView` prop.

Unlike the default grid view, the list view makes no assumptions on how data is presented to end users.

In order to display data in a list view, a `unstable_listColumn` prop must be provided with a `renderCell` function.

{{"demo": "ListView.js", "bg": "inline"}}

## Advanced usage

The list view feature can be combined with [custom subcomponents](/x/react-data-grid/components/) to provide an improved user experience on small screens.

{{"demo": "ListViewAdvanced.js", "bg": "inline", "iframe": true, "maxWidth": 360, "height": 600, "hideToolbar": true}}

:::info
See the code for this demo in [CodeSandbox](https://codesandbox.io/p/sandbox/x-react-data-grid-list-view-zmkzhz).
:::
