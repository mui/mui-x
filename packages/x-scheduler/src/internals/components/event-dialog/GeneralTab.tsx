'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  SchedulerEventColor,
  SchedulerResourceId,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler-headless/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import {
  schedulerEventSelectors,
  schedulerOccurrencePlaceholderSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventDialogStyledContext } from './EventDialogStyledContext';
import { computeRange, ControlledValue, hasProp } from './utils';
import ResourceAndColorSection from './ResourceAndColorSection';

const GeneralTabContent = styled('div', {
  name: 'MuiEventDialog',
  slot: 'GeneralTabContent',
})(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  flex: 1,
  overflow: 'auto',
  scrollbarWidth: 'thin',
}));

const SectionHeaderTitle = styled(Typography, {
  name: 'MuiEventDialog',
  slot: 'SectionHeaderTitle',
})(({ theme }) => ({
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
}));

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

interface GeneralTabProps {
  occurrence: SchedulerRenderableEventOccurrence;
  errors: Record<string, string | string[]>;
  setErrors: (errors: Record<string, string | string[]>) => void;
  controlled: ControlledValue;
  setControlled: React.Dispatch<React.SetStateAction<ControlledValue>>;
  value: string;
}

export function GeneralTab(props: GeneralTabProps) {
  const { occurrence, errors, setErrors, controlled, setControlled, value } = props;

  // Context hooks
  const adapter = useAdapter();
  const { classes, localeText } = useEventDialogStyledContext();
  const store = useSchedulerStoreContext();

  // Selector hooks
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);
  const isPropertyReadOnly = useStore(
    store,
    schedulerEventSelectors.isPropertyReadOnly,
    occurrence.id,
  );
  const rawPlaceholder = useStore(store, schedulerOccurrencePlaceholderSelectors.value);
  function pushPlaceholder(next: ControlledValue) {
    if (rawPlaceholder?.type !== 'creation') {
      return;
    }

    const { start, end, surfaceType } = computeRange(adapter, next, displayTimezone);
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

  const handleResourceChange = (newResource: SchedulerResourceId | null) => {
    const newState = { ...controlled, resourceId: newResource };
    pushPlaceholder(newState);
    setControlled(newState);
  };

  const handleColorChange = (newColor: SchedulerEventColor) => {
    if (!newColor) {
      return;
    }

    const newState = { ...controlled, color: newColor === controlled.color ? null : newColor };
    pushPlaceholder(newState);
    setControlled(newState);
  };

  return (
    <Box
      role="tabpanel"
      id="general-tabpanel"
      aria-labelledby="general-tab"
      sx={{
        display: value !== 'general' ? 'none' : 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <GeneralTabContent className={classes.eventDialogGeneralTabContent}>
        <SectionHeaderTitle variant="subtitle2">
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
          <FormControlLabel
            control={
              <Switch
                id="enable-all-day-switch"
                checked={controlled.allDay}
                onChange={(event) => handleToggleAllDay(event.target.checked)}
                disabled={isPropertyReadOnly('allDay')}
              />
            }
            label={localeText.allDayLabel}
            labelPlacement="start"
            sx={{ width: '100%', justifyContent: 'space-between', ml: 0 }}
          />
        </DateTimeFieldsContainer>
        <Divider />
        <SectionHeaderTitle variant="subtitle2">
          {localeText.resourceColorSectionLabel}
        </SectionHeaderTitle>
        <ResourceAndColorSection
          readOnly={isPropertyReadOnly('resource')}
          resourceId={controlled.resourceId}
          onResourceChange={handleResourceChange}
          onColorChange={handleColorChange}
          color={controlled.color}
        />
        <Divider />
        <TextField
          name="description"
          label={localeText.descriptionLabel}
          defaultValue={hasProp(occurrence, 'description') ? occurrence.description : ''}
          multiline
          rows={5}
          fullWidth
          slotProps={{
            input: { readOnly: isPropertyReadOnly('description') },
          }}
        />
      </GeneralTabContent>
    </Box>
  );
}
