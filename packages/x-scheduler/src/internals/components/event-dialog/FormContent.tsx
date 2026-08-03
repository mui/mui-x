'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import MuiDialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import { inputBaseClasses } from '@mui/material/InputBase';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import type {
  SchedulerEventUpdatedProperties,
  SchedulerProcessedDate,
  RecurringEventFrequency,
  SchedulerProcessedEventRecurrenceRule,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler-internals/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import {
  schedulerEventSelectors,
  schedulerOccurrencePlaceholderSelectors,
  schedulerOtherSelectors,
  schedulerRecurringEventSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import {
  getCustomEventProperties,
  getPrimaryResourceId,
} from '@mui/x-scheduler-internals/internals';
import { useEventDialogStyledContext } from './EventDialogStyledContext';
import { useEventDialogOptionalRenderers } from './EventDialogOptionalRenderersContext';
import type { EventDialogFormValues } from './utils';
import { computeRange, hasProp, BUILT_IN_FORM_KEYS } from './utils';
import EventDialogHeader from './EventDialogHeader';
import { GeneralTab } from './GeneralTab';
import { EventDialogFormProvider, useEventDialogFormContext } from './form/EventDialogFormContext';
import { useField } from './form/useField';
import { usePushPlaceholder } from './usePushPlaceholder';

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
  [`& .${inputBaseClasses.root}`]: {
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

const EventDialogTabsContainer = styled('div', {
  name: 'MuiEventDialog',
  slot: 'TabsContainer',
})(({ theme }) => ({
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

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
  const { occurrence } = props;

  const adapter = useAdapterContext();
  const store = useSchedulerStoreContext();
  const pushPlaceholder = usePushPlaceholder();

  const defaultRecurrencePresetKey = useStore(
    store,
    schedulerRecurringEventSelectors.defaultPresetKey,
    occurrence.displayTimezone.rrule,
    occurrence.displayTimezone.start,
  );

  const initialValues = useRefWithInit((): EventDialogFormValues => {
    const fmtDate = (d: SchedulerProcessedDate) => adapter.formatByString(d.value, 'yyyy-MM-dd');
    const fmtTime = (d: SchedulerProcessedDate) => adapter.formatByString(d.value, 'HH:mm');

    const base = occurrence.displayTimezone.rrule;
    // The occurrence only carries the built-in event properties — custom fields
    // come from the raw model. When creating an event there is no model yet.
    const model = schedulerEventSelectors.modelLookup(store.state).get(occurrence.id);

    return {
      ...(model ? getCustomEventProperties(model) : {}),
      title: occurrence.title,
      description: hasProp(occurrence, 'description') ? (occurrence.description ?? '') : '',
      startDate: fmtDate(occurrence.displayTimezone.start),
      endDate: fmtDate(occurrence.displayTimezone.end),
      startTime: fmtTime(occurrence.displayTimezone.start),
      endTime: fmtTime(occurrence.displayTimezone.end),
      resourceId: getPrimaryResourceId(occurrence.resource),
      allDay: !!occurrence.allDay,
      color: hasProp(occurrence, 'color') ? occurrence.color : null,
      recurrenceSelection: defaultRecurrencePresetKey,
      rruleDraft: {
        freq: (base?.freq ?? 'WEEKLY') as RecurringEventFrequency,
        interval: base?.interval ?? 1,
        byDay: base?.byDay ?? [],
        byMonthDay: base?.byMonthDay ?? [],
        ...(base?.count ? { count: base.count } : {}),
        ...(base?.until ? { until: base.until } : {}),
      },
    };
  }).current;

  return (
    <EventDialogFormProvider initialValues={initialValues} onValuesChange={pushPlaceholder}>
      <FormContentInner {...props} />
    </EventDialogFormProvider>
  );
}

function FormContentInner(props: FormContentProps) {
  const { occurrence, onClose, dragHandlerRef } = props;

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
  const rawPlaceholder = useStore(store, schedulerOccurrencePlaceholderSelectors.value);
  const recurringEventsPlugin = useStore(store, schedulerOtherSelectors.recurringEventsPlugin);
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);
  const showRecurrence = useStore(store, schedulerOtherSelectors.areRecurringEventsAvailable);

  // Optional renderer hooks
  const { recurrenceTab: RecurrenceTabRenderer } = useEventDialogOptionalRenderers();

  const recurrencePresets = useStore(
    store,
    schedulerRecurringEventSelectors.presets,
    occurrence.displayTimezone.start,
  );

  const titleInputRef = React.useCallback((input: HTMLInputElement | null) => input?.focus(), []);

  // State hooks
  const [tabValue, setTabValue] = React.useState('general');
  const title = useField<string>('title');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formStore.validateAll()) {
      return;
    }

    const values = formStore.state.values as EventDialogFormValues;
    const { start, end } = computeRange(adapter, values, displayTimezone);

    // Only the custom fields the user actually edited enter the changes payload,
    // so untouched fields keep resolving against the live model on the recurring paths.
    const editedCustomValues = formStore.getDirtyValues(BUILT_IN_FORM_KEYS);

    const metaChanges = {
      ...editedCustomValues,
      title: values.title.trim(),
      description: values.description.trim(),
      allDay: values.allDay,
      resource: values.resourceId === null ? undefined : values.resourceId,
      color: values.color === null ? undefined : values.color,
    };

    let rruleToSubmit: SchedulerProcessedEventRecurrenceRule | undefined;
    if (!showRecurrence || !recurrencePresets) {
      rruleToSubmit = undefined;
    } else if (values.recurrenceSelection === null) {
      rruleToSubmit = undefined;
    } else if (values.recurrenceSelection === 'custom') {
      rruleToSubmit = values.rruleDraft;
    } else {
      rruleToSubmit = recurrencePresets[values.recurrenceSelection];
    }

    if (rawPlaceholder?.type === 'creation') {
      store.createEvent({
        ...metaChanges,
        start,
        end,
        rrule: rruleToSubmit,
      });
    } else if (showRecurrence && recurringEventsPlugin && occurrence.displayTimezone.rrule) {
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
    if (showRecurrence && recurringEventsPlugin && occurrence.displayTimezone.rrule) {
      store.deleteRecurringEvent({
        occurrenceStart: occurrence.displayTimezone.start.value,
        eventId: occurrence.id,
        onSubmit: onClose,
      });

      // don't close the dialog
      return;
    }

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
            id={`${schedulerId}-event-dialog-title`}
            style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
          >
            {occurrence.title}
          </span>
          <EventDialogTitleTextField
            name="title"
            value={title.value}
            onChange={(event) => title.setValue(event.target.value)}
            required
            inputRef={titleInputRef}
            slotProps={{
              input: {
                readOnly: isPropertyReadOnly('title'),
                'aria-label': localeText.eventTitleAriaLabel,
              },
              formHelperText: { role: 'alert' },
            }}
            error={!!title.error}
            helperText={title.error}
            fullWidth
            size="small"
          />
        </EventDialogHeader>
        {showRecurrence && RecurrenceTabRenderer && (
          <EventDialogTabsContainer className={classes.eventDialogTabsContainer}>
            <EventDialogTabs value={tabValue} onChange={handleTabChange}>
              <Tab
                id={`${schedulerId}-general-tab`}
                className={classes.eventDialogTab}
                label={localeText.generalTabLabel}
                value="general"
              />
              <Tab
                id={`${schedulerId}-recurrence-tab`}
                className={classes.eventDialogTab}
                label={localeText.recurrenceTabLabel}
                value="recurrence"
              />
            </EventDialogTabs>
          </EventDialogTabsContainer>
        )}
        <GeneralTab
          occurrence={occurrence}
          value={showRecurrence && RecurrenceTabRenderer ? tabValue : 'general'}
        />
        {showRecurrence && RecurrenceTabRenderer && (
          <RecurrenceTabRenderer occurrence={occurrence} tabValue={tabValue} />
        )}
        <Divider className={classes.eventDialogFormDivider} />
        <FormActions className={classes.eventDialogFormActions}>
          <Button
            className={classes.eventDialogDeleteButton}
            color="error"
            type="button"
            onClick={handleDelete}
          >
            {localeText.deleteEvent}
          </Button>
          <Button className={classes.eventDialogSaveButton} variant="contained" type="submit">
            {localeText.saveChanges}
          </Button>
        </FormActions>
      </EventDialogForm>
    </DialogContent>
  );
}
