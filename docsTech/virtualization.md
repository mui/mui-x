# Virtualization

## The global idea

To avoid performance issues in rendering large grid, the virtualisation allows to render only the visible content.

To do so, wen user is scrolling, the hook `virtualization` compute the index of the first/last row/column to be display. which is saved in a react state `renderContext`.

This state is updated only if the scroll moved the context by more than a certain number of rows/columns defined by `rowThreshold`/`columnThreshold`.

This `renderContext`is reused in the component `components/DataGridProVirtualScroller.tsx` which call `getRows()` to render the needed rows.

This method is called in two context:

- The main columns, in which it adds more rows and columns on each side of the context according to the value of `rowBuffer` and `columnBuffer`.
- The left/right pinned columns. In this context, there is no column buffer because we render all the pinned column. Only the vertical component of the render context is used.

Since the rendered HTML does not fill the space, we need to modify the position of the rendered blocks. To do avoid re-painting, we directly modify the style of the element to translate them

```jsx
componentRef!.current!.style.transform = `translate3d(${left}px, ${top}px, 0px)`
```

That's done in `useGridColumnHeader.tsx` to let the column headers match the columns, and `useGridVirtualScroller.tsx` fot the main content.
