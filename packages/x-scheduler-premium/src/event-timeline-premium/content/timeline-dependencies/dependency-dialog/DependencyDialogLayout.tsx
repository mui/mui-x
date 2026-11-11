'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { styled } from '@mui/material/styles';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import {
  dialogFormBaseStyles,
  getDialogFormActionsBaseStyles,
  getDialogHeaderBaseStyles,
} from '@mui/x-scheduler/internals';
import { useEventTimelinePremiumStyledContext } from '../../../EventTimelinePremiumStyledContext';

const DependencyDialogHeaderRoot = styled('header', {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogHeader',
})(({ theme }) => getDialogHeaderBaseStyles(theme));

export const DependencyDialogForm = styled('form', {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogForm',
})(dialogFormBaseStyles);

export const DependencyDialogActions = styled(DialogActions, {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogActions',
})(({ theme }) => getDialogFormActionsBaseStyles(theme));

/**
 * The header of the dependency dialog: its title, the close button, and the handle to drag it.
 */
export function DependencyDialogHeader(props: { onClose: () => void; children: React.ReactNode }) {
  const { onClose, children } = props;
  const { classes, localeText } = useEventTimelinePremiumStyledContext();

  return (
    <Draggable.Handle
      render={
        <DependencyDialogHeaderRoot className={classes.dependencyDialogHeader} data-draggable="" />
      }
    >
      {children}
      <IconButton
        className={classes.dependencyDialogCloseButton}
        aria-label={localeText.closeButtonAriaLabel}
        onClick={onClose}
      >
        <CloseRounded />
      </IconButton>
    </Draggable.Handle>
  );
}
