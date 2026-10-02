# Drag engine release checklist

Follow-up to [PR #23673 review](https://github.com/mui/mui-x/pull/23673#issuecomment-5831500254).
The Scheduler integration depends on the Base UI preview pinned in `pnpm-workspace.yaml`.
Keep the drag kinds on `internals` until the engine and its types are released.

## Before publishing

- Replace both Base UI preview URLs with released versions that include the drag engine.
- Remove the preview `@base-ui/utils` override and restore `blockExoticSubdeps`.
- Run the Data Grid, Charts, Pickers, Tree View, and Scheduler suites against those versions.
  The catalog and utils override affect the whole workspace, not only Scheduler.
- Audit selectors returning fresh arrays or objects for the released utils store contract.
  The polar interaction index selectors use `createSelectorMemoized` to keep stable results;
  keep those fixes unless the released selector contract makes them unnecessary.
- Decide the external integration's supported Base UI peer range before exposing it publicly.
  Preview consumers must use the matching preview. The current engine shares its registry
  across bundles through `Symbol.for('@base-ui/react/drag-and-drop/v1')`, so a second copy
  with the same protocol does not create a separate drag manager. Future incompatible
  protocol versions still need an explicit compatibility policy.
- Design the public drag API separately. Include move-kind aggregates, export any types
  consumers need to name, and decide whether `allDay` should replace the internal `day`
  vocabulary before committing to public kind names or IDs.

## Base UI follow-ups

These changes require a new upstream release or preview before Scheduler can use them.

- Let `Draggable.Root` accept a preview declaration or append its children to the render
  element. Then remove `withDragPreview`, which renders the preview beside the render element.
- Support an inset auto-scroll hitbox or a bounds callback. Then remove the timeline's
  `getBoundingClientRect` override for its pinned title column.

## Intentional behavior

Dialog headers now support Base UI's touch long press. Title inputs and close buttons inside
that handle remain interactive, and compact drawers continue to disable dragging.
On touch, only the header moves a read-only dialog, so a long press on its details still
selects text. Mouse and touch regression tests cover the handle and its form controls.

Time-grid resize handles start a resize on the first touch or pen contact, through the
engine's `immediate` activation. The handle no longer overrides `touch-action`: the engine
cancels every `touchmove` of the active drag, and on a touch screen the resize handles only show
on an armed event, whose `useBlockScrollWhileArmed` listener makes the touch sequence cancelable
before it starts. A Chromium browser test drives the gesture with real touch input. Verify it on a real
iOS device before publishing. A tap on a handle still reaches the event.

A time-grid resize locks the pointer to the column it started in, for every pointer type.
A mouse resize can no longer extend into the next day's column. Releasing a touch or pen resize
outside every column, for example below the grid, cancels it instead of committing the time
clamped to the day boundary.
