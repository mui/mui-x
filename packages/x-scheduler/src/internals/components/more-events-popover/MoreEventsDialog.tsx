import * as React from 'react';
import { X } from 'lucide-react';
import { Dialog } from '@base-ui/react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { SchedulerEventOccurrence } from '@mui/x-scheduler-headless/models';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-day-grid-position';
import { MoreEventsDialogProps, MoreEventsDialogProviderProps } from './MoreEventsDialog.types';
import { useTranslations } from '../../utils/TranslationsContext';
import { EventItem } from '../event/event-item/EventItem';
import { ArrowSvg } from './arrow/ArrowSvg';
import { isOccurrenceAllDayOrMultipleDay } from '../../utils/event-utils';
import { formatWeekDayMonthAndDayOfMonth } from '../../utils/date-utils';
import { createDialog } from '../create-modal';

const MoreEventsDialogHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const MoreEventsDialogTitle = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.primary,
  lineHeight: 1.5,
  margin: 0,
}));

const MoreEventsDialogBody = styled('div')(({ theme }) => ({
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

const MoreEventsDialog = createDialog<MoreEventsData>({
  contextName: 'MoreEventsDialogContext',
});

export const MoreEventsDialogContext = MoreEventsDialog.Context;
export const useMoreEventsDialogContext = MoreEventsDialog.useContext;

export default function MoreEventsDialogContent(props: MoreEventsDialogProps) {
  const { anchor, container, occurrences, day } = props;

  // Context hooks
  const translations = useTranslations();
  const adapter = useAdapter();

  return (
    <Dialog.Portal container={container}>
      <MoreEventsDialogPositioner anchor={anchor} sideOffset={8}>
        <Dialog.Popup>
          <Dialog.Arrow>
            <ArrowSvg />
          </Dialog.Arrow>
          <MoreEventsDialogHeader
            id={`DialogHeader-${day.key}`}
            aria-label={`${formatWeekDayMonthAndDayOfMonth(day.value, adapter)}`}
          >
            <Dialog.Title
              render={
                <MoreEventsDialogTitle>
                  {formatWeekDayMonthAndDayOfMonth(day.value, adapter)}
                </MoreEventsDialogTitle>
              }
            />
            <Dialog.Close
              render={
                <IconButton aria-label={translations.closeButtonAriaLabel} size="small">
                  <X size={16} strokeWidth={1.5} />
                </IconButton>
              }
            />
          </MoreEventsDialogHeader>
          <MoreEventsDialogBody>
            {occurrences.map((occurrence) => (
              <EventItem
                variant={
                  isOccurrenceAllDayOrMultipleDay(occurrence, adapter) ? 'filled' : 'compact'
                }
                key={occurrence.key}
                occurrence={occurrence}
                date={day}
                ariaLabelledBy={`DialogHeader-${day.key}`}
              />
            ))}
          </MoreEventsDialogBody>
        </Dialog.Popup>
      </MoreEventsDialogPositioner>
    </Dialog.Portal>
  );
}

export function MoreEventsDialogProvider(props: MoreEventsDialogProviderProps) {
  const { containerRef, children } = props;

  return (
    <MoreEventsDialog.Provider
      containerRef={containerRef}
      renderDialog={({ anchor, data, container, onClose }) => (
        <MoreEventsDialogContent
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
    </MoreEventsDialog.Provider>
  );
}

interface MoreEventsDialogTriggerProps extends Omit<
  React.ComponentProps<typeof Dialog.Trigger>,
  'onClick'
> {
  occurrences: SchedulerEventOccurrence[];
  day: useEventOccurrencesWithDayGridPosition.DayData;
}

export function MoreEventsDialogTrigger(props: MoreEventsDialogTriggerProps) {
  const { occurrences, day, ...other } = props;

  return (
    <MoreEventsDialog.Trigger
      nativeButton={true}
      data={{ occurrences, count: occurrences.length, day }}
      {...other}
    />
  );
}
