'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import MuiDialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {
  SchedulerEventUpdatedProperties,
  SchedulerProcessedDate,
  RecurringEventFrequency,
  SchedulerProcessedEventRecurrenceRule,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler-headless/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import {
  schedulerEventSelectors,
  schedulerOccurrencePlaceholderSelectors,
  schedulerOtherSelectors,
  schedulerRecurringEventSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventDialogStyledContext } from './EventDialogStyledContext';
import { computeRange, ControlledValue, hasProp, validateRange } from './utils';
import EventDialogHeader from './EventDialogHeader';
import { GeneralTab } from './GeneralTab';
import { RecurrenceTab } from './RecurrenceTab';

const FormActions = styled(DialogActions, {
  name: 'MuiEventDialog',
  slot: 'FormActions',
})(({ theme }) => ({
  padding: theme.spacing(3),
  gap: theme.spacing(2),
}));

const DialogContent = styled(MuiDialogContent, {
  name: 'MuiEventDialog',
  slot: 'DialogContent',
})({
  cursor: 'default',
  userSelect: 'text',
  padding: 0,
  minWidth: 360,
  width: 450,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const EventDialogTitleTextField = styled(TextField, {
  name: 'MuiEventDialog',
  slot: 'TitleTextField',
})(({ theme }) => ({
  flex: 1,
  ['& .MuiInputBase-root']: {
    fontSize: theme.typography.h6.fontSize,
    lineHeight: theme.typography.h6.lineHeight,
    fontWeight: theme.typography.h6.fontWeight,
  },
}));

const EventDialogForm = styled('form', {
  name: 'MuiEventDialog',
  slot: 'Form',
})({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
});

const EventDialogTabs = styled(Tabs, {
  name: 'MuiEventDialog',
  slot: 'Tabs',
})(({ theme }) => ({
  padding: theme.spacing(0, 3),
}));

interface FormContentProps {
  occurrence: SchedulerRenderableEventOccurrence;
  onClose: () => void;
  dragHandlerRef: React.RefObject<HTMLElement | null>;
}

export function FormContent(props: FormContentProps) {
  const { occurrence, onClose, dragHandlerRef } = props;

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
  const rawPlaceholder = useStore(store, schedulerOccurrencePlaceholderSelectors.value);
  const recurrencePresets = useStore(
    store,
    schedulerRecurringEventSelectors.presets,
    occurrence.displayTimezone.start,
  );
  const defaultRecurrencePresetKey = useStore(
    store,
    schedulerRecurringEventSelectors.defaultPresetKey,
    occurrence.displayTimezone.rrule,
    occurrence.displayTimezone.start,
  );
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);
  const showRecurrence = useStore(store, schedulerOtherSelectors.areRecurringEventsAvailable);

  // State hooks
  const [tabValue, setTabValue] = React.useState('general');
  const [errors, setErrors] = React.useState<Record<string, string | string[]>>({});
  const [controlled, setControlled] = React.useState<ControlledValue>(() => {
    const fmtDate = (d: SchedulerProcessedDate) => adapter.formatByString(d.value, 'yyyy-MM-dd');
    const fmtTime = (d: SchedulerProcessedDate) => adapter.formatByString(d.value, 'HH:mm');

    const base =
      defaultRecurrencePresetKey === 'custom' ? occurrence.displayTimezone.rrule : undefined;

    return {
      startDate: fmtDate(occurrence.displayTimezone.start),
      endDate: fmtDate(occurrence.displayTimezone.end),
      startTime: fmtTime(occurrence.displayTimezone.start),
      endTime: fmtTime(occurrence.displayTimezone.end),
      resourceId: occurrence.resource ?? null,
      allDay: !!occurrence.allDay,
      color: hasProp(occurrence, 'color') ? occurrence.color : null,
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { start, end } = computeRange(adapter, controlled, displayTimezone);

    const form = new FormData(event.currentTarget);

    setErrors({});
    const err = validateRange(adapter, start, end, controlled.allDay);
    if (err) {
      setErrors({ [err.field]: localeText.startDateAfterEndDateError });
      return;
    }

    const metaChanges = {
      title: (form.get('title') as string).trim(),
      description: (form.get('description') as string).trim(),
      allDay: controlled.allDay,
      resource: controlled.resourceId === null ? undefined : controlled.resourceId,
      color: controlled.color === null ? undefined : controlled.color,
    };

    let rruleToSubmit: SchedulerProcessedEventRecurrenceRule | undefined;
    if (!showRecurrence) {
      rruleToSubmit = undefined;
    } else if (controlled.recurrenceSelection === null) {
      rruleToSubmit = undefined;
    } else if (controlled.recurrenceSelection === 'custom') {
      rruleToSubmit = controlled.rruleDraft;
    } else {
      rruleToSubmit = recurrencePresets[controlled.recurrenceSelection];
    }

    if (rawPlaceholder?.type === 'creation') {
      store.createEvent({
        ...metaChanges,
        start,
        end,
        rrule: rruleToSubmit,
      });
    } else if (showRecurrence && occurrence.displayTimezone.rrule) {
      const recurrenceModified = !schedulerRecurringEventSelectors.isSameRRule(
        store.state,
        occurrence.displayTimezone.rrule,
        rruleToSubmit,
      );

      const changes: SchedulerEventUpdatedProperties = {
        ...metaChanges,
        id: occurrence.id,
        start,
        end,
        ...(recurrenceModified ? { rrule: rruleToSubmit } : {}),
      };

      await store.updateRecurringEvent({
        occurrenceStart: occurrence.displayTimezone.start.value,
        changes,
        onSubmit: onClose,
      });

      // don't close the dialog
      return;
    } else {
      store.updateEvent({ id: occurrence.id, ...metaChanges, start, end, rrule: rruleToSubmit });
    }

    onClose();
  };

  const handleDelete = () => {
    store.deleteEvent(occurrence.id);
    onClose();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <DialogContent className={classes.eventDialogContent}>
      <EventDialogForm onSubmit={handleSubmit} className={classes.eventDialogForm}>
        <EventDialogHeader onClose={onClose} dragHandlerRef={dragHandlerRef}>
          <span
            id="event-dialog-title"
            style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
          >
            {occurrence.title}
          </span>
          <EventDialogTitleTextField
            name="title"
            defaultValue={occurrence.title}
            required
            slotProps={{
              input: {
                readOnly: isPropertyReadOnly('title'),
                'aria-label': localeText.eventTitleAriaLabel,
              },
            }}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            size="small"
          />
        </EventDialogHeader>
        {showRecurrence && (
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <EventDialogTabs value={tabValue} onChange={handleTabChange}>
              <Tab label={localeText.generalTabLabel} value="general" />
              <Tab label={localeText.recurrenceTabLabel} value="recurrence" />
            </EventDialogTabs>
          </Box>
        )}
        <GeneralTab
          occurrence={occurrence}
          errors={errors}
          setErrors={setErrors}
          controlled={controlled}
          setControlled={setControlled}
          value={showRecurrence ? tabValue : 'general'}
        />
        {showRecurrence && (
          <RecurrenceTab
            occurrence={occurrence}
            controlled={controlled}
            setControlled={setControlled}
            value={tabValue}
          />
        )}
        <Divider />
        <FormActions className={classes.eventDialogFormActions}>
          <Button color="error" type="button" onClick={handleDelete}>
            {localeText.deleteEvent}
          </Button>
          <Button variant="contained" type="submit">
            {localeText.saveChanges}
          </Button>
        </FormActions>
      </EventDialogForm>
    </DialogContent>
  );
}
