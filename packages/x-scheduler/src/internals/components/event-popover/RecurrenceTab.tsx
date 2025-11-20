'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { Field } from '@base-ui-components/react/field';
import { Fieldset } from '@base-ui-components/react/fieldset';
import { Input } from '@base-ui-components/react/input';
import { Select } from '@base-ui-components/react/select';
import { RadioGroup } from '@base-ui-components/react/radio-group';
import { Radio } from '@base-ui-components/react/radio';
import { ChevronDown } from 'lucide-react';
import { Toggle } from '@base-ui-components/react/toggle';
import { ToggleGroup } from '@base-ui-components/react/toggle-group';
import {
  SchedulerEventOccurrence,
  RecurringEventFrequency,
  RecurringEventPresetKey,
  RecurringEventByDayValue,
  RecurringEventWeekDayCode,
} from '@mui/x-scheduler-headless/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import {
  schedulerEventSelectors,
  schedulerRecurringEventSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { Tabs } from '@base-ui-components/react/tabs';
import { useTranslations } from '../../utils/TranslationsContext';
import { ControlledValue, EndsSelection, getEndsSelectionFromRRule } from './utils';
import { formatDayOfMonthAndMonthFullLetter } from '../../utils/date-utils';

interface RecurrenceTabProps {
  occurrence: SchedulerEventOccurrence;
  controlled: ControlledValue;
  setControlled: React.Dispatch<React.SetStateAction<ControlledValue>>;
}

export function RecurrenceTab(props: RecurrenceTabProps) {
  const { occurrence, controlled, setControlled } = props;

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
  const customDisabled = controlled.recurrenceSelection !== 'custom' || isPropertyReadOnly('rrule');
  const monthlyRef = useStore(
    store,
    schedulerRecurringEventSelectors.monthlyReference,
    occurrence.start,
  );
  const weeklyDays = useStore(store, schedulerRecurringEventSelectors.weeklyDays);

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
            until: adapter.date(prev.endDate, 'default'),
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
      rruleDraft: { ...prev.rruleDraft, until: adapter.date(value, 'default') },
    }));
  };

  const handleChangeWeeklyDays = (next: RecurringEventWeekDayCode[]) => {
    setControlled((prev) => ({
      ...prev,
      rruleDraft: {
        ...prev.rruleDraft,
        byDay: next,
      },
    }));
  };

  const handleChangeMonthlyGroup = (next: string[]) => {
    const nextKey = next[0];

    setControlled((prev) => {
      if (nextKey === 'byDay') {
        const value = `${monthlyRef.ord}${monthlyRef.code}` as RecurringEventByDayValue;
        const { byMonthDay, ...rest } = prev.rruleDraft;
        return { ...prev, rruleDraft: { ...rest, byDay: [value] } };
      }
      const { byDay, ...rest } = prev.rruleDraft;
      return { ...prev, rruleDraft: { ...rest, byMonthDay: [monthlyRef.dayOfMonth] } };
    });
  };

  const customEndsValue: 'never' | 'after' | 'until' = getEndsSelectionFromRRule(
    controlled.rruleDraft,
  );

  const weekday = adapter.format(occurrence.start.value, 'weekday');
  const dateForYearlyOption = formatDayOfMonthAndMonthFullLetter(occurrence.start.value, adapter);

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
      label: `${translations.recurrenceMonthlyPresetLabel(adapter.getDate(occurrence.start.value))}`,
      value: 'MONTHLY',
    },
    {
      label: `${translations.recurrenceYearlyPresetLabel(dateForYearlyOption)}`,
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

  const weeklyDayItems = React.useMemo(
    () =>
      weeklyDays.map(({ code, date }) => ({
        value: code,
        ariaLabel: adapter.format(date, 'weekday'),
        label: adapter.format(date, 'weekday3Letters'),
      })),
    [adapter, weeklyDays],
  );

  const monthlyItems = React.useMemo(() => {
    const ordinal = monthlyRef.ord;
    const dayOfMonthLabel = translations.recurrenceMonthlyDayOfMonthLabel?.(monthlyRef.dayOfMonth);
    const isLast = ordinal === -1;
    const weekdayShort = adapter.formatByString(monthlyRef.date, 'ccc');
    const weekAriaLabel = isLast
      ? translations.recurrenceMonthlyLastWeekAriaLabel(weekday)
      : translations.recurrenceMonthlyWeekNumberAriaLabel?.(ordinal, weekday);
    const weekLabel = isLast
      ? translations.recurrenceMonthlyLastWeekLabel(weekdayShort)
      : translations.recurrenceMonthlyWeekNumberLabel?.(ordinal, weekdayShort);

    return [
      {
        value: 'byMonthDay',
        ariaLabel: dayOfMonthLabel,
        label: dayOfMonthLabel,
      },
      {
        value: 'byDay',
        ariaLabel: weekAriaLabel,
        label: weekLabel,
      },
    ];
  }, [adapter, monthlyRef.date, monthlyRef.dayOfMonth, monthlyRef.ord, translations, weekday]);

  const monthlyMode: 'byMonthDay' | 'byDay' = controlled.rruleDraft.byDay?.length
    ? 'byDay'
    : 'byMonthDay';

  return (
    <Tabs.Panel value="recurrence" keepMounted>
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
        {controlled.recurrenceSelection === 'custom' && controlled.rruleDraft.freq === 'WEEKLY' && (
          <Field.Root className="EventPopoverInputsRow">
            <Field.Label>{translations.recurrenceWeeklyMonthlySpecificInputsLabel}</Field.Label>
            <ToggleGroup
              className="ToggleGroup"
              multiple
              value={controlled.rruleDraft.byDay}
              onValueChange={handleChangeWeeklyDays}
            >
              {weeklyDayItems.map(({ value, ariaLabel, label }) => (
                <Toggle key={value} aria-label={ariaLabel} value={value} className="ToggleItem">
                  {label}
                </Toggle>
              ))}
            </ToggleGroup>
          </Field.Root>
        )}
        {controlled.recurrenceSelection === 'custom' &&
          controlled.rruleDraft.freq === 'MONTHLY' && (
            <Field.Root className="EventPopoverInputsRow">
              <Field.Label>{translations.recurrenceWeeklyMonthlySpecificInputsLabel}</Field.Label>
              <ToggleGroup
                className="ToggleGroup"
                value={[monthlyMode]}
                onValueChange={handleChangeMonthlyGroup}
              >
                {monthlyItems.map(({ value, ariaLabel, label }) => (
                  <Toggle key={value} aria-label={ariaLabel} value={value} className="ToggleItem">
                    {label}
                  </Toggle>
                ))}
              </ToggleGroup>
            </Field.Root>
          )}

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
              <Field.Label htmlFor="ends-never" className="RadioItem EventPopoverRecurrenceEndItem">
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

              <Field.Label htmlFor="ends-after" className="RadioItem EventPopoverRecurrenceEndItem">
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

              <Field.Label htmlFor="ends-until" className="RadioItem EventPopoverRecurrenceEndItem">
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
                  type="date"
                  value={
                    customEndsValue === 'until' && adapter.isValid(controlled.rruleDraft.until)
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
  );
}
