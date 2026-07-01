'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { styled } from '@mui/material/styles';
import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { EventToolbar } from './EventToolbar';
import { useEventEditingStyledContext } from '../event-editing';
import { useAnchoredPosition } from '../../hooks/useAnchoredPosition';

const AnchoredEventToolbarRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'AnchoredToolbar',
})(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: (theme.vars || theme).zIndex.modal,
}));

interface AnchoredEventToolbarProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  occurrence: SchedulerRenderableEventOccurrence;
}

/**
 * Desktop mount for the armed-event toolbar: a portaled, fixed-positioned wrapper anchored next to
 * the event. Unlike the editing dialog it has no backdrop, so the grid stays interactive — the armed
 * event keeps its resize handles and an outside tap still disarms it. The event is positioned via
 * inline CSS variables, so a `MutationObserver` on its `style` keeps the toolbar following resizes.
 */
export function AnchoredEventToolbar(props: AnchoredEventToolbarProps) {
  const { anchorRef, occurrence } = props;
  const { classes } = useEventEditingStyledContext();
  const nodeRef = React.useRef<HTMLDivElement>(null);

  useAnchoredPosition({ anchorRef, popupRef: nodeRef });

  if (typeof document === 'undefined') {
    return null;
  }

  return ReactDOM.createPortal(
    <AnchoredEventToolbarRoot ref={nodeRef} className={classes.anchoredEventToolbar}>
      <EventToolbar occurrence={occurrence} />
    </AnchoredEventToolbarRoot>,
    document.body,
  );
}
