'use client';
// TODO #22309: unify with EventTimelinePremiumErrorContainer. Both variants are
// structurally identical now; the only differences left are the styled-component names
// and the styled-context hook.
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventCalendarStyledContext } from '../../../event-calendar/EventCalendarStyledContext';

export interface ErrorContainerProps {
  className?: string;
}

const ErrorContainerRoot = styled('div', {
  name: 'MuiEventCalendar',
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

const ErrorAlert = styled(Alert, {
  name: 'MuiEventCalendar',
  slot: 'ErrorAlert',
})({
  maxWidth: 400,
});

const ErrorMessage = styled(Typography, {
  name: 'MuiEventCalendar',
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

export function ErrorContainer(props: ErrorContainerProps) {
  const { className } = props;
  const store = useEventCalendarStoreContext();
  const { classes } = useEventCalendarStyledContext();
  const errors = useStore(store, schedulerOtherSelectors.errors);

  return (
    <ErrorContainerRoot className={clsx(classes.errorContainer, className)}>
      {errors.map(({ error, key }) => (
        <ErrorAlert
          className={classes.errorAlert}
          severity="error"
          key={key}
          onClose={() => store.dismissError(key)}
        >
          <ErrorMessage className={classes.errorMessage} variant="body2">
            {error.message}
          </ErrorMessage>
        </ErrorAlert>
      ))}
    </ErrorContainerRoot>
  );
}
