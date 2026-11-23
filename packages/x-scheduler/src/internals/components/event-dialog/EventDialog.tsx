'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import type { PaperProps } from '@mui/material/Paper';
import Paper from '@mui/material/Paper';
import type { DialogProps } from '@mui/material/Dialog';
import Dialog from '@mui/material/Dialog';
import { styled, useThemeProps } from '@mui/material/styles';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import type { EventDialogProps, EventDialogProviderProps } from './EventDialog.types';
import type { EventEditingOptionalRenderers } from '../event-editing';
import {
  EventEditingProvider,
  EventEditingOptionalRenderersContext,
  useEventEditingContext,
  useEventEditingStyledContext,
  FormContent,
} from '../event-editing';
import { EventContextMenuProvider } from '../event-context-menu';
import { useDraggableAnchoredPaper } from '../../hooks/useDraggableAnchoredPaper';
import { dialogRootBaseStyles, getDialogPaperBaseStyles } from '../../constants/dialogStyles';
import { AnchoredEventToolbar } from '../event-toolbar';
import {
  DeleteConfirmationDialog,
  DeleteConfirmationDialogHostContext,
} from '../delete-confirmation-dialog';
import ReadonlyContent from './ReadonlyContent';

const EventDialogRoot = styled(Dialog, {
  name: 'MuiEventDialog',
  slot: 'Root',
})(dialogRootBaseStyles);

const EventDialogPaper = styled(Paper, {
  name: 'MuiEventDialog',
  slot: 'Paper',
})(({ theme }) => getDialogPaperBaseStyles(theme));

interface EventDialogDraggablePaperProps extends PaperProps {
  anchor: HTMLElement | null;
  dragHandlerRef: React.RefObject<HTMLElement | null>;
}

/**
 * The draggable paper of the event dialog, positioned next to `anchor`.
 * Pass `anchor` and `dragHandlerRef` through `slotProps.paper`.
 */
const EventDialogDraggablePaper = function EventDialogDraggablePaper(
  props: EventDialogDraggablePaperProps,
) {
  const { anchor, dragHandlerRef, className, ...other } = props;
  const paperRef = useDraggableAnchoredPaper(anchor, dragHandlerRef);

  return <EventDialogPaper {...other} ref={paperRef} className={className} />;
} as any as DialogProps['PaperComponent'];

export const EventDialogContent = React.forwardRef(function EventDialogContent(
  inProps: EventDialogProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  // eslint-disable-next-line mui/material-ui-name-matches-component-name
  const props = useThemeProps({ props: inProps, name: 'MuiEventDialog' });
  const { style, anchor, occurrence, onClose, open, ...other } = props;
  // Context hooks
  const store = useSchedulerStoreContext();
  const { schedulerId, classes } = useEventEditingStyledContext();

  // Selector hooks
  const isEventReadOnly = useStore(store, schedulerEventSelectors.isReadOnly, occurrence.id);

  // Ref hooks
  const dragHandlerRef = React.useRef<HTMLElement>(null);

  // Read-only events have no editing form; editable events open the form fresh on each occurrence
  // (keyed) so it initializes from the current times.
  const content = isEventReadOnly ? (
    <ReadonlyContent occurrence={occurrence} onClose={onClose} dragHandlerRef={dragHandlerRef} />
  ) : (
    <FormContent
      // Remount on a retarget so the form re-seeds instead of keeping the old draft.
      // Keyed by `key`, not `id`: occurrences of one recurring event share the id.
      key={occurrence.key}
      occurrence={occurrence}
      onClose={onClose}
      dragHandlerRef={dragHandlerRef}
      anchor={anchor}
    />
  );

  return (
    <EventDialogRoot
      ref={forwardedRef}
      open={open}
      onClose={onClose}
      PaperComponent={EventDialogDraggablePaper}
      aria-labelledby={`${schedulerId}-event-dialog-title`}
      aria-modal="false"
      className={classes.eventDialog}
      slotProps={{
        paper: {
          className: classes.eventDialogPaper,
          anchor,
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
 * Mounts the armed-event toolbar next to the event during the `'armed'` stage, as a top-level sibling
 * of the dialog. Its Edit switches the store to `'edit'`, swapping in the dialog below.
 */
function AnchoredEventToolbarSurface() {
  const store = useSchedulerStoreContext();
  const { anchor } = useEventEditingContext();
  const editingOccurrence = useStore(store, schedulerOtherSelectors.editingOccurrence);
  const editingMode = useStore(store, schedulerOtherSelectors.editingMode);

  // Gate on the reactive `anchor` so a re-anchor (e.g. a recurring scope change) re-positions.
  if (editingMode !== 'armed' || editingOccurrence == null || anchor == null) {
    return null;
  }

  return <AnchoredEventToolbar anchor={anchor} occurrence={editingOccurrence} />;
}

/**
 * Mounts the desktop dialog during the `'edit'` stage, anchored to the element editing started from,
 * or to another mounted trigger of the same occurrence once that one is gone.
 * Open state comes from the store; the anchor comes from the editing context.
 */
function EventDialogSurface() {
  const store = useSchedulerStoreContext();
  const { anchor, stopEditing } = useEventEditingContext();
  const editingOccurrence = useStore(store, schedulerOtherSelectors.editingOccurrence);
  const editingMode = useStore(store, schedulerOtherSelectors.editingMode);

  if (editingMode !== 'edit' || editingOccurrence == null || anchor == null) {
    return null;
  }

  return (
    <EventDialogContent open anchor={anchor} occurrence={editingOccurrence} onClose={stopEditing} />
  );
}

/**
 * Desktop editing surface: anchored, draggable dialog via `EventEditingProvider`, with the armed
 * action toolbar, the delete confirmation, and the recurring scope confirmation rendered as
 * independent top-level siblings.
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
        <DeleteConfirmationDialogHostContext.Provider value>
          <EventContextMenuProvider>{children}</EventContextMenuProvider>
        </DeleteConfirmationDialogHostContext.Provider>
        <AnchoredEventToolbarSurface />
        <EventDialogSurface />
        <DeleteConfirmationDialog />
        {RecurringScopeDialogRenderer && <RecurringScopeDialogRenderer />}
      </EventEditingProvider>
    </EventEditingOptionalRenderersContext.Provider>
  );
}
