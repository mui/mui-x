import * as React from 'react';
import { ScrollArea } from '@base-ui/react/scroll-area';

// ---------------------------------------------------------------------------
// Thin wrappers that strip `ownerState` before forwarding to Base UI.
// `useSlotProps` adds `ownerState` for non‑string element types,
// but Base UI components would pass it through to the DOM.
// ---------------------------------------------------------------------------

export const ScrollRoot = React.forwardRef<HTMLDivElement>(function ScrollRoot(props: any, ref) {
  const { ownerState, ...other } = props;
  return <ScrollArea.Root {...other} ref={ref} />;
});

export const ScrollViewport = React.forwardRef<HTMLDivElement>(function ScrollViewport(
  props: any,
  ref,
) {
  const { ownerState, ...other } = props;
  return <ScrollArea.Viewport {...other} ref={ref} />;
});

export const ScrollScrollbar = React.forwardRef<HTMLDivElement>(function ScrollScrollbar(
  props: any,
  ref,
) {
  const { ownerState, ...other } = props;
  return <ScrollArea.Scrollbar {...other} ref={ref} />;
});

export const ScrollThumb = React.forwardRef<HTMLDivElement>(function ScrollThumb(
  props: any,
  ref,
) {
  const { ownerState, ...other } = props;
  return <ScrollArea.Thumb {...other} ref={ref} />;
});

// ---------------------------------------------------------------------------
// Shared default styles for scroll slots.
// Applied via `additionalProps` so consumers can override them through
// `slotProps` (which take higher priority in the `mergeSlotProps` order).
// ---------------------------------------------------------------------------

export const scrollbarStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  width: 8,
  paddingBlock: 2,
  boxSizing: 'border-box',
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
};

export const thumbStyle: React.CSSProperties = {
  flex: 1,
  borderRadius: 20,
  background: 'rgba(0, 0, 0, 0.28)',
};
