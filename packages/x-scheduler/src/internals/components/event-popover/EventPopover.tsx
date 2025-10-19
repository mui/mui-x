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
  DEFAULT_EVENT_COLOR,
  SCHEDULER_RECURRING_EDITING_SCOPE,
} from '@mui/x-scheduler-headless/constants';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import {
  CalendarEventOccurrence,
  CalendarResourceId,
  CalendarEventUpdatedProperties,
  SchedulerValidDate,
  RecurringEventPresetKey,
} from '@mui/x-scheduler-headless/models';
import { selectors } from '@mui/x-scheduler-headless/use-event-calendar';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import {
  EventPopoverProps,
  EventPopoverProviderProps,
  EventPopoverTriggerProps,
} from './EventPopover.types';
import { getColorClassName } from '../../utils/color-utils';
import { useTranslations } from '../../utils/TranslationsContext';
import { createPopover } from '../create-popover';
import './EventPopover.css';

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
  const adapter = useAdapter();
  const translations = useTranslations();
  const store = useEventCalendarStoreContext();

  // Selector hooks
  const isEventReadOnly = useStore(store, selectors.isEventReadOnly, occurrence.id);
  const resources = useStore(store, selectors.resources);
  const color = useStore(store, selectors.eventColor, occurrence.id);
  const rawPlaceholder = useStore(store, selectors.occurrencePlaceholder);
  const recurrencePresets = useStore(store, selectors.recurrencePresets, occurrence.start);
  const defaultRecurrenceKey = useStore(
    store,
    selectors.defaultRecurrencePresetKey,
    occurrence.rrule,
    occurrence.start,
  );

  // State hooks
  const [errors, setErrors] = React.useState<Form.Props['errors']>({});
  const [isAllDay, setIsAllDay] = React.useState<boolean>(Boolean(occurrence.allDay));
  const [when, setWhen] = React.useState(() => {
    const fmtDate = (d: SchedulerValidDate) => adapter.formatByString(d, 'yyyy-MM-dd');
    const fmtTime = (d: SchedulerValidDate) => adapter.formatByString(d, 'HH:mm');

    return {
      startDate: fmtDate(occurrence.start),
      endDate: fmtDate(occurrence.end),
      startTime: fmtTime(occurrence.start),
      endTime: fmtTime(occurrence.end),
    };
  });

  function computeRange(next: typeof when, nextIsAllDay = isAllDay) {
    if (nextIsAllDay) {
      const newStart = adapter.startOfDay(adapter.date(next.startDate));
      const newEnd = adapter.endOfDay(adapter.date(next.endDate));
      return { start: newStart, end: newEnd, surfaceType: 'day-grid' as const };
    }
    // fallback values
    const startTime = next.startTime || '12:00';
    const endTime = next.endTime || '12:30';

    const newStart = adapter.date(`${next.startDate}T${startTime}`);
    const newEnd = adapter.date(`${next.endDate}T${endTime}`);

    return { start: newStart, end: newEnd, surfaceType: 'time-grid' as const };
  }

  function pushPlaceholder(next: typeof when, nextIsAllDay = isAllDay) {
    if (rawPlaceholder?.type !== 'creation') {
      return;
    }

    const { start, end, surfaceType } = computeRange(next, nextIsAllDay);
    const surfaceTypeToUse = rawPlaceholder.lockSurfaceType
      ? rawPlaceholder.surfaceType
      : surfaceType;

    store.setOccurrencePlaceholder({
      type: 'creation',
      surfaceType: surfaceTypeToUse,
      start,
      end,
      lockSurfaceType: rawPlaceholder.lockSurfaceType,
    });
  }

  const handleChangeDateOrTimeField =
    (field: keyof typeof when) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.currentTarget.value;
      setErrors({});
      setWhen((prev) => {
        const next = { ...prev, [field]: value };
        pushPlaceholder(next);
        return next;
      });
    };

  const handleToggleAllDay = (checked: boolean) => {
    if (isEventReadOnly) {
      return;
    }

    setIsAllDay(checked);
    pushPlaceholder(when, checked);
  };

  const weekday = adapter.format(occurrence.start, 'weekday');
  const normalDate = adapter.format(occurrence.start, 'normalDate');

  const recurrenceOptions: {
    label: string;
    value: RecurringEventPresetKey | null;
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
        label: resource.title,
        value: resource.id,
        eventColor: resource.eventColor,
      })),
    ];
  }, [resources, translations.labelNoResource]);

  function validateRange(
    start: SchedulerValidDate,
    end: SchedulerValidDate,
    allDay: boolean,
  ): null | { field: 'startDate' | 'startTime' } {
    const startDay = adapter.startOfDay(start);
    const endDay = adapter.startOfDay(end);
    // endDay <= startDay → date error
    if (adapter.isAfter(startDay, endDay)) {
      return { field: 'startDate' };
    }

    if (adapter.isEqual(startDay, endDay)) {
      if (!allDay && !adapter.isAfter(end, start)) {
        // end <= start → hour error
        return { field: 'startTime' };
      }
    }
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { start, end } = computeRange(when, isAllDay);

    const form = new FormData(event.currentTarget);
    const recurrenceValue = form.get('recurrence') as RecurringEventPresetKey;
    const recurrenceModified =
      defaultRecurrenceKey !== 'custom' && recurrenceValue !== defaultRecurrenceKey;
    // TODO: This will change after implementing the custom recurrence editing tab.
    const rrule =
      recurrenceModified && recurrenceValue ? recurrencePresets[recurrenceValue] : undefined;

    const resourceRawValue = form.get('resource');
    const resourceValue =
      resourceRawValue === '' ? undefined : (resourceRawValue as CalendarResourceId);

    setErrors({});
    const err = validateRange(start, end, isAllDay);
    if (err) {
      setErrors({ [err.field]: translations.startDateAfterEndDateError });
      return;
    }

    const metaChanges = {
      title: (form.get('title') as string).trim(),
      description: (form.get('description') as string).trim(),
      allDay: isAllDay,
      resource: resourceValue,
    };

    if (rawPlaceholder?.type === 'creation') {
      store.createEvent({ id: crypto.randomUUID(), ...metaChanges, start, end, rrule });
    } else if (occurrence.rrule) {
      const changes: CalendarEventUpdatedProperties = {
        ...metaChanges,
        id: occurrence.id,
        start,
        end,
        ...(recurrenceModified ? { rrule } : {}),
      };
      store.updateRecurringEvent({
        occurrenceStart: occurrence.start,
        changes,
        // TODO: Issue #19766 - Let the user choose the scope via UI.
        scope: SCHEDULER_RECURRING_EDITING_SCOPE,
      });
    } else {
      store.updateEvent({ id: occurrence.id, ...metaChanges, start, end, rrule });
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
          className={clsx('PopoverPositioner', 'EventPopoverPositioner', getColorClassName(color))}
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
                          value={when.startDate}
                          onChange={handleChangeDateOrTimeField('startDate')}
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
                            value={when.startTime}
                            onChange={handleChangeDateOrTimeField('startTime')}
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
                          value={when.endDate}
                          onChange={handleChangeDateOrTimeField('endDate')}
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
                            value={when.endTime}
                            onChange={handleChangeDateOrTimeField('endTime')}
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
                        onCheckedChange={handleToggleAllDay}
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
