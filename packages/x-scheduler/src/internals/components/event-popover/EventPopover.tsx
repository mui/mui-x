'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { Popover } from '@base-ui-components/react/popover';
import { CalendarEventOccurrence } from '@mui/x-scheduler-headless/models';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { selectors } from '@mui/x-scheduler-headless/scheduler-store';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import {
  EventPopoverProps,
  EventPopoverProviderProps,
  EventPopoverTriggerProps,
} from './EventPopover.types';
import { getColorClassName } from '../../utils/color-utils';
import { createPopover } from '../create-popover';
import './EventPopover.css';
import FormContent from './content/FormContent';
import ReadonlyContent from './content/ReadonlyContent';

const EventPopover = createPopover<CalendarEventOccurrence>({
  contextName: 'EventPopoverContext',
});

export const EventPopoverContext = EventPopover.Context;
export const useEventPopoverContext = EventPopover.useContext;

export const EventPopoverContent = React.forwardRef(function EventPopoverContent(
  props: EventPopoverProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, style, container, anchor, occurrence, onClose, ...other } = props;

  // Context hooks
  const store = useSchedulerStoreContext();

  // Selector hooks
  const color = useStore(store, selectors.eventColor, occurrence.id);
  const isEventReadOnly = useStore(store, selectors.isEventReadOnly, occurrence.id);

  return (
    <div ref={forwardedRef} className={className} {...other}>
      <Popover.Portal container={container}>
        <Popover.Positioner
          sideOffset={8}
          anchor={anchor}
          trackAnchor={false}
          className={clsx('PopoverPositioner', 'EventPopoverPositioner', getColorClassName(color))}
        >
          <Popover.Popup finalFocus={{ current: anchor }}>
            {isEventReadOnly ? (
              <ReadonlyContent occurrence={occurrence} onClose={onClose} />
            ) : (
              <FormContent occurrence={occurrence} onClose={onClose} />
            )}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </div>
  );
});

export function EventPopoverProvider(props: EventPopoverProviderProps) {
  const { containerRef, children } = props;
  const store = useEventCalendarStoreContext();

  return (
    <EventPopover.Provider
      containerRef={containerRef}
      renderPopover={({ anchor, data: occurrence, container, onClose }) => (
        <EventPopoverContent
          anchor={anchor}
          occurrence={occurrence}
          container={container}
          onClose={onClose}
        />
      )}
      onClose={() => {
        store.setOccurrencePlaceholder(null);
      }}
    >
      {children}
    </EventPopover.Provider>
  );
}

export function EventPopoverTrigger(props: EventPopoverTriggerProps) {
  const { occurrence, ...other } = props;

  return <EventPopover.Trigger data={occurrence} nativeButton={false} {...other} />;
}
