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
import { useEventEditingStyledContext } from '../internals/components/event-editing/EventEditingStyledContext';
import type { EventDialogFormValues } from '../internals/components/event-dialog/utils';
import { computeRange, validateRange } from '../internals/components/event-dialog/utils';
import { SectionFieldset, SectionHeaderTitle } from './SectionFieldset';
import { useEventDialogFormContext } from '../internals/components/event-dialog/form/EventDialogFormContext';
import { useEventDialogFormField } from './useEventDialogFormField';

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

// The only keys with range validators, so clearing them covers edits to any of the four date/time fields.
const RANGE_ERROR_KEYS = ['endDate', 'endTime'];

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

export function DateTimeSection() {
  // Context hooks
  const adapter = useAdapterContext();
  const { schedulerId, classes, localeText } = useEventEditingStyledContext();
  const store = useSchedulerStoreContext();
  const formStore = useEventDialogFormContext();
  const { occurrence } = formStore;

  // Selector hooks
  const isPropertyReadOnly = useStore(
    store,
    schedulerEventSelectors.isPropertyReadOnly,
    occurrence.id,
  );
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);

  const createRangeValidator =
    (field: 'endDate' | 'endTime') =>
    (value: string, allValues: EventDialogFormValues): string | null => {
      const { start, end } = computeRange(adapter, allValues, displayTimezone);
      if (validateRange(adapter, start, end, allValues.allDay)?.field !== field) {
        return null;
      }
      return field === 'endDate'
        ? localeText.startDateAfterEndDateError
        : localeText.startTimeAfterEndTimeError;
    };

  const startDate = useEventDialogFormField('startDate');
  const startTime = useEventDialogFormField('startTime');
  const endDate = useEventDialogFormField('endDate', {
    validate: createRangeValidator('endDate'),
  });
  const endTime = useEventDialogFormField('endTime', {
    validate: createRangeValidator('endTime'),
  });
  const allDay = useEventDialogFormField('allDay');

  const createHandleChangeDateOrTimeField =
    (field: { setValue: (value: string) => void }) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // Editing any date or time field invalidates the range errors as a whole.
      formStore.clearErrors(RANGE_ERROR_KEYS);
      field.setValue(event.currentTarget.value);
    };

  return (
    <SectionFieldset>
      <SectionHeaderTitle>{localeText.dateTimeSectionLabel}</SectionHeaderTitle>
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
            }}
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
              formHelperText: { role: 'alert' },
            }}
            error={!!endDate.error}
            helperText={endDate.error}
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
                formHelperText: { role: 'alert' },
              }}
              error={!!endTime.error}
              helperText={endTime.error}
              size="small"
            />
          )}
        </DateTimeFieldsRow>
        <AllDayFormControlLabel
          control={
            <Switch
              id={`${schedulerId}-enable-all-day-switch`}
              checked={allDay.value}
              onChange={(event) => {
                formStore.clearErrors(RANGE_ERROR_KEYS);
                allDay.setValue(event.target.checked);
              }}
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
