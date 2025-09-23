'use client';
import * as React from 'react';
import clsx from 'clsx';
import { Popover } from '@base-ui-components/react/popover';
import { Separator } from '@base-ui-components/react/separator';
import { Field } from '@base-ui-components/react/field';
import { Form } from '@base-ui-components/react/form';
import { Checkbox } from '@base-ui-components/react/checkbox';
import { X, CheckIcon, ChevronDown } from 'lucide-react';
import { Input } from '@base-ui-components/react/input';
import { useStore } from '@base-ui-components/utils/store';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { Select } from '@base-ui-components/react/select';
import {
  EventPopoverContextValue,
  EventPopoverProps,
  EventPopoverProviderProps,
  EventPopoverTriggerProps,
} from './EventPopover.types';
import { useAdapter } from '../../../../primitives/utils/adapter/useAdapter';
import { getColorClassName } from '../../utils/color-utils';
import { useTranslations } from '../../utils/TranslationsContext';
import {
  CalendarEventOccurrence,
  RecurringEventUpdatedProperties,
  CalendarResourceId,
} from '../../../../primitives/models';
import { selectors } from '../../../../primitives/use-event-calendar';
import { useEventCalendarStoreContext } from '../../../../primitives/utils/useEventCalendarStoreContext';
import './EventPopover.css';
import {
  buildRecurrencePresets,
  detectRecurrenceKeyFromRule,
  RecurrencePresetKey,
} from '../../../../primitives/utils/recurrence-utils';
import { DEFAULT_EVENT_COLOR } from '../../../../primitives/utils/SchedulerStore';

