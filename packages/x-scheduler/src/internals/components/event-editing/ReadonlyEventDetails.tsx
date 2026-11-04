'use client';
import * as React from 'react';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import RepeatRoundedIcon from '@mui/icons-material/RepeatRounded';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type {
  SchedulerProcessedDate,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler-internals/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
  schedulerRecurringEventSelectors,
  schedulerResourceSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import {
  formatFullDate,
  getOccurrenceDataTimezone,
  getPrimaryResourceId,
  toPlainDate,
  toWallClockIsoString,
} from '@mui/x-scheduler-internals/internals';
import { useEventEditingStyledContext } from './EventEditingStyledContext';
import {
  getEventTimezone,
  getEventBoundTimestamp,
  getEventTimezonePlainDate,
  getRecurrenceLabel,
  getRecurrenceTimezoneName,
  hasProp,
} from '../event-dialog/utils';
import { useFormatTime } from '../../hooks/useFormatTime';
import { isOccurrenceMultiDay } from '../../utils/event-utils';
import type { PaletteName } from '../../utils/tokens';
import { getPaletteVariants } from '../../utils/tokens';

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
  alignItems: 'flex-start',
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
 * Read-only details of an occurrence (resource, date/time, recurrence, description). Shared by both
 * editing surfaces, each wrapping them with its own chrome.
 */
export function ReadonlyEventDetails(props: ReadonlyEventDetailsProps) {
  const { occurrence } = props;

  // Context hooks
  const { classes, localeText } = useEventEditingStyledContext();
  const store = useSchedulerStoreContext();

  // Selector hooks
  const color = useStore(store, schedulerEventSelectors.color, occurrence.id, undefined);
  const resource = useStore(
    store,
    schedulerResourceSelectors.processedResource,
    getPrimaryResourceId(occurrence.resource),
  );
  // The rule is read in the event's timezone, the one it is expressed in.
  const eventTimezone = getEventTimezone(occurrence);
  const startPlainDate = React.useMemo(
    () => getEventTimezonePlainDate(occurrence, getEventBoundTimestamp(occurrence, 'start')),
    [occurrence],
  );
  const defaultRecurrenceKey = useStore(
    store,
    schedulerRecurringEventSelectors.defaultPresetKey,
    getOccurrenceDataTimezone(occurrence)?.rrule,
    startPlainDate,
  );
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);
  const locale = useStore(store, schedulerOtherSelectors.dateLocale);

  // Feature hook
  const formatTime = useFormatTime();
  const { start, end, timezone: boundsTimezone } = occurrence.displayTimezone;
  const isMultiDay = isOccurrenceMultiDay(occurrence);
  const formatBound = (date: SchedulerProcessedDate) => {
    const fullDate = formatFullDate(locale, toPlainDate(date.timestamp, boundsTimezone));
    return occurrence.allDay ? fullDate : `${fullDate}, ${formatTime(date)}`;
  };
  const formatBoundDateTime = (bound: SchedulerProcessedDate) =>
    occurrence.allDay
      ? toPlainDate(bound.timestamp, boundsTimezone).toString()
      : toWallClockIsoString(bound.timestamp, boundsTimezone);
  const recurrenceTimezoneName = React.useMemo(
    () => getRecurrenceTimezoneName(locale, eventTimezone, displayTimezone),
    [locale, eventTimezone, displayTimezone],
  );
  const recurrenceLabel = React.useMemo(
    () => getRecurrenceLabel(locale, startPlainDate, defaultRecurrenceKey, localeText),
    [locale, startPlainDate, defaultRecurrenceKey, localeText],
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
        <Typography className={classes.eventDialogDateTimeLabel} variant="body2" component="p">
          <time dateTime={formatBoundDateTime(start)}>{formatBound(start)}</time>
          {(isMultiDay || !occurrence.allDay) && (
            <React.Fragment>
              {' - '}
              <time dateTime={formatBoundDateTime(end)}>
                {isMultiDay ? formatBound(end) : formatTime(end)}
              </time>
            </React.Fragment>
          )}
          {occurrence.allDay && `, ${localeText.allDayLabel}`}
        </Typography>
      </EventDialogDateTimeContainer>
      {defaultRecurrenceKey != null && (
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
            {recurrenceTimezoneName != null && (
              <span className={classes.eventDialogRecurrenceTimezoneLabel}>
                {' '}
                {localeText.recurrenceLabelTimezoneSuffix(recurrenceTimezoneName)}
              </span>
            )}
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
