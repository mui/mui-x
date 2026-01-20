import * as React from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { Popover } from '@base-ui/react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { SchedulerEventOccurrence } from '@mui/x-scheduler-headless/models';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-day-grid-position';
import { MoreEventsPopoverProps, MoreEventsPopoverProviderProps } from './MoreEventsPopover.types';
import { useTranslations } from '../../utils/TranslationsContext';
import { EventItem } from '../event/event-item/EventItem';
import { createPopover } from '../create-popover';
import { ArrowSvg } from './arrow/ArrowSvg';
import { isOccurrenceAllDayOrMultipleDay } from '../../utils/event-utils';
import { formatWeekDayMonthAndDayOfMonth } from '../../utils/date-utils';

const MoreEventsPopoverPositioner = styled(Popover.Positioner)(({ theme }) => ({
  maxWidth: 300,
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  zIndex: theme.zIndex.modal,
  boxShadow: theme.shadows[4],
}));

const MoreEventsPopoverHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const MoreEventsPopoverTitle = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.primary,
  lineHeight: 1.5,
  margin: 0,
}));

const MoreEventsPopoverBody = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

interface MoreEventsData {
  occurrences: SchedulerEventOccurrence[];
  count: number;
  day: useEventOccurrencesWithDayGridPosition.DayData;
}

const MoreEventsPopover = createPopover<MoreEventsData>({
  contextName: 'MoreEventsPopoverContext',
});

export const MoreEventsPopoverContext = MoreEventsPopover.Context;
export const useMoreEventsPopoverContext = MoreEventsPopover.useContext;

export default function MoreEventsPopoverContent(props: MoreEventsPopoverProps) {
  const { anchor, container, occurrences, day } = props;

  // Context hooks
  const translations = useTranslations();
  const adapter = useAdapter();

  return (
    <Popover.Portal container={container}>
      <MoreEventsPopoverPositioner anchor={anchor} sideOffset={8}>
        <Popover.Popup>
          <Popover.Arrow>
            <ArrowSvg />
          </Popover.Arrow>
          <MoreEventsPopoverHeader
            id={`PopoverHeader-${day.key}`}
            aria-label={`${formatWeekDayMonthAndDayOfMonth(day.value, adapter)}`}
          >
            <Popover.Title
              render={
                <MoreEventsPopoverTitle>
                  {formatWeekDayMonthAndDayOfMonth(day.value, adapter)}
                </MoreEventsPopoverTitle>
              }
            />
            <Popover.Close
              render={
                <IconButton aria-label={translations.closeButtonAriaLabel} size="small">
                  <CloseRounded fontSize="small" />
                </IconButton>
              }
            />
          </MoreEventsPopoverHeader>
          <MoreEventsPopoverBody>
            {occurrences.map((occurrence) => (
              <EventItem
                variant={
                  isOccurrenceAllDayOrMultipleDay(occurrence, adapter) ? 'filled' : 'compact'
                }
                key={occurrence.key}
                occurrence={occurrence}
                date={day}
                ariaLabelledBy={`PopoverHeader-${day.key}`}
              />
            ))}
          </MoreEventsPopoverBody>
        </Popover.Popup>
      </MoreEventsPopoverPositioner>
    </Popover.Portal>
  );
}

export function MoreEventsPopoverProvider(props: MoreEventsPopoverProviderProps) {
  const { containerRef, children } = props;

  return (
    <MoreEventsPopover.Provider
      containerRef={containerRef}
      renderPopover={({ anchor, data, container, onClose }) => (
        <MoreEventsPopoverContent
          anchor={anchor}
          container={container}
          occurrences={data.occurrences}
          count={data.count}
          day={data.day}
          onClose={onClose}
        />
      )}
    >
      {children}
    </MoreEventsPopover.Provider>
  );
}

interface MoreEventsPopoverTriggerProps extends Omit<
  React.ComponentProps<typeof Popover.Trigger>,
  'onClick'
> {
  occurrences: SchedulerEventOccurrence[];
  day: useEventOccurrencesWithDayGridPosition.DayData;
}

export function MoreEventsPopoverTrigger(props: MoreEventsPopoverTriggerProps) {
  const { occurrences, day, ...other } = props;

  return (
    <MoreEventsPopover.Trigger
      nativeButton={true}
      data={{ occurrences, count: occurrences.length, day }}
      {...other}
    />
  );
}
