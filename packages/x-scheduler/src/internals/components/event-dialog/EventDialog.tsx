'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import Paper, { PaperProps } from '@mui/material/Paper';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import { styled, useThemeProps } from '@mui/material/styles';
import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-headless/models';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { useDraggableDialog } from '@mui/x-scheduler-headless/use-draggable-dialog';
import {
  EventDialogProps,
  EventDialogProviderProps,
  EventDialogTriggerProps,
} from './EventDialog.types';
import { createModal } from '../create-modal';
import { FormContent } from './FormContent';
import { RecurringScopeDialog } from '../scope-dialog/ScopeDialog';
import { calculatePosition } from '../../utils/dialog-utils';
import ReadonlyContent from './ReadonlyContent';
import { useEventDialogStyledContext } from './EventDialogStyledContext';

const EventDialogRoot = styled(Dialog, {
  name: 'MuiEventDialog',
  slot: 'Root',
})({
  '& .MuiBackdrop-root': {
    backgroundColor: 'transparent',
  },
  '& .MuiDialog-container': {
    width: '100%',
    justifyContent: 'unset',
    alignItems: 'unset',
  },
  '& .MuiDialog-paper': {
    margin: 0,
  },
});

const EventDialogPaper = styled(Paper, {
  name: 'MuiEventDialog',
  slot: 'Paper',
})(({ theme }) => ({
  borderWidth: 0,
  borderTopWidth: 1,
  height: 'fit-content',
  overflow: 'hidden',
  '&[data-dragging]': {
    outline: `1px solid ${theme.palette.primary.light}`,
  },
}));

interface PaperComponentProps extends PaperProps {
  anchorRef: React.RefObject<HTMLElement>;
  dragHandlerRef: React.RefObject<HTMLElement | null>;
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

  const { anchorRef, dragHandlerRef, ...other } = props;
  const resetDrag = useDraggableDialog(nodeRef, dragHandlerRef, mutateStyle);

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

  return <EventDialogPaper {...other} ref={nodeRef} />;
} as any as DialogProps['PaperComponent'];

const EventDialog = createModal<SchedulerRenderableEventOccurrence>({
  contextName: 'EventDialogContext',
});

export const EventDialogContext = EventDialog.Context;
export const useEventDialogContext = EventDialog.useContext;

export const EventDialogContent = React.forwardRef(function EventDialogContent(
  inProps: EventDialogProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  // eslint-disable-next-line mui/material-ui-name-matches-component-name
  const props = useThemeProps({ props: inProps, name: 'MuiEventDialog' });
  const { style, anchorRef, occurrence, onClose, open, ...other } = props;
  // Context hooks
  const store = useSchedulerStoreContext();
  const { classes } = useEventDialogStyledContext();

  // Selector hooks
  const isEventReadOnly = useStore(store, schedulerEventSelectors.isReadOnly, occurrence.id);

  // Ref hooks
  const dragHandlerRef = React.useRef<HTMLElement>(null);

  return (
    <EventDialogRoot
      ref={forwardedRef}
      open={open}
      onClose={onClose}
      PaperComponent={PaperComponent}
      aria-labelledby="event-dialog-title"
      aria-modal="false"
      className={classes.eventDialog}
      slotProps={{
        paper: { className: classes.eventDialogPaper, anchorRef, dragHandlerRef } as PaperProps,
      }}
      {...other}
    >
      {isEventReadOnly ? (
        <ReadonlyContent
          occurrence={occurrence}
          onClose={onClose}
          dragHandlerRef={dragHandlerRef}
        />
      ) : (
        <FormContent occurrence={occurrence} onClose={onClose} dragHandlerRef={dragHandlerRef} />
      )}
    </EventDialogRoot>
  );
});

export function EventDialogProvider(props: EventDialogProviderProps) {
  const { children, ...other } = props;
  const store = useSchedulerStoreContext();
  const isScopeDialogOpen = useStore(store, schedulerOtherSelectors.isScopeDialogOpen);
  const showRecurrence = useStore(store, schedulerOtherSelectors.areRecurringEventsAvailable);

  return (
    <EventDialog.Provider
      render={({ isOpen, anchorRef, data: occurrence, onClose }) => (
        <EventDialogContent
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
      {showRecurrence && isScopeDialogOpen && <RecurringScopeDialog />}
    </EventDialog.Provider>
  );
}

export function EventDialogTrigger(props: EventDialogTriggerProps) {
  const { occurrence, ...other } = props;
  const ref = React.useRef<HTMLElement | null>(null);

  return <EventDialog.Trigger ref={ref} data={occurrence} {...other} />;
}
