'use client';
import * as React from 'react';
import clsx from 'clsx';
import { Popover } from '@base-ui-components/react/popover';
import { EventPopoverProps } from './EventPopover.types';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import './EventPopover.css';

const adapter = getAdapter();

export const EventPopover = React.forwardRef(function EventPopover(
  props: EventPopoverProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, style, container, anchor, calendarEvent, onEventAction, onClose, ...other } =
    props;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    const startDate = (form.elements.namedItem('startDate') as HTMLInputElement).value;
    const startTime = (form.elements.namedItem('startTime') as HTMLInputElement).value;
    const endDate = (form.elements.namedItem('endDate') as HTMLInputElement).value;
    const endTime = (form.elements.namedItem('endTime') as HTMLInputElement).value;

    const startISO = `${startDate}T${startTime}`;
    const endISO = `${endDate}T${endTime}`;

    onEventAction(
      {
        ...calendarEvent,
        title: (form.elements.namedItem('title') as HTMLInputElement).value,
        description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
        start: adapter.date(startISO),
        end: adapter.date(endISO),
      },
      'edit',
    );
    onClose();
  };

  return (
    <div ref={forwardedRef} className={clsx('EventContainer', className)} {...other}>
      <Popover.Portal container={container}>
        <Popover.Positioner sideOffset={8} anchor={anchor} className="PopoverPositioner">
          <Popover.Popup className="PopoverPopup">
            <form className="EventPopoverForm" onSubmit={handleSubmit}>
              <label>
                Name
                <input type="text" name="title" defaultValue={calendarEvent.title} required />
              </label>
              <label>
                Description
                <textarea name="description" defaultValue={calendarEvent.description} rows={2} />
              </label>
              <label>
                Start date
                <input
                  type="date"
                  name="startDate"
                  defaultValue={calendarEvent.start.toISODate() ?? ''}
                  required
                />
              </label>
              <label>
                Start time
                <input
                  type="time"
                  name="startTime"
                  defaultValue={calendarEvent.start.toFormat('HH:mm')}
                  required
                />
              </label>
              <label>
                End date
                <input
                  type="date"
                  name="endDate"
                  defaultValue={calendarEvent.end.toISODate() ?? ''}
                  required
                />
              </label>
              <label>
                End time
                <input
                  type="time"
                  name="endTime"
                  defaultValue={calendarEvent.end.toFormat('HH:mm')}
                  required
                />
              </label>
              <div className="EventPopoverActions">
                <button type="submit">Save</button>
              </div>
            </form>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </div>
  );
});
