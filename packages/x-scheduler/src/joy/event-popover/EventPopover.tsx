'use client';
import * as React from 'react';
import clsx from 'clsx';
import { Popover } from '@base-ui-components/react/popover';
import { Separator } from '@base-ui-components/react/separator';
import { X } from 'lucide-react';
import { EventPopoverProps } from './EventPopover.types';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { getColorClassName } from '../internals/utils/color-utils';
import './EventPopover.css';

const adapter = getAdapter();

export const EventPopover = React.forwardRef(function EventPopover(
  props: EventPopoverProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    style,
    container,
    anchor,
    calendarEvent,
    calendarEventResource,
    onEventAction,
    onClose,
    ...other
  } = props;

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
    <div ref={forwardedRef} className={clsx('EventPopoverContainer', className)} {...other}>
      <Popover.Portal container={container}>
        <Popover.Positioner
          sideOffset={8}
          anchor={anchor}
          className={clsx(
            'PopoverPositioner',
            getColorClassName({ resource: calendarEventResource }),
          )}
        >
          <Popover.Popup finalFocus={{ current: anchor }}>
            <form onSubmit={handleSubmit}>
              <header className="EventPopoverHeader">
                <label className="EventPopoverTitle">
                  <input
                    className="EventPopoverTitleInput"
                    type="text"
                    name="title"
                    defaultValue={calendarEvent.title}
                    aria-label="Event name"
                    required
                  />
                </label>
                <Popover.Close aria-label="Close modal" className="EventPopoverCloseButton">
                  <X size={24} strokeWidth={2} />
                </Popover.Close>
              </header>
              <Separator className="EventPopoverSeparator" />
              <div className="EventPopoverMainContent">
                <div className="EventPopoverDateTimeFields">
                  <label className="EventPopoverFormLabel">
                    Start date
                    <input
                      className="EventPopoverInput"
                      type="date"
                      name="startDate"
                      defaultValue={calendarEvent.start.toISODate() ?? ''}
                      required
                    />
                  </label>
                  <label className="EventPopoverFormLabel">
                    Start time
                    <input
                      className="EventPopoverInput"
                      type="time"
                      name="startTime"
                      defaultValue={calendarEvent.start.toFormat('HH:mm')}
                      required
                    />
                  </label>
                  <label className="EventPopoverFormLabel">
                    End date
                    <input
                      className="EventPopoverInput"
                      type="date"
                      name="endDate"
                      defaultValue={calendarEvent.end.toISODate() ?? ''}
                      required
                    />
                  </label>
                  <label className="EventPopoverFormLabel">
                    End time
                    <input
                      className="EventPopoverInput"
                      type="time"
                      name="endTime"
                      defaultValue={calendarEvent.end.toFormat('HH:mm')}
                      required
                    />
                  </label>
                </div>
                <Separator className="EventPopoverSeparator" />
                <div>
                  <label className="EventPopoverFormLabel">
                    Description
                    <textarea
                      className="EventPopoverTextarea"
                      name="description"
                      defaultValue={calendarEvent.description}
                      rows={5}
                    />
                  </label>
                </div>
              </div>
              <Separator className="EventPopoverSeparator" />
              <div className="EventPopoverActions">
                <button type="submit">Save changes</button>
              </div>
            </form>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </div>
  );
});
