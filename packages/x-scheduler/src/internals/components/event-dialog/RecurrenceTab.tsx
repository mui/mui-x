'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Checkbox, { checkboxClasses } from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel, { formControlLabelClasses } from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import {
  RecurringEventFrequency,
  RecurringEventPresetKey,
  RecurringEventByDayValue,
  RecurringEventWeekDayCode,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler-headless/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { useAdapterContext } from '@mui/x-scheduler-headless/use-adapter-context';
import {
  schedulerEventSelectors,
  schedulerRecurringEventSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventDialogStyledContext } from './EventDialogStyledContext';
import { ControlledValue, EndsSelection, getEndsSelectionFromRRule } from './utils';
import { formatDayOfMonthAndMonthFullLetter } from '../../utils/date-utils';
import { EventDialogTabPanel, EventDialogTabContent } from './EventDialogTabPanel';

const SectionHeaderTitle = styled('legend', {
  name: 'MuiEventDialog',
  slot: 'SectionHeaderTitle',
})(({ theme }) => ({
  ...theme.typography.subtitle2,
  padding: 0,
  marginBlockEnd: theme.spacing(2),
  textTransform: 'uppercase',
  color: (theme.vars || theme).palette.text.secondary,
}));

const RecurrenceSelectorContainer = styled('div', {
  name: 'MuiEventDialog',
  slot: 'RecurrenceSelectorContainer',
})(({ theme }) => ({
  display: 'inline-flex',
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  width: 'fit-content',
  maxWidth: '100%',
  '&[data-disabled]': {
    borderColor: (theme.vars || theme).palette.action.disabled,
  },
}));

const RadioButtonLabel = styled(FormControlLabel, {
  name: 'MuiEventDialog',
  slot: 'RadioButtonLabel',
})(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  [`& .${formControlLabelClasses.label}`]: {
    minWidth: 60,
  },
}));

const RepeatSectionLabel = styled(FormLabel, {
  name: 'MuiEventDialog',
  slot: 'RepeatSectionLabel',
})(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  minWidth: 60,
}));

