'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import {
  RecurringEventFrequency,
  RecurringEventPresetKey,
  RecurringEventByDayValue,
  RecurringEventWeekDayCode,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler-headless/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import {
  schedulerEventSelectors,
  schedulerRecurringEventSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { useTranslations } from '../../utils/TranslationsContext';
import { ControlledValue, EndsSelection, getEndsSelectionFromRRule } from './utils';
import { formatDayOfMonthAndMonthFullLetter } from '../../utils/date-utils';
import { useEventDialogClasses } from './EventDialogClassesContext';

const RecurrenceTabContent = styled('div', {
  name: 'MuiEventDraggableDialog',
  slot: 'RecurrenceTabContent',
})(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  height: 450,
  overflow: 'auto',
}));

interface RecurrenceTabProps {
  occurrence: SchedulerRenderableEventOccurrence;
  controlled: ControlledValue;
  setControlled: React.Dispatch<React.SetStateAction<ControlledValue>>;
  value: string;
}

export function RecurrenceTab(props: RecurrenceTabProps) {
  const { occurrence, controlled, setControlled, value: tabValue } = props;

  // Context hooks
  const adapter = useAdapter();
  const translations = useTranslations();
  const store = useSchedulerStoreContext();
  const classes = useEventDialogClasses();

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
    occurrence.displayTimezone.start,
  );
  const weeklyDays = useStore(store, schedulerRecurringEventSelectors.weeklyDays);

  const handleRecurrenceSelectionChange = (
    newSelection: RecurringEventPresetKey | null | 'custom',
  ) => {
    if (newSelection === 'custom') {
      const base = occurrence.displayTimezone.rrule;
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
        recurrenceSelection: newSelection,
        rruleDraft: { freq: 'DAILY', interval: 1, byDay: [], byMonthDay: [] },
      }));
    }
  };

  const handleChangeInterval = (event: React.ChangeEvent<HTMLInputElement>) => {
    const intervalValue = Number(event.currentTarget.value || 1);
    setControlled((prev) => ({
      ...prev,
      rruleDraft: { ...prev.rruleDraft, interval: intervalValue },
    }));
  };

  const handleChangeFrequency = (newFrequency: RecurringEventFrequency | null) => {
    if (newFrequency == null) {
      return;
    }
    setControlled((prev) => {
      // When switching to MONTHLY, initialize byMonthDay with the current day of month
      if (
        newFrequency === 'MONTHLY' &&
        !prev.rruleDraft.byDay?.length &&
        !prev.rruleDraft.byMonthDay?.length
      ) {
        return {
          ...prev,
          rruleDraft: {
            ...prev.rruleDraft,
            freq: newFrequency,
            byMonthDay: [monthlyRef.dayOfMonth],
          },
        };
      }
      return {
        ...prev,
        rruleDraft: { ...prev.rruleDraft, freq: newFrequency },
      };
    });
  };

  const handleEndsChange = (endsSelection: EndsSelection) => {
    switch (endsSelection) {
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
    const countValue = Number(event.currentTarget.value || 1);
    setControlled((prev) => ({
      ...prev,
      rruleDraft: { ...prev.rruleDraft, count: countValue },
    }));
  };

  const handleChangeUntil = (event: React.ChangeEvent<HTMLInputElement>) => {
    const untilValue = event.currentTarget.value;
    setControlled((prev) => ({
      ...prev,
      rruleDraft: { ...prev.rruleDraft, until: adapter.date(untilValue, 'default') },
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
        const byDayValue = `${monthlyRef.ord}${monthlyRef.code}` as RecurringEventByDayValue;
        const { byMonthDay, ...rest } = prev.rruleDraft;
        return { ...prev, rruleDraft: { ...rest, byDay: [byDayValue] } };
      }
      const { byDay, ...rest } = prev.rruleDraft;
      return { ...prev, rruleDraft: { ...rest, byMonthDay: [monthlyRef.dayOfMonth] } };
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
      label: `${translations.recurrenceMonthlyPresetLabel(adapter.getDate(occurrence.displayTimezone.start.value))}`,
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
    <Box
      role="tabpanel"
      id="recurrence-tabpanel"
      aria-labelledby="recurrence-tab"
      hidden={tabValue !== 'recurrence'}
    >
      <RecurrenceTabContent className={classes.eventDialogRecurrenceTabContent}>
        <FormControl fullWidth size="small">
          <InputLabel id="recurrence-preset-label">
            {translations.recurrenceMainSelectCustomLabel}
          </InputLabel>
          <Select
            labelId="recurrence-preset-label"
            name="recurrencePreset"
            label={translations.recurrenceMainSelectCustomLabel}
            value={controlled.recurrenceSelection ?? ''}
            onChange={(event) =>
              handleRecurrenceSelectionChange(
                event.target.value as RecurringEventPresetKey | null | 'custom',
              )
            }
            readOnly={isPropertyReadOnly('rrule')}
            aria-label={translations.recurrenceLabel}
          >
            {recurrenceOptions.map(({ label, value: optionValue }) => (
              <MenuItem key={label} value={optionValue ?? ''}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl component="fieldset" disabled={customDisabled}>
          <FormLabel component="legend">{translations.recurrenceRepeatLabel}</FormLabel>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            {translations.recurrenceEveryLabel}
            <TextField
              type="number"
              slotProps={{ htmlInput: { min: 1 } }}
              value={controlled.rruleDraft.interval}
              onChange={handleChangeInterval}
              disabled={customDisabled}
              size="small"
              sx={{ width: 80 }}
            />
            <Select
              value={controlled.rruleDraft.freq}
              onChange={(event) =>
                handleChangeFrequency(event.target.value as RecurringEventFrequency)
              }
              disabled={customDisabled}
              size="small"
              sx={{ minWidth: 120 }}
            >
              {recurrenceFrequencyOptions.map(({ label, value: freqValue }) => (
                <MenuItem key={label} value={freqValue}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </FormControl>

        {controlled.recurrenceSelection === 'custom' && controlled.rruleDraft.freq === 'WEEKLY' && (
          <FormControl component="fieldset">
            <FormLabel>{translations.recurrenceWeeklyMonthlySpecificInputsLabel}</FormLabel>
            <ToggleButtonGroup
              value={controlled.rruleDraft.byDay}
              onChange={(_, newValue) => handleChangeWeeklyDays(newValue)}
              aria-label={translations.recurrenceWeeklyMonthlySpecificInputsLabel}
            >
              {weeklyDayItems.map(({ value: dayValue, ariaLabel, label }) => (
                <ToggleButton key={dayValue} aria-label={ariaLabel} value={dayValue}>
                  {label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </FormControl>
        )}
        {controlled.recurrenceSelection === 'custom' &&
          controlled.rruleDraft.freq === 'MONTHLY' && (
            <FormControl component="fieldset">
              <FormLabel>{translations.recurrenceWeeklyMonthlySpecificInputsLabel}</FormLabel>
              <ToggleButtonGroup
                value={monthlyMode}
                exclusive
                onChange={(_, newValue) => {
                  if (newValue) {
                    handleChangeMonthlyGroup([newValue]);
                  }
                }}
                aria-label={translations.recurrenceWeeklyMonthlySpecificInputsLabel}
              >
                {monthlyItems.map(({ value: monthlyValue, ariaLabel, label }) => (
                  <ToggleButton key={monthlyValue} aria-label={ariaLabel} value={monthlyValue}>
                    {label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </FormControl>
          )}

        <FormControl component="fieldset" disabled={customDisabled}>
          <FormLabel component="legend">{translations.recurrenceEndsLabel}</FormLabel>
          <RadioGroup
            value={customEndsValue}
            onChange={(event) => handleEndsChange(event.target.value as EndsSelection)}
          >
            <FormControlLabel
              value="never"
              control={<Radio disabled={customDisabled} />}
              label={translations.recurrenceEndsNeverLabel}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControlLabel
                value="after"
                control={<Radio disabled={customDisabled} />}
                label={translations.recurrenceEndsAfterLabel}
              />
              <TextField
                type="number"
                slotProps={{ htmlInput: { min: 1 } }}
                value={customEndsValue === 'after' ? (controlled.rruleDraft.count ?? 1) : 1}
                onChange={handleChangeCount}
                disabled={customDisabled || customEndsValue !== 'after'}
                size="small"
                sx={{ width: 80 }}
              />
              {translations.recurrenceEndsTimesLabel}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControlLabel
                value="until"
                control={<Radio disabled={customDisabled} />}
                label={translations.recurrenceEndsUntilLabel}
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
                disabled={customDisabled || customEndsValue !== 'until'}
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>
          </RadioGroup>
        </FormControl>
      </RecurrenceTabContent>
    </Box>
  );
}
