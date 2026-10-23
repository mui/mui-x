# x-virtualizer

Virtualization engine.

## Scroll containers

By default, the grid owns its scroll area. An external scroll container allows the
grid to share a content area or scroll with the page while keeping rows virtualized.
The grid occupies its full content height in the surrounding layout; this does not
enable `dimensions.autoHeight` or render every row.

```tsx
const scrollParentRef = React.useRef<HTMLDivElement>(null);

const virtualizer = useVirtualizer({
  // ...layout, rows, columns, dimensions, and renderRow
  scrollContainer: () => scrollParentRef.current,
  scrollContainerAxes: 'vertical',
  scrollViewportInsets: { top: 48 },
});
```

| Option                            | Behavior                                                                                         |
| :-------------------------------- | :----------------------------------------------------------------------------------------------- |
| `scrollContainer: 'self'`         | Default. The grid scrolls on both axes.                                                          |
| `scrollContainer: 'window'`       | Uses the window belonging to the grid's document.                                                |
| `scrollContainer: element`        | Uses an existing scrollable ancestor.                                                            |
| `scrollContainer: () => element`  | Resolves a ref after mounting. Returning `null` waits for an owner.                              |
| `scrollContainerAxes: 'vertical'` | Default for external owners. The grid retains horizontal scrolling.                              |
| `scrollContainerAxes: 'both'`     | The external owner scrolls both rows and columns.                                                |
| `scrollViewportInsets`            | Optional `top`, `right`, `bottom`, and `left` pixel insets for fixed overlays. Defaults to zero. |

The virtualizer measures the grid's position relative to its owner, including
content before and after the grid. It observes surrounding layout resizing and
remeasures on scrolling. Insets describe overlays covering the owner's viewport;
do not include ordinary preceding content or the grid's own pinned headers.

Changing an owner requires a React render or `api.refreshScrollContainer()`.
Use the same refresh method after position-only changes such as margins or
positioning that do not resize the surrounding layout. A getter must return an
ancestor in the grid's document. For shared horizontal scrolling, configure the
scroll owner's CSS direction to match `virtualization.isRtl`.

## Layout integration

Scroll ownership is independent of the layout. Continue using the selected
layout's `selectors`: they account for external owners when calculating content
size, overflow, viewport placement, and sticky offsets. Keep the grid's root
unconstrained in height when using an external owner.

When both axes use the external owner, lists and sticky grids retain their
existing structure. A classic list's absolutely positioned filler does not grow
its parent, so its root selector supplies the full content height. Sticky layouts
retain their existing spacers and anchored row windows.

For external vertical scrolling with grid-owned horizontal scrolling, place a
horizontal scrollport **inside** each vertical band. Each layout exposes
`headerScrollerProps`, `bodyScrollerProps`, `footerScrollerProps`, and
`scrollCanvasProps` for these optional wrappers. For example, a sticky grid's
header band becomes:

```tsx
const selectors = LayoutGridSticky.selectors;
// Subscribe to each selector with virtualizer.store.use(selector).

<div {...topContainerProps}>
  <div {...headerScrollerProps}>
    <div {...scrollCanvasProps}>
      <div {...spacerLeftProps} />
      <div {...innerContainerProps}>{/* Header and pinned top rows */}</div>
    </div>
  </div>
</div>;
```

Apply the same nesting to the body window and bottom band. The body wrapper
receives the local scroller ref; header, footer, and horizontal scrollbar positions
are synchronized with it. Omit these wrappers for self scrolling or shared axes.
Putting a horizontal scrollport outside a vertical sticky band would make that
scrollport capture the band's vertical sticky positioning as well.

`LayoutDataGrid` retains its content, viewport, and row positioner. Its external
`bodyProps` wrapper contains the row positioner and content filler; in controlled
mode, `viewportProps` places and clips the viewport at the visible intersection.
The other layouts retain their own row-rendering conventions, including the
sticky grid's horizontally positioned window and compact rows.

For external split axes, render the horizontal scrollbar after the content using
`scrollbarHorizontalProps` and `scrollbarContentProps`. Insets for sticky pinned
cells are available as `--virtualizer-pinned-left` and
`--virtualizer-pinned-right`. Headers, pinned rows, and body rows remain inside the
same outer `role="grid"` element. See [the complete renderers](./docs/ScrollContainerGrid.tsx)
for each layout's markup and optional pinned bands.

## Imperative scrolling

- `api.getScrollPosition()` returns `{ top, left }` in grid-local coordinates.
- `api.scrollToPosition({ top?, left? })` scrolls only the supplied axes and returns
  whether an owner moved. It returns `false` while the owner is unresolved.
- `api.refreshScrollContainer()` resolves the owner and refreshes geometry.

For an external owner, the position is relative to the grid's leading edge and the
effective viewport, including its insets. It can be negative before the grid or
extend beyond its end. Render indices are bounded separately. Horizontal positions
retain the native RTL convention: moving away from the start produces negative
`left` values. `onScrollChange` uses the same coordinates.

Mounting or changing an owner reads its current position. An explicit
`initialState.scroll` restores the requested grid-local position after mounting;
omit it to preserve page scroll restoration. Independent virtualizers sharing an
owner do not reset that owner's position on mount.

## Experiment and Mosaic integration

Run `pnpm docs:dev` and open `/x/experiments/virtualizer/`. The experiment includes
all built-in layouts, both external scroll owners, both axis configurations,
pinned sections, RTL, variable row heights, and multiple grids sharing an owner.

A future Mosaic integration can forward `scrollContainer`, `scrollContainerAxes`,
and `scrollViewportInsets` through its existing component. It should incorporate the
optional horizontal wrappers internally and replace direct `scrollTop`/`scrollLeft` reads
and writes with the methods above. The additional wrappers do not require new
consumer-facing Mosaic parts. This change does not add Material Data Grid props
or modify Mosaic.
