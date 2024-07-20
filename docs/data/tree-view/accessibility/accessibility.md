---
productId: x-tree-view
title: Accessibility
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
packageName: '@mui/x-tree-view'
---

# Accessibility

<p class="description">Learn how the Tree View implements accessibility features and guidelines, including keyboard navigation that follows international standards.</p>

## Guidelines

Common conformance guidelines for accessibility include:

- Globally accepted standard: [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/)
- US:
  - [ADA](https://www.ada.gov/) - US Department of Justice
  - [Section 508](https://www.section508.gov/) - US federal agencies
- Europe: [EAA](https://ec.europa.eu/social/main.jsp?catId=1202) (European Accessibility Act)

WCAG 2.1 has three levels of conformance: A, AA, and AAA.
Level AA exceeds the basic criteria for accessibility and is a common target for most organizations, so this is what we aim to support.

The [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/) provide valuable information on how to optimize the accessibility of a Tree View.

## Keyboard interactions

:::info
The key assignments in the table below apply to Windows and Linux users.

On macOS replace <kbd class="key">Ctrl</kbd> with <kbd class="key">⌘ Command</kbd>.

Some devices may lack certain keys, requiring the use of key combinations. In this case, replace:

- <kbd class="key">Home</kbd> with <kbd class="key">Fn</kbd>+<kbd class="key">Arrow Left</kbd>
- <kbd class="key">End</kbd> with <kbd class="key">Fn</kbd>+<kbd class="key">Arrow Right</kbd>

:::

|                                                                                          Keys | Description                                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                                                                  <kbd class="key">Enter</kbd> | Activates the focused item. <ul><li>If item has children, it is expanded or collapsed</li><li>If the item does not have children, it is selected</li></ul>                                                           |
|                                                               <kbd class="key">Arrow Up</kbd> | Moves focus to the previous focusable item, without expanding or collapsing it                                                                                                                                       |
|                                                             <kbd class="key">Arrow Down</kbd> | Moves focus to the next focusable item, without expanding or collapsing it                                                                                                                                           |
| <kbd class="key">Arrow Right</kbd> + RTL off </br> <kbd class="key">Arrow Left</kbd> + RTL on | <ul><li>If focus is on a collapsed item, expands the item without moving focus</li><li>If focus is on an expanded item, moves focus to the first child</li><li>If focus is on an end item, nothing happens</li></ul> |
|   <kbd class="key">Arrow Left</kbd> + RTL off </br> <kbd class="key">Arrow Right</kbd> RTL on | <ul><li>If focus is on an expanded item, collapses the item</li><li>If focus is on a collapsed item that has a parent, moves focus to its parent</li><li>If focus is on a root item, nothing happens</li></ul>       |
|                                                                   <kbd class="key">Home</kbd> | Focuses the first item in the tree                                                                                                                                                                                   |
|                                                                    <kbd class="key">End</kbd> | Focuses the last item in the tree                                                                                                                                                                                    |
|                                                                     <kbd class="key">\*</kbd> | Expands all siblings that are at the same level as the focused item without moving focus                                                                                                                             |

Type-ahead is supported for single characters. When typing a character, focus moves to the next item with a label that starts with the typed character.

## Selection

The tree view supports both single and multi-selection. To learn more about the selection API, visit the dedicated page for the [Simple Tree View](/x/react-tree-view/simple-tree-view/selection/) or the [Rich Tree View](/x/react-tree-view/rich-tree-view/selection/).

To read more about the distinction between selection and focus, you can refer to the [WAI-ARIA Authoring Practices guide](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_vs_selection).

### On single-select trees

When a single-select tree receives focus:

- If none of the items are selected when the tree receives focus, focus is set on the first item.
- If an item is selected before the tree receives focus, focus is set on the selected item.

|                         Keys | Description                                                  |
| ---------------------------: | :----------------------------------------------------------- |
| <kbd class="key">Space</kbd> | Selects the focused item.                                    |
| <kbd class="key">Enter</kbd> | Selects the focused item if the item does not have children. |

### On multi-select trees

When a multi-select tree receives focus:

- If none of the items are selected when the tree receives focus, focus is set on the first item.
- If one or more items are selected before the tree receives focus, then focus is set on:
  - the first selected item if it is the first render
  - the item that was last selected otherwise

|                                                                                 Keys | Description                                                       |
| -----------------------------------------------------------------------------------: | :---------------------------------------------------------------- |
|                                                         <kbd class="key">Space</kbd> | Toggles the selection state of the focused item.                  |
|                         <kbd class="key">Shift</kbd>+<kbd class="key">Arrow Up</kbd> | Moves focus and toggles the selection state of the previous item. |
|                       <kbd class="key">Shift</kbd>+<kbd class="key">Arrow Down</kbd> | Moves focus and toggles the selection state of the next item.     |
| <kbd class="key">Ctrl</kbd>+<kbd class="key">Shift</kbd>+<kbd class="key">Home</kbd> | Selects the focused item and all items up to the first item.      |
|  <kbd class="key">Ctrl</kbd>+<kbd class="key">Shift</kbd>+<kbd class="key">End</kbd> | Selects the focused item and all the items down to the last item. |
|                                 <kbd class="key">Ctrl</kbd>+<kbd class="key">A</kbd> | Selects all items.                                                |
