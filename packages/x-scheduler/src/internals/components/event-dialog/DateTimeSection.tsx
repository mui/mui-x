'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel, { formControlLabelClasses } from '@mui/material/FormControlLabel';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventDialogStyledContext } from './EventDialogStyledContext';
import type { ControlledValue, EventDialogSectionProps } from './utils';
import { SectionFieldset, SectionHeaderTitle } from './SectionFieldset';
import { usePushPlaceholder } from './usePushPlaceholder';

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
  const { occurrence, controlled, setControlled, errors, setErrors } = props;

  // Context hooks
  const { schedulerId, classes, localeText } = useEventDialogStyledContext();
  const store = useSchedulerStoreContext();

  // Selector hooks
  const isPropertyReadOnly = useStore(
    store,
    schedulerEventSelectors.isPropertyReadOnly,
    occurrence.id,
  );

  const pushPlaceholder = usePushPlaceholder();

  const createHandleChangeDateOrTimeField =
    (field: keyof ControlledValue) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const inputValue = event.currentTarget.value;
      setErrors({});
      const newState = { ...controlled, [field]: inputValue };
      pushPlaceholder(newState);
      setControlled(newState);
    };

  const handleToggleAllDay = (checked: boolean) => {
    const newState = { ...controlled, allDay: checked };
    pushPlaceholder(newState);
    setControlled(newState);
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
            value={controlled.startDate}
            onChange={createHandleChangeDateOrTimeField('startDate')}
            required
            slotProps={{
              inputLabel: { shrink: true },
              input: { readOnly: isPropertyReadOnly('start') },
              formHelperText: { role: 'alert' },
            }}
            error={!!errors.startDate}
            helperText={errors.startDate}
            size="small"
          />
          {!controlled.allDay && (
            <TextField
              name="startTime"
              label={localeText.startTimeLabel}
              type="time"
              value={controlled.startTime}
              onChange={createHandleChangeDateOrTimeField('startTime')}
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
            value={controlled.endDate}
            onChange={createHandleChangeDateOrTimeField('endDate')}
            required
            slotProps={{
              inputLabel: { shrink: true },
              input: { readOnly: isPropertyReadOnly('end') },
            }}
            size="small"
          />
          {!controlled.allDay && (
            <TextField
              name="endTime"
              label={localeText.endTimeLabel}
              type="time"
              value={controlled.endTime}
              onChange={createHandleChangeDateOrTimeField('endTime')}
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
              checked={controlled.allDay}
              onChange={(event) => handleToggleAllDay(event.target.checked)}
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
