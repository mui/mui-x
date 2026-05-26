'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import Paper, { PaperProps } from '@mui/material/Paper';
import Dialog, { DialogProps, dialogClasses } from '@mui/material/Dialog';
import { backdropClasses } from '@mui/material/Backdrop';
import { styled, useThemeProps } from '@mui/material/styles';
import {
  SchedulerEventId,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler-internals/models';
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
import { calculatePosition } from '../../utils/dialog-utils';
import ReadonlyContent from './ReadonlyContent';
import { useEventDialogStyledContext } from './EventDialogStyledContext';
import {
  EventDialogOptionalRenderers,
  EventDialogOptionalRenderersContext,
} from './EventDialogOptionalRenderersContext';
import type { ModalImperativeHandle } from '../create-modal/createModal.types';

const EventDialogRoot = styled(Dialog, {
  name: 'MuiEventDialog',
  slot: 'Root',
})({
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

function isFromEventDialogTrigger(
  event: MouseEvent | TouchEvent,
  schedulerId: string | undefined,
): boolean {
  const selector =
    schedulerId != null
      ? `[data-event-dialog-trigger="${schedulerId}"]`
      : '[data-event-dialog-trigger]';
  const composedPath = event.composedPath?.();
  if (composedPath) {
    for (const node of composedPath) {
      if (!(node instanceof Element)) {
        continue;
      }
      if (node.matches(selector)) {
        return true;
      }
    }
  }
  if (event.target instanceof Element) {
    return Boolean(event.target.closest(selector));
  }
  return false;
}

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
  const dialogInstanceKey = occurrence.key ?? occurrence.id;
  // Context hooks
  const store = useSchedulerStoreContext();
  const { schedulerId, classes } = useEventDialogStyledContext();

  // Selector hooks
  const isEventReadOnly = useStore(store, schedulerEventSelectors.isReadOnly, occurrence.id);
  const isScopeDialogOpen = useStore(store, schedulerOtherSelectors.isRecurringScopeDialogOpen);

  const handleClickAway = React.useCallback(
    (event: MouseEvent | TouchEvent) => {
      // Clicking another event trigger in THIS scheduler — let EventDialogTrigger handle switching.
      // Triggers from a different scheduler instance must not suppress close.
      if (isFromEventDialogTrigger(event, schedulerId)) {
        return;
      }
      onClose();
    },
    [onClose, schedulerId],
  );

  // Ref hooks
  const dragHandlerRef = React.useRef<HTMLElement>(null);

  return (
    <ClickAwayListener
      onClickAway={handleClickAway}
      mouseEvent={open && !isScopeDialogOpen ? 'onMouseDown' : false}
      touchEvent={false}
    >
      <EventDialogRoot
        key={dialogInstanceKey}
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
    </ClickAwayListener>
  );
});

export function EventDialogProvider(props: EventDialogProviderProps) {
  const { children, optionalRenderers, ...other } = props;
  const store = useSchedulerStoreContext();
  const isRecurringScopeDialogOpen = useStore(
    store,
    schedulerOtherSelectors.isRecurringScopeDialogOpen,
  );
  const showRecurrence = useStore(store, schedulerOtherSelectors.areRecurringEventsAvailable);

  const RecurringScopeDialogRenderer = optionalRenderers?.recurringScopeDialog;

  const imperativeRef =
    React.useRef<ModalImperativeHandle<SchedulerRenderableEventOccurrence>>(null);
  const lastSyncedEventId = React.useRef<SchedulerEventId | null>(null);

  const openEventId = useStore(store, schedulerOtherSelectors.openEventId);
  React.useEffect(() => {
    if (openEventId === lastSyncedEventId.current) {
      return;
    }
    lastSyncedEventId.current = openEventId;
    if (openEventId !== null) {
      const processed = store.state.processedEventLookup.get(openEventId);
      if (processed) {
        imperativeRef.current?.open({ ...processed, key: String(processed.id) });
      }
    } else {
      imperativeRef.current?.close();
    }
  }, [openEventId, store]);

  return (
    <EventDialogOptionalRenderersContext.Provider
      value={optionalRenderers ?? (EMPTY_OBJECT as EventDialogOptionalRenderers)}
    >
      <EventDialog.Provider
        imperativeRef={imperativeRef}
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
          store.setEditedEventId(occurrence.id);
          lastSyncedEventId.current = occurrence.id;
          store.setOpenEventId(occurrence.id);
        }}
        onClose={() => {
          store.setEditedEventId(null);
          lastSyncedEventId.current = null;
          store.setOpenEventId(null);
          store.setOccurrencePlaceholder(null);
        }}
      >
        {children}
        {showRecurrence && isRecurringScopeDialogOpen && RecurringScopeDialogRenderer && (
          <RecurringScopeDialogRenderer />
        )}
      </EventDialog.Provider>
    </EventDialogOptionalRenderersContext.Provider>
  );
}

export function EventDialogTrigger(props: EventDialogTriggerProps) {
  const { occurrence, children, ...other } = props;
  const ref = React.useRef<HTMLElement | null>(null);
  const { schedulerId } = useEventDialogStyledContext();

  const annotatedChild = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
        'data-event-dialog-trigger': schedulerId ?? 'true',
      })
    : children;

  return (
    <EventDialog.Trigger ref={ref} data={occurrence} {...other}>
      {annotatedChild}
    </EventDialog.Trigger>
  );
}
