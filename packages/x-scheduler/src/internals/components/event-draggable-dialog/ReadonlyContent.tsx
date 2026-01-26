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
import EventDraggableDialogHeader from './EventDraggableDialogHeader';
import { useTranslations } from '../../utils/TranslationsContext';
import { getRecurrenceLabel, hasProp } from './utils';
import { useFormatTime } from '../../hooks/useFormatTime';
import { schedulerPaletteStyles } from '../../utils/tokens';

const ReadonlyContentRoot = styled('div', {
  name: 'MuiEventDraggableDialog',
  slot: 'ReadonlyContent',
})(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const EventDraggableDialogActions = styled('div', {
  name: 'MuiEventDraggableDialog',
  slot: 'Actions',
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
}));

const EventDraggableDialogDateTimeContainer = styled('div', {
  name: 'MuiEventDraggableDialog',
  slot: 'DateTimeContainer',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const EventDraggableDialogTitle = styled('p', {
  name: 'MuiEventDraggableDialog',
  slot: 'Title',
})(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.body1.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: 'var(--event-color-12)',
}));

const EventDraggableDialogResourceContainer = styled('div', {
  name: 'MuiEventDraggableDialog',
  slot: 'ResourceContainer',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const EventDraggableDialogResourceLegendContainer = styled('div', {
  name: 'MuiEventDraggableDialog',
  slot: 'ResourceLegendContainer',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const ResourceLegendColorDot = styled('span', {
  name: 'MuiEventDraggableDialog',
  slot: 'ResourceLegendColor',
})({
  width: 8,
  height: 8,
  borderRadius: '50%',
  flexShrink: 0,
  backgroundColor: 'var(--event-color-9)',
  ...schedulerPaletteStyles,
});

const EventDraggableDialogResourceTitle = styled('p', {
  name: 'MuiEventDraggableDialog',
  slot: 'ResourceTitle',
})(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.body2.fontSize,
  color: 'var(--event-color-11)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

type ReadonlyContentProps = {
  occurrence: SchedulerRenderableEventOccurrence;
  onClose: () => void;
};

export default function ReadonlyContent(props: ReadonlyContentProps) {
  const { occurrence, onClose } = props;

  // Context hooks
  const adapter = useAdapter();
  const translations = useTranslations();
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
      <EventDraggableDialogHeader>
        <EventDraggableDialogTitle>{occurrence.title}</EventDraggableDialogTitle>

        <EventDraggableDialogResourceContainer>
          <EventDraggableDialogResourceLegendContainer>
            {resource?.eventColor && resource.eventColor !== color && (
              <ResourceLegendColorDot
                className="ResourceLegendColor"
                data-palette={resource.eventColor}
              />
            )}

            <ResourceLegendColorDot className="ResourceLegendColor" data-palette={color} />
          </EventDraggableDialogResourceLegendContainer>
          <EventDraggableDialogResourceTitle>
            {resource?.title || translations.noResourceAriaLabel}
          </EventDraggableDialogResourceTitle>
        </EventDraggableDialogResourceContainer>
      </EventDraggableDialogHeader>
      <ReadonlyContentRoot>
        <EventDraggableDialogDateTimeContainer>
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
        </EventDraggableDialogDateTimeContainer>
        <Typography variant="body2" color="text.secondary">
          {recurrenceLabel}
        </Typography>
        {hasProp(occurrence, 'description') && !!occurrence.description ? (
          <Typography variant="body2">{occurrence.description}</Typography>
        ) : null}
      </ReadonlyContentRoot>
      <EventDraggableDialogActions>
        <Button variant="contained" type="button" onClick={onClose}>
          {translations.closeButtonLabel}
        </Button>
      </EventDraggableDialogActions>
    </React.Fragment>
  );
}
