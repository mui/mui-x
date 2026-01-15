'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
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

interface PaperComponentProps extends PaperProps {
  anchorRef: React.RefObject<HTMLElement>;
  handleRef: React.RefObject<HTMLDivElement>;
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
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updatePosition]);

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
  const { style, container, anchorRef, occurrence, onClose, open, ...other } = props;
  // Context hooks
  const store = useSchedulerStoreContext();

  // Selector hooks
  const isEventReadOnly = useStore(store, schedulerEventSelectors.isReadOnly, occurrence.id);

  // Ref hooks
  const handleRef = React.useRef<HTMLButtonElement>(null);

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
        paper: { sx: { m: 0 }, anchorRef, handleRef } as PaperProps,
      }}
      {...other}
    >
      <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        <IconButton size="small" aria-label="drag-handle" ref={handleRef}>
          <MoreHorizIcon />
        </IconButton>
      </Box>
      {isEventReadOnly ? (
        <ReadonlyContent occurrence={occurrence} onClose={onClose} />
      ) : (
        <FormContent occurrence={occurrence} onClose={onClose} />
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
