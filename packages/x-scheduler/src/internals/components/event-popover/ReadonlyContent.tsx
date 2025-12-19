import * as React from 'react';
import clsx from 'clsx';
import { Calendar } from 'lucide-react';
import { useStore } from '@base-ui-components/utils/store';
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
import { getColorClassName } from '../../utils/color-utils';
import { getRecurrenceLabel } from './utils';
import { useFormatTime } from '../../hooks/useFormatTime';

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
        <p className="EventPopoverTitle"> {occurrence.title}</p>

        <div className="EventPopoverResourceContainer">
          <div className="EventPopoverResourceLegendContainer">
            {resource?.eventColor && resource.eventColor !== color && (
              <span
                className={clsx('ResourceLegendColor', getColorClassName(resource.eventColor))}
              />
            )}

            <span className={clsx('ResourceLegendColor', getColorClassName(color))} />
          </div>
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
            <time
              dateTime={adapter.format(
                occurrence.displayTimezone.start.value,
                'localizedNumericDate',
              )}
              className="EventDate"
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
              <span className="EventAllDay"> {translations.allDayLabel}</span>
            ) : (
              <time className="EventTime">
                <span>{formatTime(occurrence.displayTimezone.start.value)}</span>
                <span> - {formatTime(occurrence.displayTimezone.end.value)}</span>
              </time>
            )}
          </p>
        </div>
        <p className="EventRecurrence">{recurrenceLabel}</p>
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
