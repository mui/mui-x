import * as React from 'react';
import { X } from 'lucide-react';
import { Popover } from '@base-ui-components/react';
import { CalendarEventOccurrence } from '@mui/x-scheduler-headless/models';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-day-grid-position';
import { MoreEventsPopoverProps, MoreEventsPopoverProviderProps } from './MoreEventsPopover.types';
import { useTranslations } from '../../utils/TranslationsContext';
import { EventItem } from '../event/event-item/EventItem';
import { createPopover } from '../popover';
import { ArrowSvg } from './arrow/ArrowSvg';
import './MoreEventsPopover.css';

interface MoreEventsData {
  occurrences: CalendarEventOccurrence[];
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

  // Feature hooks
  const translations = useTranslations();
  const adapter = useAdapter();

  return (
    <Popover.Portal container={container}>
      <Popover.Positioner
        anchor={anchor}
        sideOffset={8}
        className="PopoverPositioner MoreEventsPopoverPositioner"
      >
        <Popover.Popup>
          <Popover.Arrow className="PopoverArrow">
            <ArrowSvg />
          </Popover.Arrow>

          <div
            className="MoreEventsPopoverHeader"
            id={`PopoverHeader-${day.key}`}
            aria-label={`${adapter.format(day.value, 'normalDateWithWeekday')}`}
          >
            <Popover.Title className="MoreEventsPopoverTitle">
              {adapter.format(day.value, 'normalDateWithWeekday')}
            </Popover.Title>
            <Popover.Close
              aria-label={translations.closeButtonAriaLabel}
              className="EventPopoverCloseButton NeutralTextButton"
            >
              <X size={16} strokeWidth={1.5} />
            </Popover.Close>
          </div>
          <div className="MoreEventsPopoverContent">
            {occurrences.map((occurrence) => (
              <EventItem
                variant={occurrence.allDay ? 'allDay' : 'compact'}
                key={occurrence.key}
                occurrence={occurrence}
                ariaLabelledBy={`PopoverHeader-${day.key}`}
              />
            ))}
          </div>
        </Popover.Popup>
      </Popover.Positioner>
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

interface MoreEventsPopoverTriggerProps
  extends Omit<React.ComponentProps<typeof Popover.Trigger>, 'onClick'> {
  occurrences: CalendarEventOccurrence[];
  day: useEventOccurrencesWithDayGridPosition.DayData;
}

export function MoreEventsPopoverTrigger(props: MoreEventsPopoverTriggerProps) {
  const { occurrences, day, ...other } = props;

  return (
    <MoreEventsPopover.Trigger data={{ occurrences, count: occurrences.length, day }} {...other} />
  );
}
