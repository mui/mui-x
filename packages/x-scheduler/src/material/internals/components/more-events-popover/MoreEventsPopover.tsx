import * as React from 'react';
import { X } from 'lucide-react';
import { Popover } from '@base-ui-components/react';
import { useTranslations } from '../../utils/TranslationsContext';
import { CalendarEventOccurrence } from '../../../../primitives';
import './MoreEventsPopover.css';
import { createPopoverComponents } from '../popover';
import { EventPopoverTrigger } from '../event-popover';
import { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler/primitives/use-event-occurrences-with-day-grid-position';
import { MoreEventsPopoverProps, MoreEventsPopoverProviderProps } from './MoreEventsPopover.types';
import { useEventPopoverContext } from '../event-popover/EventPopover';

interface MoreEventsData {
  occurrences: CalendarEventOccurrence[];
  count: number;
  day: useEventOccurrencesWithDayGridPosition.DayData;
}

const MoreEventsPopoverComponents = createPopoverComponents<MoreEventsData>({
  contextName: 'MoreEventsPopoverContext',
});

export const MoreEventsPopoverContext = MoreEventsPopoverComponents.Context;
export const useMoreEventsPopoverContext = MoreEventsPopoverComponents.useContext;

export default function MoreEventsPopover(props: MoreEventsPopoverProps) {
  const { anchor, container, occurrences, day } = props;

  const translations = useTranslations();
  const context = useMoreEventsPopoverContext();

  return (
    <Popover.Portal container={container}>
      <Popover.Positioner
        anchor={anchor}
        sideOffset={8}
        className="PopoverPositioner MoreEventsPopoverPositioner"
      >
        <Popover.Popup>
          <div className="MoreEventsPopoverHeader">
            <Popover.Title className="MoreEventsPopoverTitle">2 more events</Popover.Title>
            <Popover.Close
              aria-label={translations.closeButtonAriaLabel}
              className="EventPopoverCloseButton NeutralTextButton"
            >
              <X size={16} strokeWidth={1.5} />
            </Popover.Close>
          </div>
          <div className="MoreEventsPopoverContent">
            {occurrences.map((occurrence) => (
              <EventPopoverTrigger
                key={occurrence.key}
                occurrence={occurrence}
                onClick={(_e) => context.setKeepOpen(true)}
                render={<p>{occurrence.title}</p>}
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
    <MoreEventsPopoverComponents.Provider
      containerRef={containerRef}
      renderPopover={({ anchor, data, container, onClose }) => (
        <MoreEventsPopover
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
    </MoreEventsPopoverComponents.Provider>
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
    <MoreEventsPopoverComponents.Trigger
      data={{ occurrences, count: occurrences.length, day }}
      {...other}
    />
  );
}
