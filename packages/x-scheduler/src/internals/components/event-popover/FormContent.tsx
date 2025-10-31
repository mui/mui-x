'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { Checkbox } from '@base-ui-components/react/checkbox';
import { Field } from '@base-ui-components/react/field';
import { Form } from '@base-ui-components/react/form';
import { Input } from '@base-ui-components/react/input';
import { Select } from '@base-ui-components/react/select';
import { Separator } from '@base-ui-components/react/separator';
import { CheckIcon, ChevronDown } from 'lucide-react';
import {
  CalendarEventOccurrence,
  CalendarEventUpdatedProperties,
  CalendarResourceId,
  RecurringEventPresetKey,
  SchedulerValidDate,
} from '@mui/x-scheduler-headless/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { DEFAULT_EVENT_COLOR } from '@mui/x-scheduler-headless/constants';
import {
  schedulerEventSelectors,
  schedulerOccurrencePlaceholderSelectors,
  schedulerRecurringEventSelectors,
  schedulerResourceSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { useTranslations } from '../../utils/TranslationsContext';
import { getColorClassName } from '../../utils/color-utils';
import { computeRange, validateRange } from './utils';
import EventPopoverHeader from './EventPopoverHeader';

interface FormContentProps {
  occurrence: CalendarEventOccurrence;
  onClose: () => void;
}

export default function FormContent(props: FormContentProps) {
  const { occurrence, onClose } = props;

  // Context hooks
  const adapter = useAdapter();
  const translations = useTranslations();
  const store = useSchedulerStoreContext();

  // Selector hooks
  const isPropertyReadOnly = useStore(
    store,
    schedulerEventSelectors.isPropertyReadOnly,
    occurrence.id,
  );
  const rawPlaceholder = useStore(store, schedulerOccurrencePlaceholderSelectors.value);
  const resources = useStore(store, schedulerResourceSelectors.processedResourceFlatList);
  const recurrencePresets = useStore(
    store,
    schedulerRecurringEventSelectors.presets,
    occurrence.start,
  );
  const defaultRecurrenceKey = useStore(
    store,
    schedulerRecurringEventSelectors.defaultPresetKey,
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

  function pushPlaceholder(next: typeof when, nextIsAllDay = isAllDay) {
    if (rawPlaceholder?.type !== 'creation') {
      return;
    }

    const { start, end, surfaceType } = computeRange(adapter, next, nextIsAllDay);
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

  const createHandleChangeDateOrTimeField =
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
    setIsAllDay(checked);
    pushPlaceholder(when, checked);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { start, end } = computeRange(adapter, when, isAllDay);

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
    const err = validateRange(adapter, start, end, isAllDay);
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

      await store.updateRecurringEvent({
        occurrenceStart: occurrence.start,
        changes,
        onSubmit: onClose,
      });
    } else {
      store.updateEvent({ id: occurrence.id, ...metaChanges, start, end, rrule });
    }

    onClose();
  };

  const handleDelete = () => {
    store.deleteEvent(occurrence.id);
    onClose();
  };

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

  return (
    <Form errors={errors} onClearErrors={setErrors} onSubmit={handleSubmit}>
      <EventPopoverHeader>
        <Field.Root className="EventPopoverFieldRoot" name="title">
          <Field.Label className="EventPopoverTitle">
            <Input
              className="EventPopoverTitleInput"
              type="text"
              defaultValue={occurrence.title}
              aria-label={translations.eventTitleAriaLabel}
              required
              readOnly={isPropertyReadOnly('title')}
            />
          </Field.Label>
          <Field.Error className="EventPopoverRequiredFieldError" />
        </Field.Root>
        <Field.Root className="EventPopoverFieldRoot" name="resource">
          <Select.Root
            items={resourcesOptions}
            defaultValue={occurrence.resource}
            readOnly={isPropertyReadOnly('resource')}
          >
            <Select.Trigger
              className="EventPopoverSelectTrigger Ghost"
              aria-label={translations.resourceLabel}
            >
              <Select.Value>
                {(value: string | null) => {
                  const selected = resourcesOptions.find((option) => option.value === value);

                  return (
                    <div className="EventPopoverSelectItemTitleWrapper">
                      <span
                        className={clsx(
                          'ResourceLegendColor',
                          getColorClassName(selected?.eventColor ?? DEFAULT_EVENT_COLOR),
                        )}
                      />
                      <span>{value ? selected?.label : translations.labelNoResource}</span>
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
      </EventPopoverHeader>
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
                  onChange={createHandleChangeDateOrTimeField('startDate')}
                  aria-describedby="startDate-error"
                  required
                  readOnly={isPropertyReadOnly('start')}
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
                    onChange={createHandleChangeDateOrTimeField('startTime')}
                    aria-describedby="startTime-error"
                    required
                    readOnly={isPropertyReadOnly('start')}
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
                  onChange={createHandleChangeDateOrTimeField('endDate')}
                  required
                  readOnly={isPropertyReadOnly('end')}
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
                    onChange={createHandleChangeDateOrTimeField('endTime')}
                    required
                    readOnly={isPropertyReadOnly('end')}
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
                readOnly={isPropertyReadOnly('allDay')}
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
              readOnly={isPropertyReadOnly('rrule')}
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
                      <Select.Item key={label} value={value} className="EventPopoverSelectItem">
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
                readOnly={isPropertyReadOnly('description')}
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
  );
}
