'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Box from '@mui/material/Box';
import Paper, { PaperProps } from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import { SchedulerEventOccurrence } from '@mui/x-scheduler-headless/models';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { useDraggableDialog } from '@mui/x-scheduler-headless/use-draggabble-dialog';
import {
  EventDraggableDialogProps,
  EventDraggableDialogProviderProps,
  EventDraggableDialogTriggerProps,
} from './EventDraggableDialog.types';
import { createDialog } from '../create-dialog';
import { FormContent } from './FormContent';
import { RecurringScopeDialog } from '../scope-dialog/ScopeDialog';

// 1. Setup the Draggable Paper Logic
function PaperComponent(
  props: PaperProps & { anchorEl?: HTMLElement | null; handleRef: React.RefObject<HTMLDivElement> },
) {
  const nodeRef = React.useRef<HTMLDivElement>(null);

  const mutateStyle = React.useCallback((style: string) => {
    if (nodeRef.current) {
      nodeRef.current.style.transform = style;
    }
  }, []);

  const { anchorEl, handleRef, ...other } = props;
  const resetDrag = useDraggableDialog(nodeRef, handleRef, mutateStyle);

  const calculatePosition = React.useCallback(
    (shouldResetDrag = false) => {
      const element = nodeRef.current;

      if (!element || !anchorEl) {
        return;
      }

      const anchorRect = anchorEl.getBoundingClientRect();
      const elemRect = element.getBoundingClientRect();
      const margin = 16;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let top = 0;
      let left = 0;

      // Helper to clamp values to viewport
      const clamp = (value: number, min: number, max: number) =>
        Math.max(min, Math.min(value, max));

      // Determine available space
      const spaceRight = windowWidth - anchorRect.right;
      const spaceLeft = anchorRect.left;
      const spaceBottom = windowHeight - anchorRect.bottom;
      const spaceTop = anchorRect.top;

      if (spaceRight >= elemRect.width + margin) {
        // Position Right
        left = anchorRect.right + margin;
        // Align Top, but clamp to viewport
        top = anchorRect.top;
        top = clamp(top, margin, windowHeight - elemRect.height - margin);
      } else if (spaceLeft >= elemRect.width + margin) {
        // Position Left
        left = anchorRect.left - elemRect.width - margin;
        // Align Top, but clamp to viewport
        top = anchorRect.top;
        top = clamp(top, margin, windowHeight - elemRect.height - margin);
      } else if (spaceBottom >= elemRect.height + margin) {
        // Position Bottom
        top = anchorRect.bottom + margin;
        // Align Left, clamp
        left = anchorRect.left;
        left = clamp(left, margin, windowWidth - elemRect.width - margin);
      } else if (spaceTop >= elemRect.height + margin) {
        // Position Top
        top = anchorRect.top - elemRect.height - margin;
        // Align Left, clamp
        left = anchorRect.left;
        left = clamp(left, margin, windowWidth - elemRect.width - margin);
      } else {
        // Fallback: Center on screen
        left = (windowWidth - elemRect.width) / 2;
        top = (windowHeight - elemRect.height) / 2;
      }

      element.style.top = `${top}px`;
      element.style.left = `${left}px`;

      if (shouldResetDrag) {
        // Reset transform when position is recalculated
        resetDrag();
      }
    },
    [anchorEl, resetDrag],
  );

  React.useLayoutEffect(() => {
    calculatePosition(true);
  }, [calculatePosition]);

  React.useEffect(() => {
    const handleResize = () => {
      calculatePosition(false);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [calculatePosition]);

  return (
    <Paper
      {...other}
      ref={nodeRef}
      sx={{
        position: 'relative',
        inset: 0,
        p: 2,
        borderWidth: 0,
        borderTopWidth: 1,
        height: 'fit-content',
        m: 0,
        cursor: 'move',
      }}
    />
  );
}

const EventDraggableDialog = createDialog<SchedulerEventOccurrence>({
  contextName: 'EventDraggableDialogContext',
});

export const EventDraggableDialogContext = EventDraggableDialog.Context;
export const useEventDraggableDialogContext = EventDraggableDialog.useContext;

export const EventDraggableDialogContent = React.forwardRef(function EventDraggableDialogContent(
  props: EventDraggableDialogProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { style, container, anchor, occurrence, onClose, open, ...other } = props;
  const handleRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Context hooks
  const store = useSchedulerStoreContext();

  // Selector hooks
  //   const color = useStore(store, schedulerEventSelectors.color, occurrence.id);
  const isEventReadOnly = useStore(store, schedulerEventSelectors.isReadOnly, occurrence.id);
  const isScopeDialogOpen = useStore(store, schedulerOtherSelectors.isScopeDialogOpen);

  return (
    <Dialog
      ref={forwardedRef}
      open={open}
      onClose={onClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      aria-modal="false"
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'transparent',
          },
        },
        container: {
          sx: { width: '100%', justifyContent: 'unset', alignItems: 'unset' },
        },
        paper: { sx: { m: 0 }, anchorEl: anchor, handleRef },
      }}
      {...other}
    >
      <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        <MoreHorizIcon ref={handleRef} />
      </Box>
      <FormContent occurrence={occurrence} onClose={onClose} />

      {isScopeDialogOpen && <RecurringScopeDialog containerRef={containerRef} />}
    </Dialog>
  );
});

export function EventDraggableDialogProvider(props: EventDraggableDialogProviderProps) {
  const { children } = props;
  const store = useSchedulerStoreContext();

  return (
    <EventDraggableDialog.Provider
      render={({ anchor, data: occurrence, onClose, isOpen }) => (
        <EventDraggableDialogContent
          anchor={anchor}
          occurrence={occurrence}
          onClose={onClose}
          open={isOpen}
        />
      )}
      onClose={() => {
        store.setOccurrencePlaceholder(null);
      }}
    >
      {children}
    </EventDraggableDialog.Provider>
  );
}

export function EventDraggableDialogTrigger(props: EventDraggableDialogTriggerProps) {
  const { occurrence, ...other } = props;

  return <EventDraggableDialog.Trigger data={occurrence} {...other} />;
}
