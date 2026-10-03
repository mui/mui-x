---
title: Tree View - Focus visible
---

# Tree View - Focus visible

<p class="description">Theme the keyboard focus ring of the Tree View.</p>

## Prerequisite

This feature requires Material UI 9.4 or later, and MUI X 9.13 or later.

You enable it once on the Material UI theme, and the Tree View picks it up—there's nothing to set on the tree itself:

```tsx
const theme = createTheme({ focusVisible: true });
```

See [Focus visible](/material-ui/customization/focus-visible/) for customization details.

## Usage

Every interactive element in the Tree View uses the ring: item rows, checkboxes, and the rename input when [label editing](/x/react-tree-view/rich-tree-view/editing/) is on.
They all match, and they all follow the theme.

The ring marks the row you're on, so it takes over from the background tint that used to do that. Selected rows keep their own background.

Nothing changes until you opt in.
Tab into the demo below, then use the arrow keys to see the focus indicator.
Press <kbd class="key">Enter</kbd> on an item to rename it—the input takes the ring too.

{{"demo": "FocusVisibleTreeView.js", "bg": "inline"}}

:::info
The ring is for keyboard users. Clicking won't show it—press <kbd class="key">Tab</kbd>.

The demos on this page opt out of the ripple to show only the focus visible indicator.
:::
