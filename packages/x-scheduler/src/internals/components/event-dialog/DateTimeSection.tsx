'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel, { formControlLabelClasses } from '@mui/material/FormControlLabel';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventDialogStyledContext } from './EventDialogStyledContext';
import type { EventDialogFormValues } from './utils';
import { computeRange, validateRange } from './utils';
import type { EventDialogSectionProps } from './EventDialog.types';
import { SectionFieldset, SectionHeaderTitle } from './SectionFieldset';
import { useEventDialogFormContext } from './form/EventDialogFormContext';
import { useField } from './form/useField';

const DateTimeFieldsContainer = styled('div', {
  name: 'MuiEventDialog',
  slot: 'DateTimeFieldsContainer',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const DateTimeFieldsRow = styled('div', {
  name: 'MuiEventDialog',
  slot: 'DateTimeFieldsRow',
})(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  '& > :first-of-type': {
    flex: '1.5 1 0%',
  },
  '& > :nth-of-type(2)': {
    flex: '1 1 0%',
  },
}));

const AllDayFormControlLabel = styled(FormControlLabel, {
  name: 'MuiEventDialog',
  slot: 'AllDayFormControlLabel',
})({
  width: '100%',
  justifyContent: 'space-between',
  [`&.${formControlLabelClasses.root}`]: {
    marginLeft: 0,
  },
});

export default function DateTimeSection(props: EventDialogSectionProps) {
  const { occurrence } = props;

  // Context hooks
  const adapter = useAdapterContext();
  const { schedulerId, classes, localeText } = useEventDialogStyledContext();
  const store = useSchedulerStoreContext();
  const formStore = useEventDialogFormContext();

  // Selector hooks
  const isPropertyReadOnly = useStore(
    store,
    schedulerEventSelectors.isPropertyReadOnly,
    occurrence.id,
  );
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);

  const createRangeValidator =
    (field: 'startDate' | 'startTime') =>
    (value: string, allValues: Record<string, unknown>): string | null => {
      const values = allValues as EventDialogFormValues;
      const { start, end } = computeRange(adapter, values, displayTimezone);
      return validateRange(adapter, start, end, values.allDay)?.field === field
        ? localeText.startDateAfterEndDateError
        : null;
    };

  const startDate = useField<string>('startDate', { validate: createRangeValidator('startDate') });
  const startTime = useField<string>('startTime', { validate: createRangeValidator('startTime') });
  const endDate = useField<string>('endDate');
  const endTime = useField<string>('endTime');
  const allDay = useField<boolean>('allDay');

  const createHandleChangeDateOrTimeField =
    (field: { setValue: (value: string) => void }) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // Editing any date or time field invalidates the range errors as a whole.
      formStore.clearErrors();
      field.setValue(event.currentTarget.value);
    };

  return (
    <SectionFieldset className={classes.eventDialogSectionFieldset}>
      <SectionHeaderTitle className={classes.eventDialogSectionHeaderTitle}>
        {localeText.dateTimeSectionLabel}
      </SectionHeaderTitle>
      <DateTimeFieldsContainer className={classes.eventDialogDateTimeFieldsContainer}>
        <DateTimeFieldsRow className={classes.eventDialogDateTimeFieldsRow}>
          <TextField
            name="startDate"
            label={localeText.startDateLabel}
            type="date"
            value={startDate.value}
            onChange={createHandleChangeDateOrTimeField(startDate)}
            required
            slotProps={{
              inputLabel: { shrink: true },
              input: { readOnly: isPropertyReadOnly('start') },
              formHelperText: { role: 'alert' },
            }}
            error={!!startDate.error}
            helperText={startDate.error}
            size="small"
          />
          {!allDay.value && (
            <TextField
              name="startTime"
              label={localeText.startTimeLabel}
              type="time"
              value={startTime.value}
              onChange={createHandleChangeDateOrTimeField(startTime)}
              required
              slotProps={{
                inputLabel: { shrink: true },
                input: { readOnly: isPropertyReadOnly('start') },
              }}
              size="small"
            />
          )}
        </DateTimeFieldsRow>
        <DateTimeFieldsRow className={classes.eventDialogDateTimeFieldsRow}>
          <TextField
            name="endDate"
            label={localeText.endDateLabel}
            type="date"
            value={endDate.value}
            onChange={createHandleChangeDateOrTimeField(endDate)}
            required
            slotProps={{
              inputLabel: { shrink: true },
              input: { readOnly: isPropertyReadOnly('end') },
            }}
            size="small"
          />
          {!allDay.value && (
            <TextField
              name="endTime"
              label={localeText.endTimeLabel}
              type="time"
              value={endTime.value}
              onChange={createHandleChangeDateOrTimeField(endTime)}
              required
              slotProps={{
                inputLabel: { shrink: true },
                input: { readOnly: isPropertyReadOnly('end') },
              }}
              size="small"
            />
          )}
        </DateTimeFieldsRow>
        <AllDayFormControlLabel
          control={
            <Switch
              id={`${schedulerId}-enable-all-day-switch`}
              checked={allDay.value}
              onChange={(event) => allDay.setValue(event.target.checked)}
              disabled={isPropertyReadOnly('allDay')}
            />
          }
          label={localeText.allDayLabel}
          labelPlacement="start"
        />
      </DateTimeFieldsContainer>
    </SectionFieldset>
  );
}
