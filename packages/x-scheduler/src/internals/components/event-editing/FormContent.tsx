'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { warnOnce } from '@mui/x-internals/warning';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import MuiDialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
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
  getEventResourceIds,
  getResourceSelectionMode,
} from '@mui/x-scheduler-internals/internals';
import { useEventEditingStyledContext } from './EventEditingStyledContext';
import { useEventEditingOptionalRenderers } from './EventEditingOptionalRenderersContext';
import type { EventDialogFormValues } from '../event-dialog/utils';
import { computeRange, hasProp, BUILT_IN_FORM_KEYS } from '../event-dialog/utils';
import EventDialogHeader from '../event-dialog/EventDialogHeader';
import TitleSection from '../event-dialog/TitleSection';
import { GeneralTab } from '../event-dialog/GeneralTab';
import {
  EventDialogFormProvider,
  useEventDialogFormContext,
} from '../event-dialog/form/EventDialogFormContext';
import { usePushPlaceholder } from '../event-dialog/usePushPlaceholder';

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
  // Shrink to fit the paper (capped at the viewport) so the form doesn't overflow on mobile screens.
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  maxHeight: '100%',
});

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
  /**
   * Whether the header acts as a drag handle. `false` for the non-draggable mobile drawer.
   * @default true
   */
  isDraggable?: boolean;
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

  // Built once: the provider ignores later values anyway, and this component
  // re-renders on every placeholder push during creation (`usePushPlaceholder`
  // subscribes it to the placeholder).
  const initialValues = useRefWithInit((): EventDialogFormValues => {
    const fmtDate = (d: SchedulerProcessedDate) => adapter.formatByString(d.value, 'yyyy-MM-dd');
    const fmtTime = (d: SchedulerProcessedDate) => adapter.formatByString(d.value, 'HH:mm');

    const base = occurrence.displayTimezone.rrule;
    // The occurrence only carries the built-in event properties — custom fields
    // come from the raw model. When creating an event there is no model yet.
    const model = schedulerEventSelectors.modelLookup(store.state).get(occurrence.id);
    const customProperties = model ? getCustomEventProperties(model) : {};

    if (process.env.NODE_ENV !== 'production') {
      for (const key of Object.keys(customProperties)) {
        if (BUILT_IN_FORM_KEYS.has(key)) {
          warnOnce([
            `MUI X Scheduler: The event model contains a custom property "${key}" that collides with a built-in form key.`,
            'The form seeds that key from the event dates and resource, so the custom property cannot be read or written through the form.',
            'Rename the property in the event model to avoid the collision.',
          ]);
        }
      }
    }

    return {
      ...customProperties,
      title: occurrence.title,
      description: hasProp(occurrence, 'description') ? (occurrence.description ?? '') : '',
      startDate: fmtDate(occurrence.displayTimezone.start),
      endDate: fmtDate(occurrence.displayTimezone.end),
      startTime: fmtTime(occurrence.displayTimezone.start),
      endTime: fmtTime(occurrence.displayTimezone.end),
      resourceIds: getEventResourceIds(occurrence.resource),
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
  const { occurrence, onClose, dragHandlerRef, isDraggable } = props;

  // Context hooks
  const adapter = useAdapterContext();
  const { schedulerId, classes, localeText } = useEventEditingStyledContext();
  const store = useSchedulerStoreContext();
  const formStore = useEventDialogFormContext();

  // Selector hooks
  const rawPlaceholder = useStore(store, schedulerOccurrencePlaceholderSelectors.value);
  const recurringEventsPlugin = useStore(store, schedulerOtherSelectors.recurringEventsPlugin);
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);
  const showRecurrence = useStore(store, schedulerOtherSelectors.areRecurringEventsAvailable);
  const canHaveMultipleResources = useStore(
    store,
    schedulerEventSelectors.canHaveMultipleResources,
  );

  // Optional renderer hooks
  const { recurrenceTab: RecurrenceTabRenderer } = useEventEditingOptionalRenderers();

  const recurrencePresets = useStore(
    store,
    schedulerRecurringEventSelectors.presets,
    occurrence.displayTimezone.start,
  );

  // State hooks
  const [tabValue, setTabValue] = React.useState('general');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!(await formStore.validateAll())) {
      return;
    }

    const values = formStore.state.values;
    const { start, end } = computeRange(adapter, values, displayTimezone);

    // Only the custom fields the user actually edited enter the changes payload,
    // so untouched fields keep resolving against the live model on the recurring paths.
    const editedCustomValues = formStore.getDirtyValues(BUILT_IN_FORM_KEYS);

    // Saving never changes the shape of `resource`: single mode writes back the plain id (or
    // `undefined` once cleared), multiple mode writes back the array (`[]` once cleared). The
    // mode itself follows the occurrence's own resource shape, only falling back to
    // `canHaveMultipleResources` when that occurrence never had one to begin with.
    const resourceSelectionMode = getResourceSelectionMode(
      occurrence.resource,
      canHaveMultipleResources,
    );
    const metaChanges = {
      ...editedCustomValues,
      title: values.title.trim(),
      description: values.description.trim(),
      allDay: values.allDay,
      resource: resourceSelectionMode === 'multiple' ? values.resourceIds : values.resourceIds[0],
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
      store.updateEvent({ ...metaChanges, id: occurrence.id, start, end, rrule: rruleToSubmit });
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
        <EventDialogHeader
          onClose={onClose}
          dragHandlerRef={dragHandlerRef}
          isDraggable={isDraggable}
        >
          <TitleSection occurrence={occurrence} />
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
