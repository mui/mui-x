'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { Checkbox } from '@base-ui-components/react/checkbox';
import { Field } from '@base-ui-components/react/field';
import { Fieldset } from '@base-ui-components/react/fieldset';
import { Form } from '@base-ui-components/react/form';
import { Input } from '@base-ui-components/react/input';
import { Select } from '@base-ui-components/react/select';
import { RadioGroup } from '@base-ui-components/react/radio-group';
import { Radio } from '@base-ui-components/react/radio';
import { Separator } from '@base-ui-components/react/separator';
import { CheckIcon, ChevronDown } from 'lucide-react';
import {
  CalendarEventOccurrence,
  CalendarEventUpdatedProperties,
  CalendarResourceId,
  RecurringEventFrequency,
  RecurringEventPresetKey,
  RecurringEventRecurrenceRule,
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
import { Tabs } from '@base-ui-components/react/tabs';
import { useTranslations } from '../../utils/TranslationsContext';
import { getColorClassName } from '../../utils/color-utils';
import {
  computeRange,
  ControlledValue,
  EndsSelection,
  getEndsSelectionFromRRule,
  isSameRRule,
  validateRange,
} from './utils';

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
  const resources = useStore(store, schedulerResourceSelectors.processedResourceList);
  const recurrencePresets = useStore(
    store,
    schedulerRecurringEventSelectors.presets,
    occurrence.start,
  );
  const defaultRecurrencePresetKey = useStore(
    store,
    schedulerRecurringEventSelectors.defaultPresetKey,
    occurrence.rrule,
    occurrence.start,
  );

  // State hooks
  const [errors, setErrors] = React.useState<Form.Props['errors']>({});
  const [controlled, setControlled] = React.useState<ControlledValue>(() => {
    const fmtDate = (d: SchedulerValidDate) => adapter.formatByString(d, 'yyyy-MM-dd');
    const fmtTime = (d: SchedulerValidDate) => adapter.formatByString(d, 'HH:mm');

    const base = defaultRecurrencePresetKey === 'custom' ? occurrence.rrule : undefined;

    return {
      startDate: fmtDate(occurrence.start),
      endDate: fmtDate(occurrence.end),
      startTime: fmtTime(occurrence.start),
      endTime: fmtTime(occurrence.end),
      resourceId: occurrence.resource ?? null,
      allDay: !!occurrence.allDay,
      recurrenceSelection: defaultRecurrencePresetKey,
      rruleDraft: {
        freq: (base?.freq ?? 'DAILY') as RecurringEventFrequency,
        interval: base?.interval ?? 1,
        byDay: base?.byDay ?? [],
        byMonthDay: base?.byMonthDay ?? [],
        ...(base?.count ? { count: base.count } : {}),
        ...(base?.until ? { until: base.until } : {}),
      },
    };
  });

  function pushPlaceholder(next: ControlledValue) {
    if (rawPlaceholder?.type !== 'creation') {
      return;
    }

    const { start, end, surfaceType } = computeRange(adapter, next);
    const surfaceTypeToUse = rawPlaceholder.lockSurfaceType
      ? rawPlaceholder.surfaceType
      : surfaceType;

    store.setOccurrencePlaceholder({
      type: 'creation',
      surfaceType: surfaceTypeToUse,
      resourceId: next.resourceId,
      start,
      end,
      lockSurfaceType: rawPlaceholder.lockSurfaceType,
    });
  }

  const createHandleChangeDateOrTimeField =
    (field: keyof ControlledValue) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.currentTarget.value;
      setErrors({});
      const newState = { ...controlled, [field]: value };
      pushPlaceholder(newState);
      setControlled(newState);
    };

  const handleResourceChange = (value: CalendarResourceId | null) => {
    const newState = { ...controlled, resourceId: value };
    pushPlaceholder(newState);
    setControlled(newState);
  };

  const handleToggleAllDay = (checked: boolean) => {
    const newState = { ...controlled, allDay: checked };
    pushPlaceholder(newState);
    setControlled(newState);
  };

  const recurrenceReadOnly = isPropertyReadOnly('rrule');
  const customDisabled = controlled.recurrenceSelection !== 'custom' || recurrenceReadOnly;

  const handleRecurrenceSelectionChange = (value: RecurringEventPresetKey | null | 'custom') => {
    if (value === 'custom') {
      const base = occurrence.rrule;
      setControlled((prev) => ({
        ...prev,
        recurrenceSelection: 'custom',
        rruleDraft: {
          freq: base?.freq ?? prev.rruleDraft.freq ?? 'DAILY',
          interval: base?.interval ?? prev.rruleDraft.interval ?? 1,
          byDay: base?.byDay ?? prev.rruleDraft.byDay ?? [],
          byMonthDay: base?.byMonthDay ?? prev.rruleDraft.byMonthDay ?? [],
          ...(base?.count ? { count: base.count } : {}),
          ...(base?.until ? { until: base.until } : {}),
        },
      }));
    } else {
      setControlled((prev) => ({
        ...prev,
        recurrenceSelection: value,
        rruleDraft: { freq: 'DAILY', interval: 1, byDay: [], byMonthDay: [] },
      }));
    }
  };

  const handleChangeInterval = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.currentTarget.value || 1);
    setControlled((prev) => ({
      ...prev,
      rruleDraft: { ...prev.rruleDraft, interval: value },
    }));
  };

  const handleChangeFrequency = (value: RecurringEventFrequency) => {
    setControlled((prev) => ({
      ...prev,
      rruleDraft: { ...prev.rruleDraft, freq: value },
    }));
  };

  const handleEndsChange = (value: EndsSelection) => {
    switch (value) {
      case 'until': {
        setControlled((prev) => ({
          ...prev,
          rruleDraft: {
            ...prev.rruleDraft,
            until: adapter.date(prev.endDate),
            count: undefined,
          },
        }));
        break;
      }
      case 'after': {
        setControlled((prev) => ({
          ...prev,
          rruleDraft: {
            ...prev.rruleDraft,
            count: 1,
            until: undefined,
          },
        }));
        break;
      }
      case 'never':
      default: {
        setControlled((prev) => {
          const { count, until, ...rest } = prev.rruleDraft;
          return { ...prev, rruleDraft: rest };
        });
        break;
      }
    }
  };

  const handleChangeCount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.currentTarget.value || 1);
    setControlled((prev) => ({
      ...prev,
      rruleDraft: { ...prev.rruleDraft, count: value },
    }));
  };

  const handleChangeUntil = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setControlled((prev) => ({
      ...prev,
      rruleDraft: { ...prev.rruleDraft, until: adapter.date(value) },
    }));
  };

  const customEndsValue: 'never' | 'after' | 'until' = getEndsSelectionFromRRule(
    controlled.rruleDraft,
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { start, end } = computeRange(adapter, controlled);

    const form = new FormData(event.currentTarget);

    setErrors({});
    const err = validateRange(adapter, start, end, controlled.allDay);
    if (err) {
      setErrors({ [err.field]: translations.startDateAfterEndDateError });
      return;
    }

    const metaChanges = {
      title: (form.get('title') as string).trim(),
      description: (form.get('description') as string).trim(),
      allDay: controlled.allDay,
      resource: controlled.resourceId === null ? undefined : controlled.resourceId,
    };

    let rruleToSubmit: RecurringEventRecurrenceRule | undefined;
    if (controlled.recurrenceSelection === null) {
      rruleToSubmit = undefined;
    } else if (controlled.recurrenceSelection === 'custom') {
      rruleToSubmit = {
        ...controlled.rruleDraft,
      };
    } else {
      rruleToSubmit = recurrencePresets[controlled.recurrenceSelection];
    }

    if (rawPlaceholder?.type === 'creation') {
      store.createEvent({
        id: crypto.randomUUID(),
        ...metaChanges,
        start,
        end,
        rrule: rruleToSubmit,
      });
    } else if (occurrence.rrule) {
      const recurrenceModified = !isSameRRule(adapter, occurrence.rrule, rruleToSubmit);
      const changes: CalendarEventUpdatedProperties = {
        ...metaChanges,
        id: occurrence.id,
        start,
        end,
        ...(recurrenceModified ? { rrule: rruleToSubmit } : {}),
      };

      await store.updateRecurringEvent({
        occurrenceStart: occurrence.start,
        changes,
        onSubmit: onClose,
      });
    } else {
      store.updateEvent({ id: occurrence.id, ...metaChanges, start, end, rrule: rruleToSubmit });
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
    value: RecurringEventPresetKey | null | 'custom';
  }[] = [
    { label: `${translations.recurrenceNoRepeat}`, value: null },
    { label: `${translations.recurrenceDailyPresetLabel}`, value: 'DAILY' },
    {
      label: `${translations.recurrenceWeeklyPresetLabel(weekday)}`,
      value: 'WEEKLY',
    },
    {
      label: `${translations.recurrenceMonthlyPresetLabel(adapter.getDate(occurrence.start))}`,
      value: 'MONTHLY',
    },
    {
      label: `${translations.recurrenceYearlyPresetLabel(normalDate)}`,
      value: 'YEARLY',
    },
    {
      label: `${translations.recurrenceCustomRepeat}`,
      value: 'custom',
    },
  ];

  const recurrenceFrequencyOptions: {
    label: string;
    value: RecurringEventFrequency;
  }[] = [
    { label: `${translations.recurrenceDailyFrequencyLabel}`, value: 'DAILY' },
    {
      label: `${translations.recurrenceWeeklyFrequencyLabel}`,
      value: 'WEEKLY',
    },
    {
      label: `${translations.recurrenceMonthlyFrequencyLabel}`,
      value: 'MONTHLY',
    },
    {
      label: `${translations.recurrenceYearlyFrequencyLabel}`,
      value: 'YEARLY',
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
            value={controlled.resourceId}
            onValueChange={handleResourceChange}
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
      <Tabs.Root defaultValue="general-tab">
        <Tabs.List className="EventPopoverTabsList">
          <Tabs.Tab value="general-tab" className="EventPopoverTabTrigger Ghost">
            General
          </Tabs.Tab>
          <Tabs.Tab value="recurrence-tab" className="EventPopoverTabTrigger Ghost">
            Recurrence
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="general-tab" keepMounted>
          <div className="EventPopoverMainContent">
            <div className="EventPopoverDateTimeFields">
              <div className="EventPopoverDateTimeFieldsStartRow">
                <Field.Root className="EventPopoverFieldRoot" name="startDate">
                  <Field.Label className="EventPopoverFormLabel">
                    {translations.startDateLabel}
                    <Input
                      className="EventPopoverInput"
                      type="date"
                      value={controlled.startDate}
                      onChange={createHandleChangeDateOrTimeField('startDate')}
                      aria-describedby="startDate-error"
                      required
                      readOnly={isPropertyReadOnly('start')}
                    />
                  </Field.Label>
                </Field.Root>
                {!controlled.allDay && (
                  <Field.Root className="EventPopoverFieldRoot" name="startTime">
                    <Field.Label className="EventPopoverFormLabel">
                      {translations.startTimeLabel}
                      <Input
                        className="EventPopoverInput"
                        type="time"
                        value={controlled.startTime}
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
                      value={controlled.endDate}
                      onChange={createHandleChangeDateOrTimeField('endDate')}
                      required
                      readOnly={isPropertyReadOnly('end')}
                    />
                  </Field.Label>
                </Field.Root>
                {!controlled.allDay && (
                  <Field.Root className="EventPopoverFieldRoot" name="endTime">
                    <Field.Label className="EventPopoverFormLabel">
                      {translations.endTimeLabel}
                      <Input
                        className="EventPopoverInput"
                        type="time"
                        value={controlled.endTime}
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
                    checked={controlled.allDay}
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
        </Tabs.Panel>
        <Tabs.Panel value="recurrence-tab" keepMounted>
          <div className="EventPopoverMainContent">
            <Field.Root className="EventPopoverFieldRoot" name="recurrencePreset">
              <Field.Label className="EventPopoverRecurrenceFormLabel">
                {translations.recurrenceMainSelectCustomLabel}
              </Field.Label>
              <Select.Root
                items={recurrenceOptions}
                value={controlled.recurrenceSelection}
                onValueChange={(value) => handleRecurrenceSelectionChange(value)}
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
            </Field.Root>
            <Fieldset.Root
              className="EventPopoverRecurrenceFieldset"
              disabled={customDisabled}
              aria-disabled={customDisabled}
            >
              <Fieldset.Legend className="EventPopoverRecurrenceFormLabel">
                {translations.recurrenceRepeatLabel}
              </Fieldset.Legend>
              <Field.Root className="EventPopoverInputsRow">
                {translations.recurrenceEveryLabel}
                <Input
                  name="interval"
                  type="number"
                  min={1}
                  value={controlled.rruleDraft.interval}
                  onChange={handleChangeInterval}
                  disabled={customDisabled}
                  className="EventPopoverInput RecurrenceNumberInput"
                />
                <Select.Root
                  items={recurrenceFrequencyOptions}
                  value={controlled.rruleDraft.freq}
                  onValueChange={handleChangeFrequency}
                >
                  <Select.Trigger className="EventPopoverSelectTrigger" disabled={customDisabled}>
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
                        {recurrenceFrequencyOptions.map(({ label, value }) => (
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
              </Field.Root>
            </Fieldset.Root>
            {controlled.recurrenceSelection === 'custom' &&
              controlled.rruleDraft.freq === 'WEEKLY' && (
                <p className="EventPopoverRecurrenceFieldset">TODO: Weekly Fields</p>
              )}
            {controlled.recurrenceSelection === 'custom' &&
              controlled.rruleDraft.freq === 'MONTHLY' && (
                <p className="EventPopoverRecurrenceFieldset">TODO: Monthly Fields</p>
              )}

            <Separator className="EventPopoverSeparator" />

            <Fieldset.Root
              className="EventPopoverRecurrenceFieldset"
              disabled={customDisabled}
              aria-disabled={customDisabled}
            >
              <Fieldset.Legend className="EventPopoverRecurrenceFormLabel">
                {translations.recurrenceEndsLabel}
              </Fieldset.Legend>
              <Field.Root className="EventPopoverFieldRoot">
                <RadioGroup
                  value={customEndsValue}
                  onValueChange={(value) => handleEndsChange(value as EndsSelection)}
                >
                  <Field.Label htmlFor="ends-never" className="RadioItem RadioItemWithInput">
                    <Radio.Root
                      id="ends-never"
                      className="EventPopoverRadioRoot"
                      value="never"
                      disabled={customDisabled}
                      aria-label={translations.recurrenceEndsNeverLabel}
                    >
                      <Radio.Indicator className="RadioItemIndicator" />
                      <span className="EventPopoverRadioItemText">
                        {translations.recurrenceEndsNeverLabel}
                      </span>
                    </Radio.Root>
                  </Field.Label>

                  <Field.Label htmlFor="ends-after" className="RadioItem RadioItemWithInput">
                    <Radio.Root
                      id="ends-after"
                      className="EventPopoverRadioRoot"
                      value="after"
                      disabled={customDisabled}
                      aria-label={translations.recurrenceEndsAfterLabel}
                    >
                      <Radio.Indicator className="RadioItemIndicator" />
                      <span className="EventPopoverRadioItemText">
                        {translations.recurrenceEndsAfterLabel}
                      </span>
                    </Radio.Root>
                    <div className="EventPopoverAfterTimesInputWrapper">
                      <Input
                        name="count"
                        type="number"
                        min={1}
                        value={customEndsValue === 'after' ? (controlled.rruleDraft.count ?? 1) : 1}
                        onChange={handleChangeCount}
                        disabled={customDisabled || customEndsValue !== 'after'}
                        className="EventPopoverInput RecurrenceNumberInput"
                      />
                      {translations.recurrenceEndsTimesLabel}
                    </div>
                  </Field.Label>

                  <Field.Label htmlFor="ends-until" className="RadioItem RadioItemWithInput">
                    <Radio.Root
                      id="ends-until"
                      className="EventPopoverRadioRoot"
                      value="until"
                      disabled={customDisabled}
                      aria-label={translations.recurrenceEndsUntilLabel}
                    >
                      <Radio.Indicator className="RadioItemIndicator" />
                      <span className="EventPopoverRadioItemText">
                        {translations.recurrenceEndsUntilLabel}
                      </span>
                    </Radio.Root>
                    <Input
                      name="until"
                      type="date"
                      value={
                        customEndsValue === 'until' && controlled.rruleDraft.until
                          ? adapter.formatByString(controlled.rruleDraft.until, 'yyyy-MM-dd')
                          : ''
                      }
                      onChange={handleChangeUntil}
                      disabled={customDisabled || customEndsValue !== 'until'}
                      className="EventPopoverInput"
                    />
                  </Field.Label>
                </RadioGroup>
              </Field.Root>
            </Fieldset.Root>
          </div>
        </Tabs.Panel>
      </Tabs.Root>
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
