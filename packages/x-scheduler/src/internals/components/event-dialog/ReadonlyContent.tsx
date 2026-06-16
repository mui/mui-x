import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import EventDialogHeader from './EventDialogHeader';
import { useEventEditingStyledContext, ReadonlyEventDetails } from '../event-editing';

const ReadonlyContentDragContainer = styled('section', {
  name: 'MuiEventDialog',
  slot: 'ReadonlyContentDragContainer',
})({
  cursor: 'move',
});

const EventDialogActions = styled('div', {
  name: 'MuiEventDialog',
  slot: 'Actions',
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(3),
}));

const EventDialogTitle = styled(Typography, {
  name: 'MuiEventDialog',
  slot: 'Title',
})({
  margin: 0,
  color: 'var(--event-on-surface-subtle-primary)',
});

type ReadonlyContentProps = {
  occurrence: SchedulerRenderableEventOccurrence;
  onClose: () => void;
  dragHandlerRef: React.RefObject<HTMLElement | null>;
};

export default function ReadonlyContent(props: ReadonlyContentProps) {
  const { occurrence, onClose, dragHandlerRef } = props;

  // Context hooks
  const { schedulerId, classes, localeText } = useEventEditingStyledContext();

  return (
    <ReadonlyContentDragContainer ref={dragHandlerRef}>
      <EventDialogHeader onClose={onClose}>
        <EventDialogTitle
          variant="h6"
          id={`${schedulerId}-event-dialog-title`}
          className={classes.eventDialogTitle}
        >
          {occurrence.title}
        </EventDialogTitle>
      </EventDialogHeader>
      <ReadonlyEventDetails occurrence={occurrence} />
      <EventDialogActions className={classes.eventDialogActions}>
        <Button
          className={classes.eventDialogCloseAction}
          variant="contained"
          type="button"
          onClick={onClose}
        >
          {localeText.closeButtonLabel}
        </Button>
      </EventDialogActions>
    </ReadonlyContentDragContainer>
  );
}
