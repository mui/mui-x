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
  element. Then remove the child cloning in `SchedulerDraggable`, `StandaloneEvent`, and
  `TimelineGridEventDependencyTerminal`.
- Add a monitor predicate such as `canMonitor` so dependency monitors can filter by store
  instance before receiving callbacks.
- Support an inset auto-scroll hitbox or a bounds callback. Then remove the timeline's
  `getBoundingClientRect` override for its pinned title column.
- Derive gesture styles from enabled pointer activations. Then remove the resize handle's
  layout effect that restores `touch-action: none` for direct touch and pen resizing.

## Intentional behavior

Dialog headers now support Base UI's touch long press. Title inputs and close buttons inside
that handle remain interactive, and compact drawers continue to disable dragging.
Mouse and touch regression tests cover the handle and its form controls.
