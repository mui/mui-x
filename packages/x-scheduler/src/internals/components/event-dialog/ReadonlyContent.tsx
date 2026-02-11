import * as React from 'react';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-headless/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import {
  schedulerEventSelectors,
  schedulerRecurringEventSelectors,
  schedulerResourceSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import EventDialogHeader from './EventDialogHeader';
import { useTranslations } from '../../utils/TranslationsContext';
import { getRecurrenceLabel, hasProp } from './utils';
import { useFormatTime } from '../../hooks/useFormatTime';
import { getPaletteVariants, PaletteName } from '../../utils/tokens';
import { useEventDialogClasses } from './EventDialogClassesContext';

const ReadonlyContentRoot = styled('div', {
  name: 'MuiEventDialog',
  slot: 'ReadonlyContent',
})(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const EventDialogActions = styled('div', {
  name: 'MuiEventDialog',
  slot: 'Actions',
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
}));

const EventDialogDateTimeContainer = styled('div', {
  name: 'MuiEventDialog',
  slot: 'DateTimeContainer',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const EventDialogTitle = styled('p', {
  name: 'MuiEventDialog',
  slot: 'Title',
})(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.body1.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: 'var(--event-on-surface-subtle-primary)',
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
  gap: theme.spacing(0.5),
}));

const ResourceLegendColorDot = styled('span', {
  name: 'MuiEventDialog',
  slot: 'ResourceLegendColor',
})<{ palette?: PaletteName }>(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  flexShrink: 0,
  backgroundColor: 'var(--event-main)',
  variants: getPaletteVariants(theme),
}));

const EventDialogResourceTitle = styled('p', {
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

type ReadonlyContentProps = {
  occurrence: SchedulerRenderableEventOccurrence;
  onClose: () => void;
  dragHandlerRef: React.RefObject<HTMLElement | null>;
};

export default function ReadonlyContent(props: ReadonlyContentProps) {
  const { occurrence, onClose, dragHandlerRef } = props;

  // Context hooks
  const adapter = useAdapter();
  const translations = useTranslations();
  const store = useSchedulerStoreContext();
  const classes = useEventDialogClasses();

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

  // Feature hook
  const formatTime = useFormatTime();
  const recurrenceLabel = getRecurrenceLabel(
    adapter,
    occurrence.displayTimezone.start,
    defaultRecurrenceKey,
    translations,
  );

  return (
    <React.Fragment>
      <EventDialogHeader onClose={onClose} dragHandlerRef={dragHandlerRef}>
        <EventDialogTitle id="event-dialog-title" className={classes.eventDialogTitle}>
          {occurrence.title}
        </EventDialogTitle>

        <EventDialogResourceContainer className={classes.eventDialogResourceContainer}>
          <EventDialogResourceLegendContainer
            className={classes.eventDialogResourceLegendContainer}
          >
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
            {resource?.title || translations.noResourceAriaLabel}
          </EventDialogResourceTitle>
        </EventDialogResourceContainer>
      </EventDialogHeader>
      <ReadonlyContentRoot className={classes.eventDialogReadonlyContent}>
        <EventDialogDateTimeContainer className={classes.eventDialogDateTimeContainer}>
          <CalendarMonthRounded fontSize="small" />
          <Typography variant="body2" component="p" noWrap>
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
              <span> {translations.allDayLabel}</span>
            ) : (
              <time>
                <span>{formatTime(occurrence.displayTimezone.start.value)}</span>
                <span> - {formatTime(occurrence.displayTimezone.end.value)}</span>
              </time>
            )}
          </Typography>
        </EventDialogDateTimeContainer>
        <Typography variant="body2" color="text.secondary">
          {recurrenceLabel}
        </Typography>
        {hasProp(occurrence, 'description') && !!occurrence.description ? (
          <Typography variant="body2">{occurrence.description}</Typography>
        ) : null}
      </ReadonlyContentRoot>
      <EventDialogActions className={classes.eventDialogActions}>
        <Button variant="contained" type="button" onClick={onClose}>
          {translations.closeButtonLabel}
        </Button>
      </EventDialogActions>
    </React.Fragment>
  );
}
