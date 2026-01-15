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
  SchedulerEventColor,
  SchedulerEventUpdatedProperties,
  SchedulerProcessedDate,
  SchedulerResourceId,
  RecurringEventFrequency,
  RecurringEventRecurrenceRule,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler-headless/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import {
  schedulerEventSelectors,
  schedulerOccurrencePlaceholderSelectors,
  schedulerRecurringEventSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { useTranslations } from '../../utils/TranslationsContext';
import { computeRange, ControlledValue, hasProp, validateRange } from './utils';
import EventPopoverHeader from './EventPopoverHeader';
import ResourceMenu from './ResourceMenu';
import { GeneralTab } from './GeneralTab';
import { RecurrenceTab } from './RecurrenceTab';

const FormActions = styled('div', {
  name: 'MuiEventDraggableDialog',
  slot: 'FormActions',
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
}));

const DialogContent = styled(MuiDialogContent, {
  name: 'MuiEventDraggableDialog',
  slot: 'DialogContent',
})({
  cursor: 'default',
  userSelect: 'text',
});

interface FormContentProps {
  occurrence: SchedulerRenderableEventOccurrence;
  onClose: () => void;
}

export function FormContent(props: FormContentProps) {
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

  const handleResourceChange = (value: SchedulerResourceId | null) => {
    const newState = { ...controlled, resourceId: value };
    pushPlaceholder(newState);
    setControlled(newState);
  };
  const handleColorChange = (value: SchedulerEventColor) => {
    if (!value) {
      return;
    }

    const newState = { ...controlled, color: value === controlled.color ? null : value };
    pushPlaceholder(newState);
    setControlled(newState);
  };

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
      color: controlled.color === null ? undefined : controlled.color,
    };

    let rruleToSubmit: RecurringEventRecurrenceRule | undefined;
    if (controlled.recurrenceSelection === null) {
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
    } else if (occurrence.displayTimezone.rrule) {
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
    <DialogContent>
      <form onSubmit={handleSubmit}>
        <EventPopoverHeader>
          <TextField
            name="title"
            defaultValue={occurrence.title}
            required
            slotProps={{
              input: {
                readOnly: isPropertyReadOnly('title'),
                'aria-label': translations.eventTitleAriaLabel,
              },
            }}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            size="small"
          />
          <ResourceMenu
            readOnly={isPropertyReadOnly('resource')}
            resourceId={controlled.resourceId}
            onResourceChange={handleResourceChange}
            onColorChange={handleColorChange}
            color={controlled.color}
          />
        </EventPopoverHeader>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={translations.generalTabLabel} value="general" />
            <Tab label={translations.recurrenceTabLabel} value="recurrence" />
          </Tabs>
        </Box>
        <GeneralTab
          occurrence={occurrence}
          errors={errors}
          setErrors={setErrors}
          controlled={controlled}
          setControlled={setControlled}
          value={tabValue}
        />
        <RecurrenceTab
          occurrence={occurrence}
          controlled={controlled}
          setControlled={setControlled}
          value={tabValue}
        />
        <Divider />
        <DialogActions>
          <FormActions>
            <Button color="error" type="button" onClick={handleDelete}>
              {translations.deleteEvent}
            </Button>
            <Button variant="contained" type="submit">
              {translations.saveChanges}
            </Button>
          </FormActions>
        </DialogActions>
      </form>
    </DialogContent>
  );
}