const EndsRadioGroup = styled(RadioGroup, {
  name: 'MuiEventDialog',
  slot: 'EndsRadioGroup',
})({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

const RepeatSectionFieldset = styled('fieldset', {
  name: 'MuiEventDialog',
  slot: 'RepeatSectionFieldset',
})({
  border: 0,
  margin: 0,
  padding: 0,
});

const RepeatSectionContent = styled('div', {
  name: 'MuiEventDialog',
  slot: 'RepeatSectionContent',
})({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

const InlineRow = styled('div', {
  name: 'MuiEventDialog',
  slot: 'InlineRow',
})({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

const RecurrenceSelectorToggleGroup = styled(ToggleButtonGroup, {
  name: 'MuiEventDialog',
  slot: 'RecurrenceSelectorToggleGroup',
})(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.75),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    minWidth: 0,
    display: 'block',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0,
    },
  },
  [`& .${toggleButtonGroupClasses.middleButton}, & .${toggleButtonGroupClasses.lastButton}`]: {
    marginLeft: -1,
    borderLeft: '1px solid transparent',
  },
}));

const WeekDaySelectorCheckbox = styled(Checkbox, {
  name: 'MuiEventDialog',
  slot: 'WeekDaySelectorCheckbox',
})(({ theme }) => ({
  ...theme.typography.button,
  fontSize: theme.typography.pxToRem(13),
  padding: theme.spacing(0.75),
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  color: (theme.vars || theme).palette.action.active,
  [`&.${checkboxClasses.checked}`]: {
    color: (theme.vars || theme).palette.text.primary,
    backgroundColor: (theme.vars || theme).palette.action.selected,
  },
}));

const FrequencySelect = styled(Select, {
  name: 'MuiEventDialog',
  slot: 'FrequencySelect',
})({
  maxWidth: 120,
});

const SmallNumberField = styled(TextField, {
  name: 'MuiEventDialog',
  slot: 'SmallNumberField',
})({
  maxWidth: 100,
});

interface RecurrenceTabProps {
  occurrence: SchedulerRenderableEventOccurrence;
  controlled: ControlledValue;
  setControlled: React.Dispatch<React.SetStateAction<ControlledValue>>;
  value: string;
}

export function RecurrenceTab(props: RecurrenceTabProps) {
  const { occurrence, controlled, setControlled, value: tabValue } = props;

  // Context hooks
  const adapter = useAdapterContext();
  const { schedulerId, classes, localeText } = useEventDialogStyledContext();
  const store = useSchedulerStoreContext();
  const repeatEveryLabelId = `${schedulerId}-recurrence-repeat-every-label`;
  const repeatOnLabelId = `${schedulerId}-recurrence-repeat-on-label`;
  const endsAfterLabelId = `${schedulerId}-recurrence-ends-after-label`;
  const endsAfterDescriptionId = `${schedulerId}-recurrence-ends-after-description`;
  const endsUntilLabelId = `${schedulerId}-recurrence-ends-until-label`;

  // Selector hooks
  const isPropertyReadOnly = useStore(
    store,
    schedulerEventSelectors.isPropertyReadOnly,
    occurrence.id,
  );
  const dontRepeatDisabled = controlled.recurrenceSelection === null;
  const monthlyRef = useStore(
    store,
    schedulerRecurringEventSelectors.monthlyReference,
    occurrence.displayTimezone.start,
  );
  const weeklyDays = useStore(store, schedulerRecurringEventSelectors.weeklyDays);

  const presetDraftMap = React.useMemo(
    () => ({
      DAILY: { freq: 'DAILY' as const, interval: 1, byDay: [], byMonthDay: [] },
      WEEKLY: { freq: 'WEEKLY' as const, interval: 1, byDay: [monthlyRef.code], byMonthDay: [] },
      MONTHLY: {
        freq: 'MONTHLY' as const,
        interval: 1,
        byDay: [],
        byMonthDay: monthlyRef.dayOfMonth ? [monthlyRef.dayOfMonth] : [],
      },
      YEARLY: { freq: 'YEARLY' as const, interval: 1, byDay: [], byMonthDay: [] },
    }),
    [monthlyRef.code, monthlyRef.dayOfMonth],
  );

  const handleRecurrenceSelectionChange = React.useCallback(
    (newSelection: RecurringEventPresetKey | null | 'custom') => {
      if (newSelection === 'custom') {
        const base = occurrence.displayTimezone.rrule;
        setControlled((prev) => ({
          ...prev,
          recurrenceSelection: 'custom',
          rruleDraft: {
            freq: base?.freq ?? prev.rruleDraft.freq ?? 'WEEKLY',
            interval: base?.interval ?? prev.rruleDraft.interval ?? 1,
            byDay: base?.byDay ?? prev.rruleDraft.byDay ?? [],
            byMonthDay: base?.byMonthDay ?? prev.rruleDraft.byMonthDay ?? [],
            ...(base?.count ? { count: base.count } : {}),
            ...(base?.until ? { until: base.until } : {}),
          },
        }));
        return;
      }
      const rruleDraft = newSelection
        ? presetDraftMap[newSelection]
        : { freq: 'WEEKLY' as const, interval: 1, byDay: [], byMonthDay: [] };
      setControlled((prev) => ({ ...prev, recurrenceSelection: newSelection, rruleDraft }));
    },
    [occurrence.displayTimezone.rrule, presetDraftMap, setControlled],
  );

  const handleChangeInterval = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const intervalValue = Number(event.currentTarget.value || 1);
      setControlled((prev) => ({
        ...prev,
        recurrenceSelection: 'custom',
        rruleDraft: { ...prev.rruleDraft, interval: intervalValue },
      }));
    },
    [setControlled],
  );

  const handleChangeFrequency = (newFrequency: RecurringEventFrequency | null) => {
    if (newFrequency == null) {
      return;
    }
    setControlled((prev) => {
      // When switching frequency, clear byDay/byMonthDay to avoid stale values
      // from a different frequency leaking (e.g. monthly ordinal "2TU" into weekly)
      return {
        ...prev,
        recurrenceSelection: 'custom',
        rruleDraft: {
          ...prev.rruleDraft,
          freq: newFrequency,
          byDay: [],
          byMonthDay: newFrequency === 'MONTHLY' ? [monthlyRef.dayOfMonth] : [],
        },
      };
    });
  };

  const handleEndsChange = (endsSelection: EndsSelection) => {
    switch (endsSelection) {
      case 'until': {
        setControlled((prev) => ({
          ...prev,
          recurrenceSelection: 'custom',
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
          recurrenceSelection: 'custom',
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
          return { ...prev, recurrenceSelection: 'custom', rruleDraft: rest };
        });
        break;
      }
    }
  };

  const handleChangeCount = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const countValue = Number(event.currentTarget.value || 1);
      setControlled((prev) => ({
        ...prev,
        recurrenceSelection: 'custom',
        rruleDraft: { ...prev.rruleDraft, count: countValue },
      }));
    },
    [setControlled],
  );

  const handleChangeUntil = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const untilValue = event.currentTarget.value;
      setControlled((prev) => ({
        ...prev,
        recurrenceSelection: 'custom',
        rruleDraft: { ...prev.rruleDraft, until: adapter.date(untilValue, 'default') },
      }));
    },
    [adapter, setControlled],
  );

  const handleChangeWeeklyDays = React.useCallback(
    (dayCode: RecurringEventWeekDayCode) => {
      setControlled((prev) => {
        const byDay = prev.rruleDraft.byDay ?? [];
        const next = byDay.includes(dayCode)
          ? byDay.filter((d) => d !== dayCode)
          : [...byDay, dayCode];
        return {
          ...prev,
          recurrenceSelection: 'custom',
          rruleDraft: { ...prev.rruleDraft, byDay: next },
        };
      });
    },
    [setControlled],
  );

  const handleChangeMonthlyGroup = (next: string[]) => {
    const nextKey = next[0];

    setControlled((prev) => {
      if (nextKey === 'byDay') {
        const byDayValue = `${monthlyRef.ord}${monthlyRef.code}` as RecurringEventByDayValue;
        const { byMonthDay, ...rest } = prev.rruleDraft;
        return {
          ...prev,
          recurrenceSelection: 'custom',
          rruleDraft: { ...rest, byDay: [byDayValue] },
        };
      }
      const { byDay, ...rest } = prev.rruleDraft;
      return {
        ...prev,
        recurrenceSelection: 'custom',
        rruleDraft: { ...rest, byMonthDay: [monthlyRef.dayOfMonth] },
      };
    });
  };

  const customEndsValue: 'never' | 'after' | 'until' = getEndsSelectionFromRRule(
    controlled.rruleDraft,
  );

  const weekday = adapter.format(occurrence.displayTimezone.start.value, 'weekday');
  const dateForYearlyOption = formatDayOfMonthAndMonthFullLetter(
    occurrence.displayTimezone.start.value,
    adapter,
  );

  const recurrenceOptions = React.useMemo(
    () => [
      { label: `${localeText.recurrenceNoRepeat}`, value: null },
      { label: `${localeText.recurrenceDailyPresetLabel}`, value: 'DAILY' as const },
      {
        label: `${localeText.recurrenceWeeklyPresetLabel(weekday)}`,
        value: 'WEEKLY' as const,
      },
      {
        label: `${localeText.recurrenceMonthlyPresetLabel(adapter.getDate(occurrence.displayTimezone.start.value))}`,
        value: 'MONTHLY' as const,
      },
      {
        label: `${localeText.recurrenceYearlyPresetLabel(dateForYearlyOption)}`,
        value: 'YEARLY' as const,
      },
      {
        label: `${localeText.recurrenceCustomRepeat}`,
        value: 'custom' as const,
      },
    ],
    [adapter, dateForYearlyOption, localeText, occurrence.displayTimezone.start.value, weekday],
  );

  const recurrenceFrequencyOptions = React.useMemo(
    () => [
      {
        label: `${localeText.recurrenceDailyFrequencyLabel}`,
        value: 'DAILY' as RecurringEventFrequency,
      },
      {
        label: `${localeText.recurrenceWeeklyFrequencyLabel}`,
        value: 'WEEKLY' as RecurringEventFrequency,
      },
      {
        label: `${localeText.recurrenceMonthlyFrequencyLabel}`,
        value: 'MONTHLY' as RecurringEventFrequency,
      },
      {
        label: `${localeText.recurrenceYearlyFrequencyLabel}`,
        value: 'YEARLY' as RecurringEventFrequency,
      },
    ],
    [localeText],
  );

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
    const dayOfMonthLabel = localeText.recurrenceMonthlyDayOfMonthLabel?.(monthlyRef.dayOfMonth);
    const isLast = ordinal === -1;
    const weekdayShort = adapter.formatByString(monthlyRef.date, 'ccc');
    const weekAriaLabel = isLast
      ? localeText.recurrenceMonthlyLastWeekAriaLabel(weekday)
      : localeText.recurrenceMonthlyWeekNumberAriaLabel?.(ordinal, weekday);
    const weekLabel = isLast
      ? localeText.recurrenceMonthlyLastWeekLabel(weekdayShort)
      : localeText.recurrenceMonthlyWeekNumberLabel?.(ordinal, weekdayShort);

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
  }, [adapter, monthlyRef.date, monthlyRef.dayOfMonth, monthlyRef.ord, localeText, weekday]);

  const monthlyMode: 'byMonthDay' | 'byDay' = controlled.rruleDraft.byDay?.length
    ? 'byDay'
    : 'byMonthDay';

  return (
    <EventDialogTabPanel
      role="tabpanel"
      id={`${schedulerId}-recurrence-tabpanel`}
      aria-labelledby={`${schedulerId}-recurrence-tab`}
      className={classes.eventDialogTabPanel}
      hidden={tabValue !== 'recurrence'}
    >
      <EventDialogTabContent className={classes.eventDialogTabContent}>
        <FormControl fullWidth size="small">
          <InputLabel id={`${schedulerId}-recurrence-preset-label`}>
            {localeText.recurrenceMainSelectCustomLabel}
          </InputLabel>
          <Select
            labelId={`${schedulerId}-recurrence-preset-label`}
            name="recurrencePreset"
            label={localeText.recurrenceMainSelectCustomLabel}
            value={controlled.recurrenceSelection ?? 'no-repeat'}
            onChange={(event) => {
              const value = event.target.value;
              handleRecurrenceSelectionChange(
                value === 'no-repeat' ? null : (value as RecurringEventPresetKey | 'custom'),
              );
            }}
            readOnly={isPropertyReadOnly('rrule')}
            aria-label={localeText.recurrenceLabel}
          >
            {recurrenceOptions.map(({ label, value: optionValue }) => (
              <MenuItem key={label} value={optionValue ?? 'no-repeat'}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <RepeatSectionFieldset className={classes.eventDialogRepeatSectionFieldset}>
          <SectionHeaderTitle className={classes.eventDialogSectionHeaderTitle}>
            {localeText.recurrenceRepeatLabel}
          </SectionHeaderTitle>
          <RepeatSectionContent className={classes.eventDialogRepeatSectionContent}>
            <InlineRow className={classes.eventDialogInlineRow}>
              <RepeatSectionLabel
                id={repeatEveryLabelId}
                className={classes.eventDialogRepeatSectionLabel}
              >
                {localeText.recurrenceEveryLabel}
              </RepeatSectionLabel>
              <SmallNumberField
                className={classes.eventDialogSmallNumberField}
                type="number"
                slotProps={{ htmlInput: { min: 1, 'aria-labelledby': repeatEveryLabelId } }}
                value={controlled.rruleDraft.interval}
                onChange={handleChangeInterval}
                disabled={dontRepeatDisabled}
                size="small"
              />
              <FrequencySelect
                className={classes.eventDialogFrequencySelect}
                value={controlled.rruleDraft.freq}
                onChange={(event) =>
                  handleChangeFrequency(event.target.value as RecurringEventFrequency)
                }
                disabled={dontRepeatDisabled}
                size="small"
                fullWidth
                aria-labelledby={repeatEveryLabelId}
              >
                {recurrenceFrequencyOptions.map(({ label, value: freqValue }) => (
                  <MenuItem key={label} value={freqValue}>
                    {label}
                  </MenuItem>
                ))}
              </FrequencySelect>
            </InlineRow>

            {controlled.rruleDraft.freq === 'WEEKLY' && (
              <InlineRow className={classes.eventDialogInlineRow}>
                <RepeatSectionLabel
                  id={repeatOnLabelId}
                  className={classes.eventDialogRepeatSectionLabel}
                >
                  {localeText.recurrenceWeeklyMonthlySpecificInputsLabel}
                </RepeatSectionLabel>
                <RecurrenceSelectorContainer
                  className={classes.eventDialogRecurrenceSelectorContainer}
                  role="group"
                  aria-labelledby={repeatOnLabelId}
                  data-disabled={dontRepeatDisabled || undefined}
                >
                  {weeklyDayItems.map(({ value: dayValue, ariaLabel, label }) => (
                    <WeekDaySelectorCheckbox
                      key={dayValue}
                      className={classes.eventDialogWeekDaySelectorCheckbox}
                      icon={<span>{label}</span>}
                      checkedIcon={<span>{label}</span>}
                      checked={controlled.rruleDraft.byDay?.includes(dayValue) ?? false}
                      disabled={dontRepeatDisabled}
                      onChange={() => handleChangeWeeklyDays(dayValue)}
                      slotProps={{ input: { 'aria-label': ariaLabel } }}
                    />
                  ))}
                </RecurrenceSelectorContainer>
              </InlineRow>
            )}

            {controlled.rruleDraft.freq === 'MONTHLY' && (
              <InlineRow className={classes.eventDialogInlineRow}>
                <RepeatSectionLabel
                  id={repeatOnLabelId}
                  className={classes.eventDialogRepeatSectionLabel}
                >
                  {localeText.recurrenceWeeklyMonthlySpecificInputsLabel}
                </RepeatSectionLabel>
                <RecurrenceSelectorContainer
                  className={classes.eventDialogRecurrenceSelectorContainer}
                  data-disabled={dontRepeatDisabled || undefined}
                >
                  <RecurrenceSelectorToggleGroup
                    className={classes.eventDialogRecurrenceSelectorToggleGroup}
                    size="small"
                    value={monthlyMode}
                    exclusive
                    onChange={(_, newValue) => {
                      if (newValue) {
                        handleChangeMonthlyGroup([newValue]);
                      }
                    }}
                    disabled={dontRepeatDisabled}
                    aria-labelledby={repeatOnLabelId}
                  >
                    {monthlyItems.map(({ value: monthlyValue, ariaLabel, label }) => (
                      <ToggleButton key={monthlyValue} aria-label={ariaLabel} value={monthlyValue}>
                        {label}
                      </ToggleButton>
                    ))}
                  </RecurrenceSelectorToggleGroup>
                </RecurrenceSelectorContainer>
              </InlineRow>
            )}
          </RepeatSectionContent>
        </RepeatSectionFieldset>

        <FormControl component="fieldset">
          <SectionHeaderTitle className={classes.eventDialogSectionHeaderTitle}>
            {localeText.recurrenceEndsLabel}
          </SectionHeaderTitle>
          <EndsRadioGroup
            className={classes.eventDialogEndsRadioGroup}
            value={customEndsValue}
            onChange={(event) => handleEndsChange(event.target.value as EndsSelection)}
          >
            <RadioButtonLabel
              className={classes.eventDialogRadioButtonLabel}
              value="never"
              control={<Radio size="small" disabled={dontRepeatDisabled} />}
              label={localeText.recurrenceEndsNeverLabel}
            />
            <InlineRow className={classes.eventDialogInlineRow}>
              <RadioButtonLabel
                className={classes.eventDialogRadioButtonLabel}
                value="after"
                control={<Radio size="small" disabled={dontRepeatDisabled} />}
                label={<span id={endsAfterLabelId}>{localeText.recurrenceEndsAfterLabel}</span>}
              />
              <SmallNumberField
                className={classes.eventDialogSmallNumberField}
                type="number"
                slotProps={{
                  htmlInput: {
                    min: 1,
                    'aria-labelledby': endsAfterLabelId,
                    'aria-describedby': endsAfterDescriptionId,
                  },
                }}
                value={customEndsValue === 'after' ? (controlled.rruleDraft.count ?? 1) : 1}
                onChange={handleChangeCount}
                disabled={dontRepeatDisabled || customEndsValue !== 'after'}
                size="small"
              />
              <span id={endsAfterDescriptionId}>{localeText.recurrenceEndsTimesLabel}</span>
            </InlineRow>
            <InlineRow
              className={classes.eventDialogInlineRow}
              onClick={() => {
                if (!dontRepeatDisabled && customEndsValue !== 'until') {
                  handleEndsChange('until');
                }
              }}
            >
              <RadioButtonLabel
                className={classes.eventDialogRadioButtonLabel}
                value="until"
                control={<Radio size="small" disabled={dontRepeatDisabled} />}
                label={<span id={endsUntilLabelId}>{localeText.recurrenceEndsUntilLabel}</span>}
              />
              <TextField
                type="date"
                value={
                  customEndsValue === 'until' &&
                  adapter.isValid(controlled.rruleDraft.until ?? null)
                    ? adapter.formatByString(controlled.rruleDraft.until!, 'yyyy-MM-dd')
                    : ''
                }
                onChange={handleChangeUntil}
                disabled={dontRepeatDisabled || customEndsValue !== 'until'}
                size="small"
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { 'aria-labelledby': endsUntilLabelId },
                }}
              />
            </InlineRow>
          </EndsRadioGroup>
        </FormControl>
      </EventDialogTabContent>
    </EventDialogTabPanel>
  );
}
