import * as React from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { useEventDialogStyledContext } from './EventDialogStyledContext';

const EventDialogHeaderRoot = styled('header', {
  name: 'MuiEventDialog',
  slot: 'Header',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  padding: theme.spacing(3),
  cursor: 'move',
}));

interface EventDialogHeaderProps {
  onClose: () => void;
  dragHandlerRef?: React.RefObject<HTMLElement | null>;
  children?: React.ReactNode;
}

export default function EventDialogHeader(props: EventDialogHeaderProps) {
  const { children, onClose, dragHandlerRef } = props;
  const { classes, localeText } = useEventDialogStyledContext();

  return (
    <EventDialogHeaderRoot ref={dragHandlerRef} className={classes.eventDialogHeader}>
      {children}
      <IconButton
        className={classes.eventDialogCloseButton}
        aria-label={localeText.closeButtonAriaLabel}
        onClick={onClose}
      >
        <CloseRounded />
      </IconButton>
    </EventDialogHeaderRoot>
  );
}
