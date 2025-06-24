'use client';
import * as React from 'react';
import clsx from 'clsx';
import { Popover } from '@base-ui-components/react/popover';
import { Separator } from '@base-ui-components/react/separator';
import { Field } from '@base-ui-components/react/field';
import { Form } from '@base-ui-components/react/form';
import { X } from 'lucide-react';
import { Input } from '@base-ui-components/react/input';
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
    onEventDelete,
    onClose,
    ...other
  } = props;

  const translations = useTranslations();

  const [errors, setErrors] = React.useState({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const startDateValue = form.get('startDate');
    const startTimeValue = form.get('startTime');
    const endDateValue = form.get('endDate');
    const endTimeValue = form.get('endTime');

    const startISO = `${startDateValue}T${startTimeValue}`;
    const endISO = `${endDateValue}T${endTimeValue}`;

    const start = adapter.date(startISO);
    const end = adapter.date(endISO);

    setErrors({});

    if (adapter.isAfter(start, end) || adapter.isEqual(start, end)) {
      const isSameDay = adapter.isEqual(adapter.startOfDay(start), adapter.startOfDay(end));

      setErrors({
        [isSameDay ? 'startTime' : 'startDate']: translations.startDateAfterEndDateError,
      });

      return;
    }

    onEventEdit({
      ...calendarEvent,
      title: (form.get('title') as string).trim(),
      description: (form.get('description') as string).trim(),
      start,
      end,
    });
    onClose();
  };

  const handleDelete = React.useCallback(() => {
    onEventDelete(calendarEvent.id);
    onClose();
  }, [onEventDelete, calendarEvent.id, onClose]);

  return (
    <div ref={forwardedRef} className={className} {...other}>
      <Popover.Portal container={container}>
        <Popover.Positioner
          sideOffset={8}
          anchor={anchor}
          trackAnchor={false}
          className={clsx(
            'PopoverPositioner',
            getColorClassName({ resource: calendarEventResource }),
          )}
        >
          <Popover.Popup finalFocus={{ current: anchor }}>
            <Form errors={errors} onClearErrors={setErrors} onSubmit={handleSubmit}>
              <header className="EventPopoverHeader">
                <Field.Root name="title">
                  <Field.Label className="EventPopoverTitle">
                    <Input
                      className="EventPopoverTitleInput"
                      type="text"
                      defaultValue={calendarEvent.title}
                      aria-label={translations.eventTitleAriaLabel}
                      required
                    />
                  </Field.Label>
                  <Field.Error className="EventPopoverRequiredFieldError" />
                </Field.Root>
                <Popover.Close
                  aria-label={translations.closeButtonAriaLabel}
                  className="EventPopoverCloseButton"
                >
                  <X size={18} strokeWidth={2} />
                </Popover.Close>
              </header>
              <Separator className="EventPopoverSeparator" />
              <div className="EventPopoverMainContent">
                <div className="EventPopoverDateTimeFields">
                  <Field.Root name="startDate">
                    <Field.Label className="EventPopoverFormLabel">
                      {translations.startDateLabel}
                      <Input
                        className="EventPopoverInput"
                        type="date"
                        defaultValue={
                          adapter.formatByString(calendarEvent.start, 'yyyy-MM-dd') ?? ''
                        }
                        required
                      />
                    </Field.Label>
                  </Field.Root>
                  <Field.Root name="startTime">
                    <Field.Label className="EventPopoverFormLabel">
                      {translations.startTimeLabel}
                      <Input
                        className="EventPopoverInput"
                        type="time"
                        defaultValue={adapter.formatByString(calendarEvent.start, 'HH:mm') ?? ''}
                        required
                      />
                    </Field.Label>
                  </Field.Root>
                  <Field.Root name="endDate">
                    <Field.Label className="EventPopoverFormLabel">
                      {translations.endDateLabel}
                      <Input
                        className="EventPopoverInput"
                        type="date"
                        defaultValue={adapter.formatByString(calendarEvent.end, 'yyyy-MM-dd') ?? ''}
                        required
                      />
                    </Field.Label>
                  </Field.Root>
                  <Field.Root name="endTime">
                    <Field.Label className="EventPopoverFormLabel">
                      {translations.endTimeLabel}
                      <Input
                        className="EventPopoverInput"
                        type="time"
                        defaultValue={adapter.formatByString(calendarEvent.end, 'HH:mm') ?? ''}
                        required
                      />
                    </Field.Label>
                  </Field.Root>
                  <Field.Root name="startDate" className="EventPopoverDateTimeFieldsError">
                    <Field.Error />
                  </Field.Root>
                  <Field.Root name="startTime" className="EventPopoverDateTimeFieldsError">
                    <Field.Error />
                  </Field.Root>
                </div>
                <Separator className="EventPopoverSeparator" />
                <div>
                  <Field.Root name="description">
                    <Field.Label className="EventPopoverFormLabel">
                      {translations.descriptionLabel}
                      <Input
                        render={
                          <textarea
                            className="EventPopoverTextarea"
                            defaultValue={calendarEvent.description}
                            rows={5}
                          />
                        }
                      />
                    </Field.Label>
                  </Field.Root>
                </div>
              </div>
              <Separator className="EventPopoverSeparator" />
              <div className="EventPopoverActions">
                <button className="SecondaryErrorButton" type="button" onClick={handleDelete}>
                  {translations.deleteEvent}
                </button>
                <button className="PrimaryButton" type="submit">
                  {translations.saveChanges}
                </button>
              </div>
            </Form>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </div>
  );
});
