'use client';
import * as React from 'react';
import clsx from 'clsx';
import { Popover } from '@base-ui-components/react/popover';
import { Separator } from '@base-ui-components/react/separator';
import { Field } from '@base-ui-components/react/field';
import { Form } from '@base-ui-components/react/form';
import { Checkbox } from '@base-ui-components/react/checkbox';
import { X, CheckIcon } from 'lucide-react';
import { Input } from '@base-ui-components/react/input';
import { useStore } from '@base-ui-components/utils/store';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import {
  EventPopoverContextValue,
  EventPopoverProps,
  EventPopoverProviderProps,
  EventPopoverTriggerProps,
} from './EventPopover.types';
import { useAdapter } from '../../../../primitives/utils/adapter/useAdapter';
import { getColorClassName } from '../../utils/color-utils';
import { useTranslations } from '../../utils/TranslationsContext';
import { CalendarEvent } from '../../../../primitives/models';
import { selectors } from '../../../../primitives/use-event-calendar';
import { useEventCalendarContext } from '../../hooks/useEventCalendarContext';
import './EventPopover.css';

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
    onClose,
    ...other
  } = props;

  const adapter = useAdapter();
  const translations = useTranslations();
  const { instance } = useEventCalendarContext();

  const [errors, setErrors] = React.useState<Form.Props['errors']>({});
  const [isAllDay, setIsAllDay] = React.useState<boolean>(Boolean(calendarEvent.allDay));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const startDateValue = form.get('startDate');
    const startTimeValue = form.get('startTime');
    const endDateValue = form.get('endDate');
    const endTimeValue = form.get('endTime');

    const startISO = startTimeValue
      ? `${startDateValue}T${startTimeValue}`
      : `${startDateValue}T00:00`;
    const endISO = endTimeValue ? `${endDateValue}T${endTimeValue}` : `${endDateValue}T23:59`;

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
    instance.updateEvent({
      ...calendarEvent,
      title: (form.get('title') as string).trim(),
      description: (form.get('description') as string).trim(),
      start,
      end,
      allDay: isAllDay,
    });
    onClose();
  };

  const handleDelete = useEventCallback(() => {
    instance.deleteEvent(calendarEvent.id);
    onClose();
  });

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
                  <div className="EventPopoverDateTimeFieldsStartRow">
                    <Field.Root name="startDate">
                      <Field.Label className="EventPopoverFormLabel">
                        {translations.startDateLabel}
                        <Input
                          className="EventPopoverInput"
                          type="date"
                          defaultValue={
                            adapter.formatByString(calendarEvent.start, 'yyyy-MM-dd') ?? ''
                          }
                          aria-describedby="startDate-error"
                          required
                        />
                      </Field.Label>
                    </Field.Root>
                    {!isAllDay && (
                      <Field.Root name="startTime">
                        <Field.Label className="EventPopoverFormLabel">
                          {translations.startTimeLabel}
                          <Input
                            className="EventPopoverInput"
                            type="time"
                            defaultValue={
                              adapter.formatByString(calendarEvent.start, 'HH:mm') ?? ''
                            }
                            aria-describedby="startTime-error"
                            required
                          />
                        </Field.Label>
                      </Field.Root>
                    )}
                  </div>
                  <div className="EventPopoverDateTimeFieldsEndRow">
                    <Field.Root name="endDate">
                      <Field.Label className="EventPopoverFormLabel">
                        {translations.endDateLabel}
                        <Input
                          className="EventPopoverInput"
                          type="date"
                          defaultValue={
                            adapter.formatByString(calendarEvent.end, 'yyyy-MM-dd') ?? ''
                          }
                          required
                        />
                      </Field.Label>
                    </Field.Root>
                    {!isAllDay && (
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
                    )}
                  </div>
                  <Field.Root
                    name="startDate"
                    className="EventPopoverDateTimeFieldsError"
                    id="startDate-error"
                    aria-live="polite"
                  >
                    <Field.Error />
                  </Field.Root>
                  <Field.Root
                    name="startTime"
                    className="EventPopoverDateTimeFieldsError"
                    id="startTime-error"
                    aria-live="polite"
                  >
                    <Field.Error />
                  </Field.Root>
                  <Field.Root name="allDay">
                    <Field.Label className="AllDayCheckboxLabel">
                      <Checkbox.Root
                        className="AllDayCheckboxRoot"
                        id="enable-all-day-checkbox"
                        checked={isAllDay}
                        onCheckedChange={setIsAllDay}
                      >
                        <Checkbox.Indicator className="AllDayCheckboxIndicator">
                          <CheckIcon className="AllDayCheckboxIcon" />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      All Day
                    </Field.Label>
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
                <button
                  className={clsx('SecondaryErrorButton', 'Button')}
                  type="button"
                  onClick={handleDelete}
                >
                  {translations.deleteEvent}
                </button>
                <button className={clsx('NeutralButton', 'Button')} type="submit">
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

const EventPopoverContext = React.createContext<EventPopoverContextValue>({
  startEditing: () => {},
});

export function EventPopoverProvider(props: EventPopoverProviderProps) {
  const { containerRef, children } = props;
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);
  const { store } = useEventCalendarContext();
  const resourcesByIdMap = useStore(store, selectors.resourcesByIdMap);

  const startEditing = useEventCallback((event: React.MouseEvent, calendarEvent: CalendarEvent) => {
    setAnchor(event.currentTarget as HTMLElement);
    setSelectedEvent(calendarEvent);
    setIsPopoverOpen(true);
  });

  const handleClose = useEventCallback(() => {
    if (!isPopoverOpen) {
      return;
    }
    setIsPopoverOpen(false);
    setAnchor(null);
    setSelectedEvent(null);
  });

  const contextValue = React.useMemo<EventPopoverContextValue>(
    () => ({ startEditing }),
    [startEditing],
  );

  return (
    <EventPopoverContext.Provider value={contextValue}>
      <Popover.Root open={isPopoverOpen} onOpenChange={handleClose} modal>
        {children}
        {anchor && selectedEvent && (
          <EventPopover
            anchor={anchor}
            calendarEvent={selectedEvent}
            calendarEventResource={resourcesByIdMap.get(selectedEvent.resource)}
            container={containerRef.current}
            onClose={handleClose}
          />
        )}
      </Popover.Root>
    </EventPopoverContext.Provider>
  );
}

export function EventPopoverTrigger(props: EventPopoverTriggerProps) {
  const { event: calendarEvent, ...other } = props;
  const { startEditing } = React.useContext(EventPopoverContext);

  return (
    <Popover.Trigger
      nativeButton={false}
      onClick={(event) => startEditing(event, calendarEvent)}
      {...other}
    />
  );
}
