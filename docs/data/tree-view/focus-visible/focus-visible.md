---
title: Tree View - Focus visible
---

# Tree View - Focus visible

<p class="description">Theme the keyboard focus ring of the Tree View.</p>

Material UI can draw a single, themeable focus ring across every interactive component.
It's opt-in: set `focusVisible` on the theme and the ring appears wherever a component supports it.
See [Focus visible](/material-ui/customization/focus-visible/) for the option itself and the values it accepts.

```tsx
const theme = createTheme({ focusVisible: true });
```

The Tree View participates in that ring. Nothing changes until you opt in.

{{"demo": "FocusVisibleTreeView.js", "bg": "inline"}}

:::info
The ring only appears for keyboard users, because it's drawn on `:focus-visible`.
Clicking an item won't show it.
:::

## Where the ring is drawn

The keyboard focus lands on the item's root `<li>`, but the ring is drawn on the **content** slot—the visible row.
This matters because an expanded item's root wraps its whole subtree, so a ring there would enclose every descendant instead of marking the focused row.

This is the same split Material UI uses for its own slot-drawn controls, where the Checkbox focuses a hidden input and rings the icon.

## The ring replaces the focus background

Without `focusVisible`, a focused item is marked with a background tint.
With it, the ring becomes the keyboard indicator and that tint is dropped, so the two don't stack.

Two things are deliberately left alone:

- **Selected items** keep their own background. Only the extra focus layer goes away, so the ring reads against a single flat color.
- **Pointer focus** keeps the tint. Clicking an item doesn't match `:focus-visible`, so it looks exactly as it did before.

## Inset ring

The ring is inset on the content row, meaning it's drawn just inside the row's edge rather than just outside it.

A Tree View is routinely placed inside a scrollable panel, and the content row spans that panel's full width—so there's no spacing to absorb an outset ring.
As you arrow down, the focused row parks flush against the visible edge and an outset ring would be clipped there.
Material UI insets [`ListItemButton`](/material-ui/react-list/) for the same reason.

## Label editing

The rename input of the [Rich Tree View](/x/react-tree-view/rich-tree-view/editing/) draws the themed ring too.

It's kept on `:focus` rather than `:focus-visible`: the input is only mounted while renaming and is focused programmatically, so `:focus-visible` may not match a rename started with the mouse—which would drop the ring exactly when it's needed.
