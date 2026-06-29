import * as React from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import { useEventEditingStyledContext } from '../event-editing';

const EventDialogHeaderRoot = styled('header', {
  name: 'MuiEventDialog',
  slot: 'Header',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  padding: theme.spacing(3),
  // Only the draggable desktop dialog shows the move affordance; the drawer reuses this header.
  '&[data-draggable]': {
    cursor: 'move',
  },
}));

interface EventDialogHeaderProps {
  onClose: () => void;
  /**
   * Renders an edit affordance that switches the summary to the form. Omitted for read-only events.
   */
  onEdit?: () => void;
  dragHandlerRef?: React.RefObject<HTMLElement | null>;
  /**
   * Whether the header acts as a drag handle; when `false` the move cursor is suppressed.
   * @default true
   */
  isDraggable?: boolean;
  children?: React.ReactNode;
}

export default function EventDialogHeader(props: EventDialogHeaderProps) {
  const { children, onClose, onEdit, dragHandlerRef, isDraggable = true } = props;
  const { classes, localeText } = useEventEditingStyledContext();

  return (
    <EventDialogHeaderRoot
      ref={dragHandlerRef}
      className={classes.eventDialogHeader}
      data-draggable={isDraggable || undefined}
    >
      {children}
      <div className={classes.eventDialogHeaderActions}>
        {onEdit && (
          <IconButton
            className={classes.eventDialogEditButton}
            aria-label={localeText.editEventButtonAriaLabel}
            onClick={onEdit}
          >
            <EditRounded />
          </IconButton>
        )}
        <IconButton
          className={classes.eventDialogCloseButton}
          aria-label={localeText.closeButtonAriaLabel}
          onClick={onClose}
        >
          <CloseRounded />
        </IconButton>
      </div>
    </EventDialogHeaderRoot>
  );
}
