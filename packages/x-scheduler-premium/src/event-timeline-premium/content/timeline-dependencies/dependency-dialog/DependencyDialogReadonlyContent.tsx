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
import {
  EventDialogForm,
  EventDialogFormActions,
  EventDialogHeader,
  useEventEditingStyledContext,
} from '@mui/x-scheduler/internals';
import {
  DEPENDENCY_DIALOG_TEXT,
  DEPENDENCY_TYPE_LABELS,
  formatLag,
  getAllDayLagNote,
} from './dependencyDialogUtils';
import {
  DependencyDialogBody,
  DependencyDialogDetails,
  DependencyDialogEndpoints,
} from './DependencyDialogDetails';
import type { DependencyDialogViewProps } from './DependencyDialogDetails';

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
  const { classes, localeText } = useEventEditingStyledContext();
  const lag = getDependencyLag(dependency);
  const isTargetAllDay = useStore(
    store,
    (state) => schedulerEventSelectors.processedEvent(state, dependency.target)?.allDay ?? false,
  );
  const allDayLagNote = getAllDayLagNote(
    lag,
    getEffectiveDependencyLag(dependency, isTargetAllDay),
  );

  return (
    <EventDialogForm as="section" className={classes.eventDialogForm}>
      <EventDialogHeader onClose={onClose} dragHandlerRef={dragHandlerRef}>
        <Typography variant="h6" id={titleId} className={classes.eventDialogTitle}>
          {DEPENDENCY_DIALOG_TEXT.detailsTitle}
        </Typography>
      </EventDialogHeader>
      <DependencyDialogBody>
        <DependencyDialogDetails>
          <DependencyDialogEndpoints {...props} />
          <Typography component="dt">{DEPENDENCY_DIALOG_TEXT.typeLabel}</Typography>
          <Typography component="dd">{DEPENDENCY_TYPE_LABELS[dependency.type]}</Typography>
          <Typography component="dt">{DEPENDENCY_DIALOG_TEXT.lagLabel}</Typography>
          <Typography component="dd">
            {lag === null ? DEPENDENCY_DIALOG_TEXT.noLag : formatLag(lag)}
            {allDayLagNote !== null && (
              <DependencyDialogLagNote>{allDayLagNote}</DependencyDialogLagNote>
            )}
          </Typography>
        </DependencyDialogDetails>
      </DependencyDialogBody>
      <Divider className={classes.eventDialogFormDivider} />
      <EventDialogFormActions className={classes.eventDialogFormActions}>
        <Button variant="contained" type="button" onClick={onClose}>
          {localeText.closeButtonLabel}
        </Button>
      </EventDialogFormActions>
    </EventDialogForm>
  );
}
