'use client';
// TODO: unify with ErrorContainer from `@mui/x-scheduler/internals` — the two only diverge by which styled and store contexts they read.
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-headless-premium/use-event-timeline-premium-store-context';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
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

export function EventTimelinePremiumErrorContainer(
  props: EventTimelinePremiumErrorContainerProps,
) {
  const { className } = props;
  const store = useEventTimelinePremiumStoreContext();
  const { classes } = useEventTimelinePremiumStyledContext();
  const errors = useStore(store, schedulerOtherSelectors.errors);

  const [dismissedErrors, setDismissedErrors] = React.useState<Set<Error>>(new Set());

  // Drop dismissed entries whose Error is no longer in `state.errors`, so the Set doesn't
  // grow forever and a re-thrown identical Error can re-display once cleared from state.
  React.useEffect(() => {
    setDismissedErrors((previous) => {
      const next = new Set<Error>();
      for (const error of previous) {
        if (errors.includes(error)) {
          next.add(error);
        }
      }
      return next.size === previous.size ? previous : next;
    });
  }, [errors]);

  const handleDismiss = (error: Error) => {
    setDismissedErrors(new Set(dismissedErrors).add(error));
  };

  return (
    <EventTimelinePremiumErrorContainerRoot
      className={clsx(classes.errorContainer, className)}
    >
      {errors
        .filter((error) => !dismissedErrors.has(error))
        .map((error, index) => (
          <EventTimelinePremiumErrorAlert
            className={classes.errorAlert}
            severity="error"
            key={index}
            onClose={() => handleDismiss(error)}
          >
            <EventTimelinePremiumErrorMessage
              className={classes.errorMessage}
              variant="body2"
            >
              {error instanceof Error ? error.message : String(error)}
            </EventTimelinePremiumErrorMessage>
          </EventTimelinePremiumErrorAlert>
        ))}
    </EventTimelinePremiumErrorContainerRoot>
  );
}
