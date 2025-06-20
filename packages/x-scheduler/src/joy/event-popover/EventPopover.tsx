'use client';
import * as React from 'react';
import clsx from 'clsx';
import { Popover } from '@base-ui-components/react/popover';
import { Separator } from '@base-ui-components/react/separator';
import { X } from 'lucide-react';
import { EventPopoverProps } from './EventPopover.types';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { getColorClassName } from '../internals/utils/color-utils';
import { useTranslations } from '../internals/utils/TranslationsContext';
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
    onEventEdit,
    onClose,
    ...other
  } = props;

  const translations = useTranslations();

  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    const startDateValue = (form.elements.namedItem('startDate') as HTMLInputElement).value;
    const startTimeValue = (form.elements.namedItem('startTime') as HTMLInputElement).value;
    const endDateValue = (form.elements.namedItem('endDate') as HTMLInputElement).value;
    const endTimeValue = (form.elements.namedItem('endTime') as HTMLInputElement).value;

    const startISO = `${startDateValue}T${startTimeValue}`;
    const endISO = `${endDateValue}T${endTimeValue}`;

    const start = adapter.date(startISO);
    const end = adapter.date(endISO);

    if (adapter.isAfter(start, end) || adapter.isEqual(start, end)) {
      setError(translations.startDateAfterEndDateError);
      return;
    }

    setError(null);

    onEventEdit({
      ...calendarEvent,
      title: (form.elements.namedItem('title') as HTMLInputElement).value.trim(),
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value.trim(),
      start,
      end,
    });
    onClose();
  };

  return (
    <div ref={forwardedRef} className={className} {...other}>
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
                    aria-label={translations.eventTitleAriaLabel}
                    required
                  />
                </label>
                <Popover.Close
                  aria-label={translations.closeButtonAriaLabel}
                  className="EventPopoverCloseButton"
                >
                  <X size={24} strokeWidth={2} />
                </Popover.Close>
              </header>
              <Separator className="EventPopoverSeparator" />
              <div className="EventPopoverMainContent">
                <div className="EventPopoverDateTimeFields">
                  <label className="EventPopoverFormLabel">
                    {translations.startDateLabel}
                    <input
                      className="EventPopoverInput"
                      type="date"
                      name="startDate"
                      defaultValue={adapter.formatByString(calendarEvent.start, 'yyyy-MM-dd') ?? ''} // Mejor que .toISODate()
                      required
                    />
                  </label>
                  <label className="EventPopoverFormLabel">
                    {translations.startTimeLabel}
                    <input
                      className="EventPopoverInput"
                      type="time"
                      name="startTime"
                      defaultValue={adapter.formatByString(calendarEvent.start, 'HH:mm') ?? ''}
                      required
                    />
                  </label>
                  <label className="EventPopoverFormLabel">
                    {translations.endDateLabel}
                    <input
                      className="EventPopoverInput"
                      type="date"
                      name="endDate"
                      defaultValue={adapter.formatByString(calendarEvent.end, 'yyyy-MM-dd') ?? ''}
                      required
                    />
                  </label>
                  <label className="EventPopoverFormLabel">
                    {translations.endTimeLabel}
                    <input
                      className="EventPopoverInput"
                      type="time"
                      name="endTime"
                      defaultValue={adapter.formatByString(calendarEvent.end, 'HH:mm') ?? ''}
                      required
                    />
                  </label>
                  {error && (
                    <div className="EventPopoverDateTimeFieldsError" role="alert">
                      {error}
                    </div>
                  )}
                </div>
                <Separator className="EventPopoverSeparator" />
                <div>
                  <label className="EventPopoverFormLabel">
                    {translations.descriptionLabel}
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
                <button className="PrimaryButton" type="submit">
                  {translations.saveChanges}
                </button>
              </div>
            </form>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </div>
  );
});
