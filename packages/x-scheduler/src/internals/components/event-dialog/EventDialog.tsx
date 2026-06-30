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
  schedulerOtherSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useDraggableDialog } from '@mui/x-scheduler-internals/use-draggable-dialog';
import { EventDialogProps, EventDialogProviderProps } from './EventDialog.types';
import {
  EventEditingProvider,
  EventEditingOptionalRenderers,
  EventEditingOptionalRenderersContext,
  useEventEditingContext,
  useEventEditingStyledContext,
  FormContent,
} from '../event-editing';
import { calculatePosition } from '../../utils/dialog-utils';
import { AnchoredEventToolbar } from '../event-toolbar';
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
      // Anchor may have been detached (e.g. occurrence replaced by an exception); skip stale nodes.
      if (anchorRef.current != null && !anchorRef.current.isConnected) {
        return;
      }
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

  // Position synchronously on mount, before paint, to avoid a flash at the wrong spot.
  React.useLayoutEffect(() => {
    updatePosition(true);
  }, [updatePosition]);

  // Keep the dialog anchored as things change, without coupling to the store: a `ResizeObserver`
  // on the paper catches content/height swaps; a `MutationObserver` on the anchor catches its
  // inline-style changes (the event is positioned via CSS custom properties).
  React.useEffect(() => {
    const reposition = () => updatePosition(true);

    const paper = nodeRef.current;
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' && paper ? new ResizeObserver(reposition) : null;
    if (paper) {
      resizeObserver?.observe(paper);
    }

    const anchor = anchorRef.current;
    const mutationObserver =
      typeof MutationObserver !== 'undefined' && anchor ? new MutationObserver(reposition) : null;
    if (anchor) {
      mutationObserver?.observe(anchor, { attributes: true, attributeFilter: ['style'] });
    }

    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [anchorRef, updatePosition]);

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
  const { style, anchorRef, occurrence: occurrenceProp, onClose, open, ...other } = props;
  // Context hooks
  const store = useSchedulerStoreContext();
  const { schedulerId, classes } = useEventEditingStyledContext();

  // Selector hooks
  // Fall back to the prop while closing, when the editing occurrence has already been cleared.
  const editingOccurrence = useStore(store, schedulerOtherSelectors.editingOccurrence);
  const occurrence = editingOccurrence ?? occurrenceProp;
  const isEventReadOnly = useStore(store, schedulerEventSelectors.isReadOnly, occurrence.id);

  // Ref hooks
  const dragHandlerRef = React.useRef<HTMLElement>(null);

  // Read-only events have no editing form; editable events open the form fresh on each occurrence
  // (keyed) so it initializes from the current times.
  const content = isEventReadOnly ? (
    <ReadonlyContent occurrence={occurrence} onClose={onClose} dragHandlerRef={dragHandlerRef} />
  ) : (
    <FormContent
      key={occurrence.key}
      occurrence={occurrence}
      onClose={onClose}
      dragHandlerRef={dragHandlerRef}
    />
  );

  return (
    <EventDialogRoot
      ref={forwardedRef}
      open={open}
      onClose={onClose}
      PaperComponent={PaperComponent}
      aria-labelledby={`${schedulerId}-event-dialog-title`}
      aria-modal="false"
      // Non-modal: keep the grid behind usable (focus + scroll) while the dialog is open.
      disableEnforceFocus
      className={classes.eventDialog}
      slotProps={{
        paper: {
          className: classes.eventDialogPaper,
          anchorRef,
          dragHandlerRef,
        } as PaperProps,
      }}
      {...other}
    >
      {content}
    </EventDialogRoot>
  );
});

/**
 * Mounts the armed-event action toolbar next to the event while editing is in the `'armed'` stage.
 * Rendered at the top level alongside (not inside) the dialog, so the toolbar and dialog stay
 * independent. The toolbar's Edit switches the store to `'edit'`, which swaps in the dialog below.
 */
function AnchoredEventToolbarSurface() {
  const store = useSchedulerStoreContext();
  const { anchorRef } = useEventEditingContext();
  const editingOccurrence = useStore(store, schedulerOtherSelectors.editingOccurrence);
  const editingMode = useStore(store, schedulerOtherSelectors.editingMode);

  // Render only while armed, once we have both an occurrence and an anchor to position against.
  if (editingMode !== 'armed' || editingOccurrence == null || anchorRef.current == null) {
    return null;
  }

  return <AnchoredEventToolbar anchorRef={anchorRef} occurrence={editingOccurrence} />;
}

/**
 * Mounts the desktop dialog while an occurrence is being edited in the `'edit'` stage, anchored to
 * the element editing started from. Open/which all come from the store; the anchor comes from the
 * editing context.
 */
function EventDialogSurface() {
  const store = useSchedulerStoreContext();
  const { anchorRef, stopEditing } = useEventEditingContext();
  const editingOccurrence = useStore(store, schedulerOtherSelectors.editingOccurrence);
  const editingMode = useStore(store, schedulerOtherSelectors.editingMode);

  // Render only the editing surface here; the armed toolbar is rendered separately. Needs both an
  // edited occurrence and an anchor to position against.
  if (editingMode !== 'edit' || editingOccurrence == null || anchorRef.current == null) {
    return null;
  }

  return (
    <EventDialogContent
      open
      anchorRef={anchorRef}
      occurrence={editingOccurrence}
      onClose={stopEditing}
    />
  );
}

/**
 * Desktop editing surface: anchored, draggable dialog via `EventEditingProvider`, with the armed
 * action toolbar and the recurring scope confirmation rendered as independent top-level siblings.
 */
export function EventDialogProvider(props: EventDialogProviderProps) {
  const { children, optionalRenderers } = props;

  // The recurring scope confirmation renders itself: it reads its own open state from the store.
  const RecurringScopeDialogRenderer = optionalRenderers?.recurringScopeDialog;

  return (
    <EventEditingOptionalRenderersContext.Provider
      value={optionalRenderers ?? (EMPTY_OBJECT as EventEditingOptionalRenderers)}
    >
      <EventEditingProvider surface="dialog">
        {children}
        <AnchoredEventToolbarSurface />
        <EventDialogSurface />
        {RecurringScopeDialogRenderer && <RecurringScopeDialogRenderer />}
      </EventEditingProvider>
    </EventEditingOptionalRenderersContext.Provider>
  );
}
