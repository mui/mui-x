import * as React from 'react';
import { Calendar } from 'lucide-react';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SchedulerEventOccurrence } from '@mui/x-scheduler-headless/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import {
  schedulerEventSelectors,
  schedulerRecurringEventSelectors,
  schedulerResourceSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import EventPopoverHeader from './EventPopoverHeader';
import { useTranslations } from '../../utils/TranslationsContext';
import { getRecurrenceLabel } from './utils';
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

const EventPopoverActions = styled('div', {
  name: 'MuiEventDraggableDialog',
  slot: 'Actions',
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
}));

const EventPopoverDateTimeContainer = styled('div', {
  name: 'MuiEventDraggableDialog',
  slot: 'DateTimeContainer',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const EventPopoverTitle = styled('p', {
  name: 'MuiEventDraggableDialog',
  slot: 'Title',
})(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.body1.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: 'var(--event-color-12)',
}));

const EventPopoverResourceContainer = styled('div', {
  name: 'MuiEventDraggableDialog',
  slot: 'ResourceContainer',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const EventPopoverResourceLegendContainer = styled('div', {
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

const EventPopoverResourceTitle = styled('p', {
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
  occurrence: SchedulerEventOccurrence;
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
      <EventPopoverHeader>
        <EventPopoverTitle>{occurrence.title}</EventPopoverTitle>

        <EventPopoverResourceContainer>
          <EventPopoverResourceLegendContainer>
            {resource?.eventColor && resource.eventColor !== color && (
              <ResourceLegendColorDot
                className="ResourceLegendColor"
                data-palette={resource.eventColor}
              />
            )}

            <ResourceLegendColorDot className="ResourceLegendColor" data-palette={color} />
          </EventPopoverResourceLegendContainer>
          <EventPopoverResourceTitle>
            {resource?.title || translations.noResourceAriaLabel}
          </EventPopoverResourceTitle>
        </EventPopoverResourceContainer>
      </EventPopoverHeader>
      <ReadonlyContentRoot>
        <EventPopoverDateTimeContainer>
          <Calendar size={16} strokeWidth={1.5} />
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
        </EventPopoverDateTimeContainer>
        <Typography variant="body2" color="text.secondary">
          {recurrenceLabel}
        </Typography>
        <Typography variant="body2">{occurrence.description}</Typography>
      </ReadonlyContentRoot>
      <EventPopoverActions>
        <Button variant="contained" type="button" onClick={onClose}>
          {translations.closeButtonLabel}
        </Button>
      </EventPopoverActions>
    </React.Fragment>
  );
}
