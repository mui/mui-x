'use client';
import * as React from 'react';
import clsx from 'clsx';
import { Popover } from '@base-ui-components/react/popover';
import { EventPopoverProps } from './EventPopover.types';
import './EventPopover.css';

export const EventPopover = React.forwardRef(function EventPopover(
  props: EventPopoverProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, style, container, anchor, calendarEvent, ...other } = props;

  return (
    <div ref={forwardedRef} className={clsx('EventContainer', className)} {...other}>
      <Popover.Portal container={container}>
        <Popover.Positioner sideOffset={8} anchor={anchor} className="PopoverPositioner">
          <Popover.Popup className="PopoverPopup">
            <Popover.Title>{calendarEvent?.title}</Popover.Title>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </div>
  );
});
