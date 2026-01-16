import * as React from 'react';
import { X } from 'lucide-react';
import { styled } from '@mui/material/styles';

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
  return (
    <EventDraggableDialogHeaderRoot>
      <EventDraggableDialogHeaderContent>{children}</EventDraggableDialogHeaderContent>
      <X size={18} strokeWidth={2} />
    </EventDraggableDialogHeaderRoot>
  );
}