export const EventPopover = React.forwardRef(function EventPopover(
  props: EventPopoverProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, style, container, anchor, occurrence, onClose, ...other } = props;

  const adapter = useAdapter();
  const translations = useTranslations();
  const store = useEventCalendarStoreContext();
  const isEventReadOnly = useStore(store, selectors.isEventReadOnly, occurrence.id);
  const resources = useStore(store, selectors.resources);
  const color = useStore(store, selectors.eventColor, occurrence.id);

  const [errors, setErrors] = React.useState<Form.Props['errors']>({});
  const [isAllDay, setIsAllDay] = React.useState<boolean>(Boolean(occurrence.allDay));

  const recurrencePresets = React.useMemo(
    () => buildRecurrencePresets(adapter, occurrence.start),
    [adapter, occurrence.start],
  );
  const weekday = adapter.format(occurrence.start, 'weekday');
  const normalDate = adapter.format(occurrence.start, 'normalDate');

  const recurrenceOptions: {
    label: string;
    value: RecurrencePresetKey | null;
  }[] = [
    { label: `${translations.recurrenceNoRepeat}`, value: null },
    { label: `${translations.recurrenceDailyPresetLabel}`, value: 'daily' },
    {
      label: `${translations.recurrenceWeeklyPresetLabel(weekday)}`,
      value: 'weekly',
    },
    {
      label: `${translations.recurrenceMonthlyPresetLabel(adapter.getDate(occurrence.start))}`,
      value: 'monthly',
    },
    {
      label: `${translations.recurrenceYearlyPresetLabel(normalDate)}`,
      value: 'yearly',
    },
  ];

  const resourcesOptions = React.useMemo(() => {
    return [
      { label: translations.labelNoResource, value: null, eventColor: DEFAULT_EVENT_COLOR },
      ...resources.map((resource) => ({
        label: resource.name,
        value: resource.id,
        eventColor: resource.eventColor,
      })),
    ];
  }, [resources, translations.labelNoResource]);

  const defaultRecurrenceKey = React.useMemo<RecurrencePresetKey | 'custom' | null>(
    () => detectRecurrenceKeyFromRule(adapter, occurrence.rrule, occurrence.start),
    [adapter, occurrence.rrule, occurrence.start],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const startDateValue = form.get('startDate');
    const startTimeValue = form.get('startTime');
    const endDateValue = form.get('endDate');
    const endTimeValue = form.get('endTime');
    const recurrenceValue = form.get('recurrence') as RecurrencePresetKey;

    const recurrenceModified =
      defaultRecurrenceKey !== 'custom' && recurrenceValue !== defaultRecurrenceKey;

    // TODO: This will change after implementing the custom recurrence editing tab.
    const rrule =
      recurrenceModified && recurrenceValue ? recurrencePresets[recurrenceValue] : undefined;

    const resourceRawValue = form.get('resource');
    const resourceValue =
      resourceRawValue === '' ? undefined : (resourceRawValue as CalendarResourceId);

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

    const payload = {
      title: (form.get('title') as string).trim(),
      description: (form.get('description') as string).trim(),
      start,
      end,
      allDay: isAllDay,
      resource: resourceValue,
    };

    if (occurrence.rrule) {
      const changes: RecurringEventUpdatedProperties = {
        ...payload,
        ...(recurrenceModified ? { rrule } : {}),
      };

      // TODO: Issues #19440 and #19441 - Add support for editing a single occurrence or all occurrences.
      store.updateRecurringEvent({
        eventId: occurrence.id,
        occurrenceStart: occurrence.start,
        changes,
        scope: 'this-and-following',
      });
    } else {
      store.updateEvent({
        id: occurrence.id,
        rrule,
        ...payload,
      });
    }

    onClose();
  };

  const handleDelete = useEventCallback(() => {
    store.deleteEvent(occurrence.id);
    onClose();
  });

  return (
    <div ref={forwardedRef} className={className} {...other}>
      <Popover.Portal container={container}>
        <Popover.Positioner
          sideOffset={8}
          anchor={anchor}
          trackAnchor={false}
          className={clsx('PopoverPositioner', getColorClassName(color))}
        >
          <Popover.Popup finalFocus={{ current: anchor }}>
            <Form errors={errors} onClearErrors={setErrors} onSubmit={handleSubmit}>
              <header className="EventPopoverHeader">
                <div className="EventPopoverHeaderContent">
                  <Field.Root className="EventPopoverFieldRoot" name="title">
                    <Field.Label className="EventPopoverTitle">
                      <Input
                        className="EventPopoverTitleInput"
                        type="text"
                        defaultValue={occurrence.title}
                        aria-label={translations.eventTitleAriaLabel}
                        required
                        readOnly={isEventReadOnly}
                      />
                    </Field.Label>
                    <Field.Error className="EventPopoverRequiredFieldError" />
                  </Field.Root>
                  <Field.Root className="EventPopoverFieldRoot" name="resource">
                    <Select.Root
                      items={resourcesOptions}
                      defaultValue={occurrence.resource}
                      readOnly={isEventReadOnly}
                    >
                      <Select.Trigger
                        className="EventPopoverSelectTrigger Ghost"
                        aria-label={translations.resourceLabel}
                      >
                        <Select.Value>
                          {(value: string | null) => {
                            const selected = resourcesOptions.find(
                              (option) => option.value === value,
                            );

                            return (
                              <div className="EventPopoverSelectItemTitleWrapper">
                                <span
                                  className={clsx(
                                    'ResourceLegendColor',
                                    getColorClassName(selected?.eventColor ?? DEFAULT_EVENT_COLOR),
                                  )}
                                />
                                <span>
                                  {value ? selected?.label : translations.labelNoResource}
                                </span>
                              </div>
                            );
                          }}
                        </Select.Value>
                        <Select.Icon className="EventPopoverSelectIcon">
                          <ChevronDown size={14} />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Positioner
                          alignItemWithTrigger={false}
                          align="start"
                          className="EventPopoverSelectPositioner"
                        >
                          <Select.Popup className="EventPopoverSelectPopup">
                            {resourcesOptions.map((resource) => (
                              <Select.Item
                                key={resource.value}
                                value={resource.value}
                                className="EventPopoverSelectItem"
                              >
                                <div className="EventPopoverSelectItemTitleWrapper">
                                  <span
                                    className={clsx(
                                      'ResourceLegendColor',
                                      getColorClassName(resource.eventColor ?? DEFAULT_EVENT_COLOR),
                                    )}
                                  />
                                  <Select.ItemText className="EventPopoverSelectItemText">
                                    {resource.label}
                                  </Select.ItemText>
                                </div>
                              </Select.Item>
                            ))}
                          </Select.Popup>
                        </Select.Positioner>
                      </Select.Portal>
                    </Select.Root>
                  </Field.Root>
                </div>
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
                    <Field.Root className="EventPopoverFieldRoot" name="startDate">
                      <Field.Label className="EventPopoverFormLabel">
                        {translations.startDateLabel}
                        <Input
                          className="EventPopoverInput"
                          type="date"
                          defaultValue={
                            adapter.formatByString(occurrence.start, 'yyyy-MM-dd') ?? ''
                          }
                          aria-describedby="startDate-error"
                          required
                          readOnly={isEventReadOnly}
                        />
                      </Field.Label>
                    </Field.Root>
                    {!isAllDay && (
                      <Field.Root className="EventPopoverFieldRoot" name="startTime">
                        <Field.Label className="EventPopoverFormLabel">
                          {translations.startTimeLabel}
                          <Input
                            className="EventPopoverInput"
                            type="time"
                            defaultValue={adapter.formatByString(occurrence.start, 'HH:mm') ?? ''}
                            aria-describedby="startTime-error"
                            required
                            readOnly={isEventReadOnly}
                          />
                        </Field.Label>
                      </Field.Root>
                    )}
                  </div>
                  <div className="EventPopoverDateTimeFieldsEndRow">
                    <Field.Root className="EventPopoverFieldRoot" name="endDate">
                      <Field.Label className="EventPopoverFormLabel">
                        {translations.endDateLabel}
                        <Input
                          className="EventPopoverInput"
                          type="date"
                          defaultValue={adapter.formatByString(occurrence.end, 'yyyy-MM-dd') ?? ''}
                          required
                          readOnly={isEventReadOnly}
                        />
                      </Field.Label>
                    </Field.Root>
                    {!isAllDay && (
                      <Field.Root className="EventPopoverFieldRoot" name="endTime">
                        <Field.Label className="EventPopoverFormLabel">
                          {translations.endTimeLabel}
                          <Input
                            className="EventPopoverInput"
                            type="time"
                            defaultValue={adapter.formatByString(occurrence.end, 'HH:mm') ?? ''}
                            required
                            readOnly={isEventReadOnly}
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
                  <Field.Root className="EventPopoverFieldRoot" name="allDay">
                    <Field.Label className="AllDayCheckboxLabel">
                      <Checkbox.Root
                        className="AllDayCheckboxRoot"
                        id="enable-all-day-checkbox"
                        checked={isAllDay}
                        onCheckedChange={setIsAllDay}
                        readOnly={isEventReadOnly}
                      >
                        <Checkbox.Indicator className="AllDayCheckboxIndicator">
                          <CheckIcon className="AllDayCheckboxIcon" />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      {translations.allDayLabel}
                    </Field.Label>
                  </Field.Root>
                </div>
                <Field.Root className="EventPopoverFieldRoot" name="recurrence">
                  {defaultRecurrenceKey === 'custom' ? (
                    // TODO: Issue #19137 - Display the actual custom recurrence rule (e.g. "Repeats every 2 weeks on Monday")
                    <p className="EventPopoverFormLabel">{`Custom ${occurrence.rrule?.freq.toLowerCase()} recurrence`}</p>
                  ) : (
                    <Select.Root
                      items={recurrenceOptions}
                      defaultValue={defaultRecurrenceKey}
                      readOnly={isEventReadOnly}
                    >
                      <Select.Trigger
                        className="EventPopoverSelectTrigger"
                        aria-label={translations.recurrenceLabel}
                      >
                        <Select.Value />
                        <Select.Icon className="EventPopoverSelectIcon">
                          <ChevronDown size={14} />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Positioner
                          alignItemWithTrigger={false}
                          align="start"
                          className="EventPopoverSelectPositioner"
                        >
                          <Select.Popup className="EventPopoverSelectPopup">
                            {recurrenceOptions.map(({ label, value }) => (
                              <Select.Item
                                key={label}
                                value={value}
                                className="EventPopoverSelectItem"
                              >
                                <Select.ItemText className="EventPopoverSelectItemText">
                                  {label}
                                </Select.ItemText>
                              </Select.Item>
                            ))}
                          </Select.Popup>
                        </Select.Positioner>
                      </Select.Portal>
                    </Select.Root>
                  )}
                </Field.Root>
                <Separator className="EventPopoverSeparator" />
                <div>
                  <Field.Root className="EventPopoverFieldRoot" name="description">
                    <Field.Label className="EventPopoverFormLabel">
                      {translations.descriptionLabel}
                      <Input
                        render={
                          <textarea
                            className="EventPopoverTextarea"
                            defaultValue={occurrence.description}
                            rows={5}
                          />
                        }
                        readOnly={isEventReadOnly}
                      />
                    </Field.Label>
                  </Field.Root>
                </div>
              </div>
              <Separator className="EventPopoverSeparator" />
              {!isEventReadOnly && (
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
              )}
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
  const [selectedOccurrence, setSelectedOccurrence] =
    React.useState<CalendarEventOccurrence | null>(null);

  const startEditing = useEventCallback(
    (event: React.MouseEvent, occurrence: CalendarEventOccurrence) => {
      setAnchor(event.currentTarget as HTMLElement);
      setSelectedOccurrence(occurrence);
      setIsPopoverOpen(true);
    },
  );

  const handleClose = useEventCallback(() => {
    if (!isPopoverOpen) {
      return;
    }
    setIsPopoverOpen(false);
    setAnchor(null);
    setSelectedOccurrence(null);
  });

  const contextValue = React.useMemo<EventPopoverContextValue>(
    () => ({ startEditing }),
    [startEditing],
  );

  return (
    <EventPopoverContext.Provider value={contextValue}>
      <Popover.Root open={isPopoverOpen} onOpenChange={handleClose} modal>
        {children}
        {anchor && selectedOccurrence && (
          <EventPopover
            anchor={anchor}
            occurrence={selectedOccurrence}
            container={containerRef.current}
            onClose={handleClose}
          />
        )}
      </Popover.Root>
    </EventPopoverContext.Provider>
  );
}

export function EventPopoverTrigger(props: EventPopoverTriggerProps) {
  const { occurrence, ...other } = props;
  const { startEditing } = React.useContext(EventPopoverContext);

  return (
    <Popover.Trigger
      nativeButton={false}
      onClick={(event) => startEditing(event, occurrence)}
      {...other}
    />
  );
}
