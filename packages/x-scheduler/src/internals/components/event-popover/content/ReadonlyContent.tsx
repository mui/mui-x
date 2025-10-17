import * as React from 'react';
import clsx from 'clsx';
import { Calendar } from 'lucide-react';
import { useStore } from '@base-ui-components/utils/store';
import { CalendarEventOccurrence } from '@mui/x-scheduler-headless/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { DEFAULT_EVENT_COLOR } from '@mui/x-scheduler-headless/constants';
import { selectors } from '@mui/x-scheduler-headless/scheduler-store';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import EventPopoverHeader from '../header/EventPopoverHeader';
import { useTranslations } from '../../../utils/TranslationsContext';
import { getColorClassName } from '../../../utils/color-utils';

type ReadonlyContentProps = {
  occurrence: CalendarEventOccurrence;
  onClose: () => void;
};

export default function ReadonlyContent(props: ReadonlyContentProps) {
  const { occurrence, onClose } = props;

  // Context hooks
  const adapter = useAdapter();

  const translations = useTranslations();
  const store = useSchedulerStoreContext();

  // Selector hooks
  const color = useStore(store, selectors.eventColor, occurrence.id);
  const resource = useStore(store, selectors.resource, occurrence.resource);
  const defaultRecurrenceKey = useStore(
    store,
    selectors.defaultRecurrencePresetKey,
    occurrence.rrule,
    occurrence.start,
  );

  const weekday = adapter.format(occurrence.start, 'weekday');
  const normalDate = adapter.format(occurrence.start, 'normalDate');

  const recurrenceLabelsMap: Record<string, string> = {
    daily: translations.recurrenceDailyPresetLabel,
    weekly: translations.recurrenceWeeklyPresetLabel(weekday),
    monthly: translations.recurrenceMonthlyPresetLabel(adapter.getDate(occurrence.start)),
    yearly: translations.recurrenceYearlyPresetLabel(normalDate),
    custom: translations.recurrenceCustomRepeat,
  };

  return (
    <React.Fragment>
      <EventPopoverHeader>
        <p className="EventPopoverTitle"> {occurrence.title}</p>

        <div className="EventPopoverResourceContainer">
          <span
            className={clsx('ResourceLegendColor', getColorClassName(color ?? DEFAULT_EVENT_COLOR))}
          />
          <p
            className={clsx('EventPopoverResourceTitle', 'LinesClamp')}
            style={{ '--number-of-lines': 1 } as React.CSSProperties}
          >
            {resource?.title || translations.noResourceAriaLabel}
          </p>
        </div>
      </EventPopoverHeader>
      <div className="ReadonlyContent">
        <div className="EventPopoverDateTimeContainer">
          <Calendar size={16} strokeWidth={1.5} />
          <p
            className={clsx('EventPopoverDateTime', 'LinesClamp')}
            style={{ '--number-of-lines': 1 } as React.CSSProperties}
          >
            <time dateTime={adapter.format(occurrence.start, 'keyboardDate')} className="EventDate">
              <span>{adapter.format(occurrence.start, 'fullDate')}, </span>
            </time>
            {occurrence.allDay ? (
              <span className="EventAllDay"> {translations.allDayLabel}</span>
            ) : (
              <time className="EventTime">
                <span>{adapter.format(occurrence.start, 'fullTime24h')}</span>
                <span> - {adapter.format(occurrence.end, 'fullTime24h')}</span>
              </time>
            )}
          </p>
        </div>
        <p className="EventRecurrence">
          {defaultRecurrenceKey
            ? recurrenceLabelsMap[defaultRecurrenceKey]
            : translations.recurrenceNoRepeat}
        </p>
        <p className="EventDescription">{occurrence.description}</p>
      </div>
      <div className="EventPopoverActions">
        <button className={clsx('NeutralButton', 'Button')} type="submit" onClick={onClose}>
          {translations.closeButtonLabel}
        </button>
      </div>
    </React.Fragment>
  );
}
