'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSharedComponentsStyledContext } from '../SharedComponentsStyledContext';
import { getUserFacingErrorMessage } from '../../utils/user-facing-error';

export interface ErrorContainerProps {
  className?: string;
}

const ErrorContainerRoot = styled('div', {
  name: 'MuiEventErrorContainer',
  slot: 'Root',
})({
  position: 'absolute',
  zIndex: 1300,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 16,
  bottom: 16,
  insetInlineEnd: 16,
});

const ErrorAlert = styled(Alert, {
  name: 'MuiEventErrorContainer',
  slot: 'Alert',
})({
  maxWidth: 400,
});

const ErrorMessage = styled(Typography, {
  name: 'MuiEventErrorContainer',
  slot: 'Message',
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
  const store = useSchedulerStoreContext();
  const { classes, localeText } = useSharedComponentsStyledContext();
  const errors = useStore(store, schedulerOtherSelectors.errors);

  return (
    <ErrorContainerRoot className={clsx(classes.errorContainer, className)}>
      {errors.map(({ key, ...error }) => (
        <ErrorAlert
          className={classes.errorAlert}
          severity="error"
          key={key}
          onClose={() => store.dismissError(key)}
        >
          <ErrorMessage className={classes.errorMessage} variant="body2">
            {getUserFacingErrorMessage(localeText, error)}
          </ErrorMessage>
        </ErrorAlert>
      ))}
    </ErrorContainerRoot>
  );
}
