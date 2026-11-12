'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useStore } from '@base-ui/utils/store';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import {
  getDependencyLag,
  getEffectiveDependencyLag,
} from '@mui/x-scheduler-internals-premium/internals';
import { getAllDayLagNote, getDependencyTypeLabel } from './dependencyDialogUtils';
import {
  DependencyDialogBody,
  DependencyDialogDetails,
  DependencyDialogEndpoints,
} from './DependencyDialogDetails';
import type { DependencyDialogViewProps } from './DependencyDialogDetails';
import {
  DependencyDialogActions,
  DependencyDialogForm,
  DependencyDialogHeader,
} from './DependencyDialogLayout';
import { useEventTimelinePremiumStyledContext } from '../../../EventTimelinePremiumStyledContext';

const DependencyDialogLagNote = styled('span', {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogLagNote',
})(({ theme }) => ({
  display: 'block',
  ...theme.typography.body2,
  color: (theme.vars || theme).palette.text.secondary,
}));

export function DependencyDialogReadonlyContent(props: DependencyDialogViewProps) {
  const { dependency, titleId, dragHandlerRef, onClose } = props;
  const store = useEventTimelinePremiumStoreContext();
  const { classes, localeText } = useEventTimelinePremiumStyledContext();
  const lag = getDependencyLag(dependency);
  const isTargetAllDay = useStore(
    store,
    (state) => schedulerEventSelectors.processedEvent(state, dependency.target)?.allDay ?? false,
  );
  const allDayLagNote = getAllDayLagNote(
    localeText,
    lag,
    getEffectiveDependencyLag(dependency, isTargetAllDay),
  );

  return (
    <DependencyDialogForm as="section" className={classes.dependencyDialogForm}>
      <DependencyDialogHeader onClose={onClose} dragHandlerRef={dragHandlerRef}>
        <Typography variant="h6" id={titleId} className={classes.dependencyDialogTitle}>
          {localeText.dependencyDetailsTitle}
        </Typography>
      </DependencyDialogHeader>
      <DependencyDialogBody className={classes.dependencyDialogBody}>
        <DependencyDialogDetails className={classes.dependencyDialogDetails}>
          <DependencyDialogEndpoints {...props} />
          <Typography component="dt">{localeText.dependencyTypeLabel}</Typography>
          <Typography component="dd">
            {getDependencyTypeLabel(localeText, dependency.type)}
          </Typography>
          <Typography component="dt">{localeText.dependencyLagLabel}</Typography>
          <Typography component="dd">
            {lag === null
              ? localeText.dependencyNoLag
              : localeText.dependencyLag(lag.amount, lag.unit)}
            {allDayLagNote !== null && (
              <DependencyDialogLagNote className={classes.dependencyDialogLagNote}>
                {allDayLagNote}
              </DependencyDialogLagNote>
            )}
          </Typography>
        </DependencyDialogDetails>
      </DependencyDialogBody>
      <Divider className={classes.dependencyDialogDivider} />
      <DependencyDialogActions className={classes.dependencyDialogActions}>
        <Button variant="contained" type="button" onClick={onClose}>
          {localeText.closeButtonLabel}
        </Button>
      </DependencyDialogActions>
    </DependencyDialogForm>
  );
}
