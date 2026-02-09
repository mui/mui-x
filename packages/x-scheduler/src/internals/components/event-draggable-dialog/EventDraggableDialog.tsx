'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import Paper, { PaperProps } from '@mui/material/Paper';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-headless/models';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { useDraggableDialog } from '@mui/x-scheduler-headless/use-draggable-dialog';
import {
  EventDraggableDialogProps,
  EventDraggableDialogProviderProps,
  EventDraggableDialogTriggerProps,
} from './EventDraggableDialog.types';
import { createModal } from '../create-modal';
import { FormContent } from './FormContent';
import { RecurringScopeDialog } from '../scope-dialog/ScopeDialog';
import { calculatePosition } from '../../utils/dialog-utils';
import ReadonlyContent from './ReadonlyContent';
import { useEventDialogClasses } from './EventDialogClassesContext';

interface PaperComponentProps extends PaperProps {
  anchorRef: React.RefObject<HTMLElement>;
  handleRef: React.RefObject<HTMLElement>;
}

// 1. Setup the Draggable Paper Logic
const PaperComponent = function PaperComponent(props: PaperComponentProps) {
  const nodeRef = React.useRef<HTMLDivElement>(null);

  const mutateStyle = React.useCallback(
    (style: string) => {
      if (nodeRef.current) {
        nodeRef.current.style.transform = style;
      }
    },
    [nodeRef],
  );

  const { anchorRef, handleRef, ...other } = props;
  const resetDrag = useDraggableDialog(nodeRef, handleRef, mutateStyle);

  const updatePosition = React.useCallback(
    (shouldResetDrag = false) => {
      const position = calculatePosition(anchorRef.current, nodeRef.current, 'left');
      if (position && nodeRef.current) {
        nodeRef.current.style.top = `${position.top}px`;
        nodeRef.current.style.left = `${position.left}px`;

        if (shouldResetDrag) {
          // Reset transform when position is recalculated
          resetDrag();
        }
      }
    },
    [anchorRef, resetDrag, nodeRef],
  );

  React.useLayoutEffect(() => {
    updatePosition(true);
  }, [updatePosition]);

  React.useEffect(() => {
    const handleResize = () => {
      updatePosition(false);
      resetDrag();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updatePosition, resetDrag]);

  return (
    <Paper
      {...other}
      ref={nodeRef}
      sx={{
        borderWidth: 0,
        borderTopWidth: 1,
        height: 'fit-content',
        m: 0,
      }}
    />
  );
} as any as DialogProps['PaperComponent'];

const EventDraggableDialog = createModal<SchedulerRenderableEventOccurrence>({
  contextName: 'EventDraggableDialogContext',
});

export const EventDraggableDialogContext = EventDraggableDialog.Context;
export const useEventDraggableDialogContext = EventDraggableDialog.useContext;

export const EventDraggableDialogContent = React.forwardRef(function EventDraggableDialogContent(
  props: EventDraggableDialogProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { style, anchorRef, occurrence, onClose, open, ...other } = props;
  // Context hooks
  const store = useSchedulerStoreContext();
  const classes = useEventDialogClasses();

  // Selector hooks
  const isEventReadOnly = useStore(store, schedulerEventSelectors.isReadOnly, occurrence.id);

  // Ref hooks
  const handleRef = React.useRef<HTMLElement>(null);

  return (
    <Dialog
      ref={forwardedRef}
      open={open}
      onClose={onClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      aria-modal="false"
      className={classes.eventDialog}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'transparent',
          },
        },
        container: {
          sx: { width: '100%', justifyContent: 'unset', alignItems: 'unset' },
        },
        paper: { sx: { m: 0 }, anchorRef, handleRef } as PaperProps,
      }}
      {...other}
    >
      {isEventReadOnly ? (
        <ReadonlyContent occurrence={occurrence} onClose={onClose} handleRef={handleRef} />
      ) : (
        <FormContent occurrence={occurrence} onClose={onClose} handleRef={handleRef} />
      )}
    </Dialog>
  );
});

export function EventDraggableDialogProvider(props: EventDraggableDialogProviderProps) {
  const { children, ...other } = props;
  const store = useSchedulerStoreContext();
  const isScopeDialogOpen = useStore(store, schedulerOtherSelectors.isScopeDialogOpen);

  return (
    <EventDraggableDialog.Provider
      render={({ isOpen, anchorRef, data: occurrence, onClose }) => (
        <EventDraggableDialogContent
          open={isOpen}
          anchorRef={anchorRef}
          occurrence={occurrence}
          onClose={onClose}
          {...other}
        />
      )}
      onClose={() => {
        store.setOccurrencePlaceholder(null);
      }}
    >
      {children}
      {isScopeDialogOpen && <RecurringScopeDialog />}
    </EventDraggableDialog.Provider>
  );
}

export function EventDraggableDialogTrigger(props: EventDraggableDialogTriggerProps) {
  const { occurrence, ...other } = props;
  const ref = React.useRef<HTMLElement | null>(null);

  return <EventDraggableDialog.Trigger ref={ref} data={occurrence} {...other} />;
}
