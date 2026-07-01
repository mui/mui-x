'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { styled } from '@mui/material/styles';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { EventToolbar } from './EventToolbar';
import { useEventEditingContext, useEventEditingStyledContext } from '../event-editing';
import { useAnchoredPosition } from '../../hooks/useAnchoredPosition';
import { useBlockScrollWhileArmed, useDisarmOnOutsidePointer } from '../armed-occurrence';
import { eventCalendarClasses } from '../../../event-calendar/eventCalendarClasses';

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
 * Desktop armed-event toolbar: a portaled, fixed wrapper anchored next to the event. Behaves like a
 * modal (outside tap disarms, scroll blocked) but keeps the event's resize handles interactive.
 */
export function AnchoredEventToolbar(props: AnchoredEventToolbarProps) {
  const { anchorRef, occurrence } = props;
  const { classes } = useEventEditingStyledContext();
  const { stopEditing } = useEventEditingContext();
  const nodeRef = React.useRef<HTMLDivElement>(null);

  useAnchoredPosition({ anchorRef, popupRef: nodeRef });

  // Modal behavior: an outside tap anywhere disarms and is swallowed, but a tap on the armed event's
  // resize handle is left alone so a resize gesture doesn't close the toolbar.
  useDisarmOnOutsidePointer({
    ref: nodeRef,
    active: true,
    onDisarm: stopEditing,
    ignoreSelector: `.${eventCalendarClasses.timeGridEventResizeHandler}`,
    global: true,
  });

  // Block scrolling everywhere while armed, so nothing scrolls out from under the toolbar. Only the
  // resize handle is spared, so the armed event can still be resized.
  useBlockScrollWhileArmed({
    active: true,
    ignoreSelector: `.${eventCalendarClasses.timeGridEventResizeHandler}`,
  });

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
