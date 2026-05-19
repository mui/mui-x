'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import Paper, { PaperProps } from '@mui/material/Paper';
import Dialog, { DialogProps, dialogClasses } from '@mui/material/Dialog';
import { backdropClasses } from '@mui/material/Backdrop';
import { styled, useThemeProps } from '@mui/material/styles';
import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useDraggableDialog } from '@mui/x-scheduler-internals/use-draggable-dialog';
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
  // Allow clicks to pass through the modal overlay so that clicking another
  // event while this dialog is open reaches its EventDialogTrigger directly.
  pointerEvents: 'none',
  [`& .${backdropClasses.root}`]: {
    backgroundColor: 'transparent',
  },
  [`& .${dialogClasses.container}`]: {
    width: '100%',
    justifyContent: 'unset',
    alignItems: 'unset',
  },
  [`& .${dialogClasses.paper}`]: {
    margin: 0,
    // Re-enable pointer events on the dialog paper so its content remains interactive.
    pointerEvents: 'auto',
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
    outline: `1px solid ${(theme.vars || theme).palette.primary.light}`,
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

  const { anchorRef, dragHandlerRef, className, ...other } = props;
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

  return <EventDialogPaper {...other} ref={nodeRef} className={className} />;
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
  const { schedulerId, classes } = useEventDialogStyledContext();

  // Selector hooks
  const isEventReadOnly = useStore(store, schedulerEventSelectors.isReadOnly, occurrence.id);
  const isScopeDialogOpen = useStore(store, schedulerOtherSelectors.isScopeDialogOpen);

  // When the modal overlay has pointer-events:none, the backdrop no longer intercepts
  // outside clicks. This effect replaces backdrop-based dismissal: it closes the dialog
  // when the user clicks outside the dialog paper and outside any event trigger.
  // Event trigger clicks are left alone so the trigger can switch to that event.
  React.useEffect(() => {
    if (!open || isScopeDialogOpen) {
      return undefined;
    }

    const handleDocumentClick = (clickEvent: MouseEvent) => {
      const target = clickEvent.target as Element;
      // Clicking inside the dialog paper — do nothing.
      if (target.closest('[role="dialog"]')) {
        return;
      }
      // Clicking another event trigger — let EventDialogTrigger handle switching.
      if (target.closest('[data-event-dialog-trigger]')) {
        return;
      }
      onClose();
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [open, onClose, isScopeDialogOpen]);

  // Ref hooks
  const dragHandlerRef = React.useRef<HTMLElement>(null);

  return (
    <EventDialogRoot
      ref={forwardedRef}
      open={open}
      onClose={onClose}
      PaperComponent={PaperComponent}
      aria-labelledby={`${schedulerId}-event-dialog-title`}
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

  // Track the occurrencePlaceholder object reference at the moment the dialog opens.
  // This lets onClose detect when a concurrent cell-click set a NEW creation placeholder
  // (React fires the cell handler before the document-close listener), so we preserve it.
  const placeholderAtDialogOpen = React.useRef<object | null>(null);

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
      onOpen={(occurrence) => {
        placeholderAtDialogOpen.current = store.state.occurrencePlaceholder;
        store.setEditedEventId(occurrence.id);
        store.setOpenEventId(occurrence.id);
      }}
      onClose={() => {
        store.setEditedEventId(null);
        store.setOpenEventId(null);
        // Only clear the occurrence placeholder if it has not been replaced by a new
        // creation placeholder. A new placeholder means the user clicked an empty cell
        // while this dialog was open — the cell's React handler fires before the
        // document-click listener calls onClose, so we must preserve it.
        if (store.state.occurrencePlaceholder === placeholderAtDialogOpen.current) {
          store.setOccurrencePlaceholder(null);
        }
      }}
    >
      {children}
      {showRecurrence && isScopeDialogOpen && <RecurringScopeDialog />}
    </EventDialog.Provider>
  );
}

export function EventDialogTrigger(props: EventDialogTriggerProps) {
  const { occurrence, children, ...other } = props;
  const ref = React.useRef<HTMLElement | null>(null);

  // Add a data attribute to the event element so the outside-click dismissal
  // handler can distinguish event clicks (which switch the dialog) from empty-
  // slot clicks (which should only close the dialog).
  const annotatedChild = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
        'data-event-dialog-trigger': 'true',
      })
    : children;

  return (
    <EventDialog.Trigger ref={ref} data={occurrence} {...other}>
      {annotatedChild}
    </EventDialog.Trigger>
  );
}
