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
  justifyContent: 'flex-end',
  gap: theme.spacing(1.5),
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,

  cursor: 'move',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface EventDraggableDialogHeaderProps {
  onClose: () => void;
  handleRef?: React.RefObject<HTMLElement | null>;
}

export default function EventDraggableDialogHeader(props: EventDraggableDialogHeaderProps) {
  const { onClose, handleRef } = props;
  const classes = useEventDialogClasses();
  const translations = useTranslations();

  return (
    <EventDraggableDialogHeaderRoot
      ref={handleRef as React.RefObject<HTMLElement>}
      className={classes.eventDialogHeader}
    >
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
