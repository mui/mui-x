'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import Paper, { PaperProps } from '@mui/material/Paper';
import Dialog, { DialogProps, dialogClasses } from '@mui/material/Dialog';
import { backdropClasses } from '@mui/material/Backdrop';
import { styled, useThemeProps } from '@mui/material/styles';
import {
  schedulerEventSelectors,
  schedulerOccurrencePlaceholderSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useDraggableDialog } from '@mui/x-scheduler-internals/use-draggable-dialog';
import { EventDialogProps, EventDialogProviderProps } from './EventDialog.types';
import {
  EditingSurfaceContext,
  EventEditingProvider,
  EventEditingOptionalRenderers,
  EventEditingOptionalRenderersContext,
  useEventEditingStyledContext,
  FormContent,
} from '../event-editing';
import { calculatePosition } from '../../utils/dialog-utils';
import ReadonlyContent from './ReadonlyContent';

const EventDialogRoot = styled(Dialog, {
  name: 'MuiEventDialog',
  slot: 'Root',
})({
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

export const EventDialogContent = React.forwardRef(function EventDialogContent(
  inProps: EventDialogProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  // eslint-disable-next-line mui/material-ui-name-matches-component-name
  const props = useThemeProps({ props: inProps, name: 'MuiEventDialog' });
  const { style, anchorRef, occurrence, onClose, open, ...other } = props;
  // Context hooks
  const store = useSchedulerStoreContext();
  const { schedulerId, classes } = useEventEditingStyledContext();

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

/**
 * The desktop editing surface provider.
 *
 * It renders the anchored, draggable event dialog through the shared editing backbone
 * (`EventEditingProvider`) and stacks the recurring scope confirmation on top when the store asks
 * for it. Opening/closing records the editing state on the store (`startEditing`/`stopEditing`),
 * keeping "what is being edited" (the store) decoupled from "which surface is open" (the modal).
 */
export function EventDialogProvider(props: EventDialogProviderProps) {
  const { children, optionalRenderers, ...other } = props;
  const store = useSchedulerStoreContext();

  // The recurring scope confirmation renders itself: it reads its open state from the store and
  // picks its own shell (centered dialog here, bottom-sheet drawer in the compact drawer) from the
  // surrounding `EditingSurfaceContext`.
  const RecurringScopeRenderer = optionalRenderers?.recurringScope;

  return (
    <EditingSurfaceContext.Provider value="dialog">
      <EventEditingOptionalRenderersContext.Provider
        value={optionalRenderers ?? (EMPTY_OBJECT as EventEditingOptionalRenderers)}
      >
        <EventEditingProvider
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
            store.startEditing(
              occurrence,
              schedulerOccurrencePlaceholderSelectors.isCreating(store.state)
                ? 'creation'
                : 'event',
            );
          }}
          onClose={() => {
            store.stopEditing();
          }}
        >
          {children}
          {RecurringScopeRenderer && <RecurringScopeRenderer />}
        </EventEditingProvider>
      </EventEditingOptionalRenderersContext.Provider>
    </EditingSurfaceContext.Provider>
  );
}
