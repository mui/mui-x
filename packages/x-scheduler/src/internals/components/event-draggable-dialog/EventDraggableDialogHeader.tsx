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
  backgroundColor: theme.palette.action.hover,
  padding: theme.spacing(3),
}));

const EventDraggableDialogHeaderContent = styled('div', {
  name: 'MuiEventDraggableDialog',
  slot: 'HeaderContent',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  flex: 1,
}));

interface EventDraggableDialogHeaderProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function EventDraggableDialogHeader(props: EventDraggableDialogHeaderProps) {
  const { children, onClose } = props;
  const classes = useEventDialogClasses();
  const translations = useTranslations();

  return (
    <EventDraggableDialogHeaderRoot className={classes.eventDialogHeader}>
      <EventDraggableDialogHeaderContent className={classes.eventDialogHeaderContent}>
        {children}
      </EventDraggableDialogHeaderContent>
      <IconButton
        className={classes.eventDialogCloseButton}
        size="small"
        aria-label={translations.closeButtonAriaLabel}
        onClick={onClose}
      >
        <CloseRounded fontSize="small" />
      </IconButton>
    </EventDraggableDialogHeaderRoot>
  );
}
