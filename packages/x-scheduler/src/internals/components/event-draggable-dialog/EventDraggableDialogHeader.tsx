import * as React from 'react';
import { styled } from '@mui/material/styles';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { useEventDialogClasses } from './EventDialogClassesContext';

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

export default function EventDraggableDialogHeader({ children }: React.PropsWithChildren) {
  const classes = useEventDialogClasses();

  return (
    <EventDraggableDialogHeaderRoot className={classes.eventDialogHeader}>
      <EventDraggableDialogHeaderContent className={classes.eventDialogHeaderContent}>
        {children}
      </EventDraggableDialogHeaderContent>
      <CloseRounded fontSize="small" />
    </EventDraggableDialogHeaderRoot>
  );
}
