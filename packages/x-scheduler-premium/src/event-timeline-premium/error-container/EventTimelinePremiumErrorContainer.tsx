'use client';
// TODO #22309: unify with ErrorContainer from `@mui/x-scheduler/internals`. Both variants are
// structurally identical now; the only differences left are the styled-component names
// and the styled-context hook.
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventTimelinePremiumStyledContext } from '../EventTimelinePremiumStyledContext';

export interface EventTimelinePremiumErrorContainerProps {
  className?: string;
}

const EventTimelinePremiumErrorContainerRoot = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'ErrorContainer',
})({
  position: 'absolute',
  zIndex: 1300,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 16,
  bottom: 16,
  right: 16,
});

const EventTimelinePremiumErrorAlert = styled(Alert, {
  name: 'MuiEventTimeline',
  slot: 'ErrorAlert',
})({
  maxWidth: 400,
});

const EventTimelinePremiumErrorMessage = styled(Typography, {
  name: 'MuiEventTimeline',
  slot: 'ErrorMessage',
})({
  wordBreak: 'break-word',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  overflowWrap: 'break-word',
});

export function EventTimelinePremiumErrorContainer(props: EventTimelinePremiumErrorContainerProps) {
  const { className } = props;
  const store = useEventTimelinePremiumStoreContext();
  const { classes } = useEventTimelinePremiumStyledContext();
  const errors = useStore(store, schedulerOtherSelectors.errors);

  return (
    <EventTimelinePremiumErrorContainerRoot className={clsx(classes.errorContainer, className)}>
      {errors.map(({ error, key }) => (
        <EventTimelinePremiumErrorAlert
          className={classes.errorAlert}
          severity="error"
          key={key}
          onClose={() => store.dismissError(key)}
        >
          <EventTimelinePremiumErrorMessage className={classes.errorMessage} variant="body2">
            {error.message}
          </EventTimelinePremiumErrorMessage>
        </EventTimelinePremiumErrorAlert>
      ))}
    </EventTimelinePremiumErrorContainerRoot>
  );
}
