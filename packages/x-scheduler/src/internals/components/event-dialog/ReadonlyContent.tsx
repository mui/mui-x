import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
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
};

export default function ReadonlyContent(props: ReadonlyContentProps) {
  const { occurrence, onClose } = props;

  // Context hooks
  const { schedulerId, classes, localeText } = useEventEditingStyledContext();

  // With a mouse, the whole section moves the dialog. On touch, a long press on the details
  // selects their text, so only the header does.
  const isCoarsePointer = useMediaQuery('(pointer: coarse)', { noSsr: true });

  const content = (
    <React.Fragment>
      <EventDialogHeader onClose={onClose} isDraggable={isCoarsePointer}>
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
    </React.Fragment>
  );

  if (isCoarsePointer) {
    return <ReadonlyContentDragContainer>{content}</ReadonlyContentDragContainer>;
  }

  return <Draggable.Handle render={<ReadonlyContentDragContainer />}>{content}</Draggable.Handle>;
}
