'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { styled } from '@mui/material/styles';
import { modalClasses } from '@mui/material/Modal';
import { useStore } from '@base-ui/utils/store';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
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
  anchor: HTMLElement | null;
  occurrence: SchedulerRenderableEventOccurrence;
}

/**
 * Desktop armed-event toolbar: a portaled, fixed wrapper anchored next to the event. Behaves like a
 * modal (outside tap disarms, scroll blocked) but keeps the event's resize handles interactive.
 */
export function AnchoredEventToolbar(props: AnchoredEventToolbarProps) {
  const { anchor, occurrence } = props;
  const { classes } = useEventEditingStyledContext();
  const { stopEditing } = useEventEditingContext();
  const store = useSchedulerStoreContext();
  const nodeRef = React.useRef<HTMLDivElement>(null);

  // The scope dialog stacks above the still-armed toolbar and owns its own dismissal and scrolling,
  // so both global handlers stand down.
  const isScopeDialogOpen = useStore(store, schedulerOtherSelectors.isRecurringScopeDialogOpen);

  useAnchoredPosition({ anchor, popupRef: nodeRef });

  // Skip the resize handle so finishing a resize can't disarm. Match the whole modal root, since MUI
  // puts `role="dialog"` on the paper only and its backdrop would look "outside".
  useDisarmOnOutsidePointer({
    ref: nodeRef,
    active: !isScopeDialogOpen,
    onDisarm: stopEditing,
    ignoreSelector: `.${eventCalendarClasses.timeGridEventResizeHandler}, .${modalClasses.root}`,
    global: true,
  });

  // Block scrolling everywhere while armed, so nothing scrolls out from under the toolbar. Only the
  // resize handle is spared, so the armed event can still be resized.
  useBlockScrollWhileArmed({
    active: !isScopeDialogOpen,
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
