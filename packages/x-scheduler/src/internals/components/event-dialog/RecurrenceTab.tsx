'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel, { formControlLabelClasses } from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
import { useEventDialogStyledContext } from './EventDialogStyledContext';
import { ControlledValue, EndsSelection, getEndsSelectionFromRRule } from './utils';
import { formatDayOfMonthAndMonthFullLetter } from '../../utils/date-utils';
import { EventDialogTabPanel, EventDialogTabContent } from './EventDialogTabPanel';

const SectionHeaderTitle = styled(Typography, {
  name: 'MuiEventDialog',
  slot: 'SectionHeaderTitle',
})(({ theme }) => ({
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
}));

const RecurrenceSelectorContainer = styled(Paper, {
  name: 'MuiEventDialog',
  slot: 'RecurrenceSelectorContainer',
})(({ theme }) => ({
  display: 'inline-flex',
  border: `1px solid ${theme.palette.divider}`,
  flexWrap: 'wrap',
  width: 'fit-content',
  maxWidth: '100%',
}));

const RadioButtonLabel = styled(FormControlLabel, {
  name: 'MuiEventDialog',
  slot: 'RadioButtonLabel',
})(({ theme }) => ({
  color: theme.palette.text.primary,
  [`& .${formControlLabelClasses.label}`]: {
    minWidth: 60,
  },
}));

const RepeatSectionLabel = styled(FormLabel, {
  name: 'MuiEventDialog',
  slot: 'RepeatSectionLabel',
})(({ theme }) => ({
  color: theme.palette.text.primary,
  minWidth: 60,
}));

const RecurrenceSelectorToggleGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(0.5),
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
  const { classes, localeText } = useEventDialogStyledContext();
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
          freq: base?.freq ?? prev.rruleDraft.freq ?? 'WEEKLY',
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
        rruleDraft: { freq: 'WEEKLY', interval: 1, byDay: [], byMonthDay: [] },
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
    { label: `${localeText.recurrenceNoRepeat}`, value: null },
    { label: `${localeText.recurrenceDailyPresetLabel}`, value: 'DAILY' },
    {
      label: `${localeText.recurrenceWeeklyPresetLabel(weekday)}`,
      value: 'WEEKLY',
    },
    {
      label: `${localeText.recurrenceMonthlyPresetLabel(adapter.getDate(occurrence.displayTimezone.start.value))}`,
      value: 'MONTHLY',
    },
    {
      label: `${localeText.recurrenceYearlyPresetLabel(dateForYearlyOption)}`,
      value: 'YEARLY',
    },
    {
      label: `${localeText.recurrenceCustomRepeat}`,
      value: 'custom',
    },
  ];

  const recurrenceFrequencyOptions: {
    label: string;
    value: RecurringEventFrequency;
  }[] = [
    { label: `${localeText.recurrenceDailyFrequencyLabel}`, value: 'DAILY' },
    {
      label: `${localeText.recurrenceWeeklyFrequencyLabel}`,
      value: 'WEEKLY',
    },
    {
      label: `${localeText.recurrenceMonthlyFrequencyLabel}`,
      value: 'MONTHLY',
    },
    {
      label: `${localeText.recurrenceYearlyFrequencyLabel}`,
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
      id="recurrence-tabpanel"
      aria-labelledby="recurrence-tab"
      className={classes.eventDialogTabPanel}
      hidden={tabValue !== 'recurrence'}
    >
      <EventDialogTabContent className={classes.eventDialogTabContent}>
        <FormControl fullWidth size="small">
          <InputLabel id="recurrence-preset-label">
            {localeText.recurrenceMainSelectCustomLabel}
          </InputLabel>
          <Select
            labelId="recurrence-preset-label"
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

        <FormControl component="fieldset" aria-label={localeText.recurrenceRepeatLabel}>
          <SectionHeaderTitle variant="subtitle2">
            {localeText.recurrenceRepeatLabel}
          </SectionHeaderTitle>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RepeatSectionLabel>{localeText.recurrenceEveryLabel}</RepeatSectionLabel>
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

          {controlled.rruleDraft.freq === 'WEEKLY' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RepeatSectionLabel>
                {localeText.recurrenceWeeklyMonthlySpecificInputsLabel}
              </RepeatSectionLabel>
              <RecurrenceSelectorContainer
                elevation={0}
                className={classes.eventDialogRecurrenceSelectorContainer}
              >
                <RecurrenceSelectorToggleGroup
                  size="small"
                  value={controlled.rruleDraft.byDay}
                  onChange={(_, newValue) => handleChangeWeeklyDays(newValue)}
                  disabled={customDisabled}
                  aria-label={localeText.recurrenceWeeklyMonthlySpecificInputsLabel}
                >
                  {weeklyDayItems.map(({ value: dayValue, ariaLabel, label }) => (
                    <ToggleButton key={dayValue} aria-label={ariaLabel} value={dayValue}>
                      {label}
                    </ToggleButton>
                  ))}
                </RecurrenceSelectorToggleGroup>
              </RecurrenceSelectorContainer>
            </Box>
          )}

          {controlled.rruleDraft.freq === 'MONTHLY' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RepeatSectionLabel>
                {localeText.recurrenceWeeklyMonthlySpecificInputsLabel}
              </RepeatSectionLabel>
              <RecurrenceSelectorContainer
                elevation={0}
                className={classes.eventDialogRecurrenceSelectorContainer}
              >
                <RecurrenceSelectorToggleGroup
                  size="small"
                  value={monthlyMode}
                  exclusive
                  onChange={(_, newValue) => {
                    if (newValue) {
                      handleChangeMonthlyGroup([newValue]);
                    }
                  }}
                  disabled={customDisabled}
                  aria-label={localeText.recurrenceWeeklyMonthlySpecificInputsLabel}
                >
                  {monthlyItems.map(({ value: monthlyValue, ariaLabel, label }) => (
                    <ToggleButton key={monthlyValue} aria-label={ariaLabel} value={monthlyValue}>
                      {label}
                    </ToggleButton>
                  ))}
                </RecurrenceSelectorToggleGroup>
              </RecurrenceSelectorContainer>
            </Box>
          )}
        </Box>
        </FormControl>

        <FormControl component="fieldset" aria-label={localeText.recurrenceEndsLabel}>
          <SectionHeaderTitle variant="subtitle2">
            {localeText.recurrenceEndsLabel}
          </SectionHeaderTitle>
          <RadioGroup
            value={customEndsValue}
            onChange={(event) => handleEndsChange(event.target.value as EndsSelection)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
          >
            <RadioButtonLabel
              value="never"
              control={<Radio size="small" disabled={customDisabled} />}
              label={localeText.recurrenceEndsNeverLabel}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RadioButtonLabel
                value="after"
                control={<Radio size="small" disabled={customDisabled} />}
                label={localeText.recurrenceEndsAfterLabel}
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
              {localeText.recurrenceEndsTimesLabel}
            </Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              onClick={() => {
                if (customEndsValue !== 'until') {
                  handleEndsChange('until');
                }
              }}
            >
              <RadioButtonLabel
                value="until"
                control={<Radio size="small" disabled={customDisabled} />}
                label={localeText.recurrenceEndsUntilLabel}
              />
              <TextField
                type="date"
                value={
                  customEndsValue === 'until' && adapter.isValid(controlled.rruleDraft.until ?? null)
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

      </EventDialogTabContent>
    </EventDialogTabPanel>
  );
}
