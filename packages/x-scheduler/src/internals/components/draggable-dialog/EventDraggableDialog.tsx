'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import useForkRef from '@mui/utils/useForkRef';
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
import { calculatePosition } from '../../utils/dialog-utils';

// 1. Setup the Draggable Paper Logic
const PaperComponent = React.forwardRef(function PaperComponent(
  props: PaperProps & {
    anchorElement: React.RefObject<HTMLElement | null>;
    handleRef: React.RefObject<HTMLDivElement>;
  },
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const nodeRef = React.useRef<HTMLDivElement>(null);
  const finalRef = useForkRef(ref, nodeRef);

  const mutateStyle = React.useCallback((style: string) => {
    if (nodeRef.current) {
      nodeRef.current.style.transform = style;
    }
  }, []);

  const { anchorElement, handleRef, ...other } = props;
  const resetDrag = useDraggableDialog(nodeRef, handleRef, mutateStyle);

  const updatePosition = React.useCallback(
    (shouldResetDrag = false) => {
      const position = calculatePosition(anchorElement, nodeRef.current, 'left');
      console.log('Calculated Position:', position);

      if (position && nodeRef.current) {
        nodeRef.current.style.top = `${position.top}px`;
        nodeRef.current.style.left = `${position.left}px`;

        if (shouldResetDrag) {
          // Reset transform when position is recalculated
          resetDrag();
        }
      }
    },
    [anchorElement, resetDrag, nodeRef],
  );

  React.useLayoutEffect(() => {
    updatePosition(true);
  }, [updatePosition]);

  React.useEffect(() => {
    const handleResize = () => {
      updatePosition(false);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updatePosition]);

  return (
    <Paper
      {...other}
      ref={finalRef}
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
});

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
  const paperRef = React.useRef<HTMLDivElement>(null);

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
        paper: { sx: { m: 0 }, anchorElement: anchor, handleRef, ref: paperRef },
      }}
      {...other}
    >
      <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        <MoreHorizIcon ref={handleRef} />
      </Box>
      <FormContent occurrence={occurrence} onClose={onClose} />

      {isScopeDialogOpen && <RecurringScopeDialog containerRef={paperRef} />}
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
