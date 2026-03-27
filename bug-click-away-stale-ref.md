# Bug: DesktopTimePicker doesn't close on click-away after Enter key selection

## Summary

Pressing Enter to select a time value in `DesktopTimePicker` (or `DesktopTimeRangePicker`) prevents the subsequent click-away from closing the picker. `onClose` and `onAccept` are never called even though `closeOnSelect={false}` should allow the picker to remain open until the user clicks outside.

**Root cause**: A stale `syntheticEventRef` in `useClickAwayListener` (inside `PickerPopper.tsx`). A programmatic `.click()` dispatched by ButtonBase's Enter key handler sets `syntheticEventRef = true` via the paper's React `onClick`, but the native `handleClickAway` returns early (no preceding `mousedown` → `activatedRef = false`) without resetting it. The next real click-away reads the stale `true` and suppresses dismissal.

**Surfaced by**: React 19 (shipped with MUI v9). React 19 attaches event listeners directly to DOM nodes instead of delegating to the root. This causes programmatic `.click()` to trigger React synthetic handlers on ancestor nodes, which didn't happen in React 18.

**Fix**: Reset `syntheticEventRef` before the early return in `handleClickAway`.

## Affected components

- `DesktopTimePicker` (single-column DigitalClock)
- `DesktopTimeRangePicker` (single-input, single-column)
- Any desktop picker where a focusable item inside the popper receives Enter key

Not affected: `DesktopDatePicker`, `DesktopDateTimePicker` — their calendar views don't auto-focus interactive items inside the popper in the same way.

## Reproduction steps

1. Render `<DesktopTimePicker closeOnSelect={false} />`
2. Click the open picker button → picker opens, DigitalClock auto-focuses a time item
3. Press Enter → selects the focused time value (`onChange` fires)
4. Click outside the picker → **expected**: picker closes (`onClose` fires) / **actual**: nothing happens

## Detailed analysis

### Event flow on Enter key (step 3)

```
user.keyboard('{Enter}')
  → keydown on focused MenuItem (inside DigitalClock)
  → ButtonBase.handleKeyDown detects Enter on non-native button
  → calls event.currentTarget.click()  [programmatic, no mousedown]
  → native click event dispatched on MenuItem
  → bubbles through paper DOM
  → React onClick on paper fires (handleSynthetic)
     → syntheticEventRef.current = true  ← SET HERE
  → native click reaches document listener (handleClickAway)
     → activatedRef.current = false  (no mousedown preceded this click)
     → returns early WITHOUT resetting syntheticEventRef  ← BUG
```

### Event flow on click-away (step 4)

```
user.click(document.body)
  → mousedown on body
     → armClickAwayListener fires → activatedRef.current = true
  → click on body (outside paper)
  → handleClickAway fires:
     → activatedRef.current = true  ✓
     → insideReactTree = syntheticEventRef.current = true  ← STALE from step 3
     → syntheticEventRef.current = false  (reset, but too late)
     → insideDOM = false  (body is outside paper)
     → condition: !insideDOM && !insideReactTree → false
     → click-away SUPPRESSED → dismissViews() never called
```

### Why React 19 exposes this

In React 18, event delegation was at the root container. A programmatic `.click()` dispatched by `ButtonBase` would bubble through the DOM, but React 18's delegation might not fire the synthetic `onClick` on the paper element for programmatic clicks originating from within the same React tree in the same way.

In React 19, React attaches `onClick` listeners directly to individual DOM nodes. When `ButtonBase` calls `.click()`, the click event bubbles normally and hits the paper's directly-attached React listener, firing `handleSynthetic` and setting `syntheticEventRef = true`. This is the new behavior that triggers the latent bug.

### Why only time pickers are affected

`DesktopTimePicker` with single-column mode uses `DigitalClock`, which renders time options as `MenuItem` components. On mount, it auto-focuses the selected/default item (line 230-232 of `DigitalClock.tsx`):

```tsx
if ((autoFocus || !!focusedView) && activeItem !== lastActiveRef.current) {
  lastActiveRef.current = activeItem;
  activeItem.focus();
}
```

This means when the user presses Enter, it fires on the focused MenuItem inside the popper. `DesktopDatePicker`'s calendar doesn't auto-focus items in the popper in the same way — focus stays on the field input, so Enter doesn't trigger a programmatic `.click()` inside the popper.

## Fix

File: `packages/x-date-pickers/src/internals/components/PickerPopper/PickerPopper.tsx`

```diff
 const handleClickAway = useEventCallback((event: MouseEvent | TouchEvent) => {
   if (!activatedRef.current) {
+    syntheticEventRef.current = false;
     return;
   }
```

Reset `syntheticEventRef` before the early return so it doesn't leak into the next `handleClickAway` invocation.
