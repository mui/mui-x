'use client';
import * as React from 'react';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import RepeatRoundedIcon from '@mui/icons-material/RepeatRounded';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
  schedulerRecurringEventSelectors,
  schedulerResourceSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import { useEventEditingStyledContext } from './EventEditingStyledContext';
import { getRecurrenceLabel, hasProp } from '../event-dialog/utils';
import { useFormatTime } from '../../hooks/useFormatTime';
import { getPaletteVariants, PaletteName } from '../../utils/tokens';

const ReadonlyDetailsRoot = styled('div', {
  name: 'MuiEventDialog',
  slot: 'ReadonlyContent',
})(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(0, 3),
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const RecurrenceLabelContainer = styled('div', {
  name: 'MuiEventDialog',
  slot: 'RecurrenceLabelContainer',
})(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

const EventDialogDateTimeContainer = styled('div', {
  name: 'MuiEventDialog',
  slot: 'DateTimeContainer',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const EventDialogResourceContainer = styled('div', {
  name: 'MuiEventDialog',
  slot: 'ResourceContainer',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const EventDialogResourceLegendContainer = styled('div', {
  name: 'MuiEventDialog',
  slot: 'ResourceLegendContainer',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const ResourceLegendColorDot = styled('span', {
  name: 'MuiEventDialog',
  slot: 'ResourceLegendColor',
})<{ palette?: PaletteName }>(({ theme }) => ({
  width: 14,
  height: 14,
  margin: theme.spacing(0, 0.2),
  borderRadius: 2,
  flexShrink: 0,
  backgroundColor: 'var(--event-main)',
  variants: getPaletteVariants(theme),
}));

const EventDialogResourceTitle = styled(Typography, {
  name: 'MuiEventDialog',
  slot: 'ResourceTitle',
})(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.body2.fontSize,
  color: 'var(--event-on-surface-subtle-secondary)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

interface ReadonlyEventDetailsProps {
  occurrence: SchedulerRenderableEventOccurrence;
}

/**
 * Read-only details of an event occurrence (resource, date/time, recurrence and description).
 * Surface-agnostic and shared by both editing surfaces, each of which wraps these details with its
 * own chrome (heading, close affordances).
 */
export function ReadonlyEventDetails(props: ReadonlyEventDetailsProps) {
  const { occurrence } = props;

  // Context hooks
  const adapter = useAdapterContext();
  const { classes, localeText } = useEventEditingStyledContext();
  const store = useSchedulerStoreContext();

  // Selector hooks
  const color = useStore(store, schedulerEventSelectors.color, occurrence.id);
  const resource = useStore(
    store,
    schedulerResourceSelectors.processedResource,
    occurrence.resource,
  );
  const defaultRecurrenceKey = useStore(
    store,
    schedulerRecurringEventSelectors.defaultPresetKey,
    occurrence.displayTimezone.rrule,
    occurrence.displayTimezone.start,
  );
  const showRecurrence = useStore(store, schedulerOtherSelectors.areRecurringEventsAvailable);

  // Feature hook
  const formatTime = useFormatTime();
  const recurrenceLabel = getRecurrenceLabel(
    adapter,
    occurrence.displayTimezone.start,
    defaultRecurrenceKey,
    localeText,
  );

  return (
    <ReadonlyDetailsRoot className={classes.eventDialogReadonlyContent}>
      <EventDialogResourceContainer className={classes.eventDialogResourceContainer}>
        <EventDialogResourceLegendContainer className={classes.eventDialogResourceLegendContainer}>
          {resource?.eventColor && resource.eventColor !== color && (
            <ResourceLegendColorDot
              className={classes.eventDialogResourceLegendColor}
              data-palette={resource.eventColor}
            />
          )}

          <ResourceLegendColorDot
            className={classes.eventDialogResourceLegendColor}
            data-palette={color}
          />
        </EventDialogResourceLegendContainer>
        <EventDialogResourceTitle className={classes.eventDialogResourceTitle}>
          {resource?.title || localeText.noResourceAriaLabel}
        </EventDialogResourceTitle>
      </EventDialogResourceContainer>
      <EventDialogDateTimeContainer className={classes.eventDialogDateTimeContainer}>
        <CalendarMonthRounded className={classes.eventDialogDateTimeIcon} fontSize="small" />
        <Typography
          className={classes.eventDialogDateTimeLabel}
          variant="body2"
          component="p"
          noWrap
        >
          <time
            dateTime={adapter.format(
              occurrence.displayTimezone.start.value,
              'localizedNumericDate',
            )}
          >
            <span>
              {adapter.format(
                occurrence.displayTimezone.start.value,
                'localizedDateWithFullMonthAndWeekDay',
              )}
              ,{' '}
            </span>
          </time>
          {occurrence.allDay ? (
            <span> {localeText.allDayLabel}</span>
          ) : (
            <time>
              <span>{formatTime(occurrence.displayTimezone.start.value)}</span>
              <span> - {formatTime(occurrence.displayTimezone.end.value)}</span>
            </time>
          )}
        </Typography>
      </EventDialogDateTimeContainer>
      {showRecurrence && defaultRecurrenceKey != null && (
        <RecurrenceLabelContainer className={classes.eventDialogRecurrenceLabelContainer}>
          <RepeatRoundedIcon className={classes.eventDialogRecurrenceIcon} fontSize="small" />
          <Typography
            className={classes.eventDialogRecurrenceLabel}
            variant="body2"
            component="em"
            sx={{
              color: 'text.secondary',
            }}
          >
            {recurrenceLabel}
          </Typography>
        </RecurrenceLabelContainer>
      )}
      {hasProp(occurrence, 'description') && !!occurrence.description ? (
        <Typography className={classes.eventDialogDescriptionLabel} variant="body2">
          {occurrence.description}
        </Typography>
      ) : null}
    </ReadonlyDetailsRoot>
  );
}
