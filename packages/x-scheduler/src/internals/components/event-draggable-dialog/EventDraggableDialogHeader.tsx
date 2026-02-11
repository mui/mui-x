import * as React from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { useEventDialogClasses } from './EventDialogClassesContext';
import { useTranslations } from '../../utils/TranslationsContext';

const EventDraggableDialogHeaderRoot = styled('header', {
  name: 'MuiEventDraggableDialog',
  slot: 'Header',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  padding: theme.spacing(3),
  cursor: 'move',
}));

interface EventDraggableDialogHeaderProps {
  onClose: () => void;
  dragHandlerRef?: React.RefObject<HTMLElement | null>;
  children?: React.ReactNode;
}

export default function EventDraggableDialogHeader(props: EventDraggableDialogHeaderProps) {
  const { children, onClose, dragHandlerRef } = props;
  const classes = useEventDialogClasses();
  const translations = useTranslations();

  return (
    <EventDraggableDialogHeaderRoot ref={dragHandlerRef} className={classes.eventDialogHeader}>
      {children}
      <IconButton
        className={classes.eventDialogCloseButton}
        aria-label={translations.closeButtonAriaLabel}
        onClick={onClose}
      >
        <CloseRounded />
      </IconButton>
    </EventDraggableDialogHeaderRoot>
  );
}
