import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { useEventEditingStyledContext } from '../event-editing';
import { getDialogHeaderBaseStyles } from '../../constants/dialogStyles';

const EventDialogHeaderRoot = styled('header', {
  name: 'MuiEventDialog',
  slot: 'Header',
})(({ theme }) => getDialogHeaderBaseStyles(theme));

interface EventDialogHeaderProps {
  onClose: () => void;
  /**
   * Whether the header acts as a drag handle; when `false` the move cursor is suppressed.
   * @default true
   */
  isDraggable?: boolean;
  children?: React.ReactNode;
}

export default function EventDialogHeader(props: EventDialogHeaderProps) {
  const { children, onClose, isDraggable = true } = props;
  const { classes, localeText } = useEventEditingStyledContext();

  const element = (
    <EventDialogHeaderRoot
      className={classes.eventDialogHeader}
      data-draggable={isDraggable || undefined}
    >
      {children}
      <div className={classes.eventDialogHeaderActions}>
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

  return isDraggable ? <Draggable.Handle render={element} /> : element;
}
