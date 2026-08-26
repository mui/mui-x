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
  TemporalSupportedObject,
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
  isBuiltInEventProperty,
} from '@mui/x-scheduler-internals/internals';
import { useEventEditingStyledContext } from './EventEditingStyledContext';
import { useEventEditingOptionalRenderers } from './EventEditingOptionalRenderersContext';
import type { EventDialogFormValues } from '../event-dialog/utils';
import {
  computeRange,
  findInvalidRangeField,
  getRangeErrorMessage,
  validateRange,
  hasProp,
  BUILT_IN_FORM_KEYS,
} from '../event-dialog/utils';
import EventDialogHeader from '../event-dialog/EventDialogHeader';
import TitleSection from '../event-dialog/TitleSection';
import { GeneralTab } from '../event-dialog/GeneralTab';
import {
  EventDialogFormProvider,
  useEventDialogFormContext,
} from '../event-dialog/form/EventDialogFormContext';
import { eventDialogFormSelectors } from '../event-dialog/form/EventDialogFormStore';
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

  const canHaveMultipleResources = useStore(
    store,
    schedulerEventSelectors.canHaveMultipleResources,
  );
  const isCreating = useStore(store, schedulerOccurrencePlaceholderSelectors.isCreating);

  const defaultRecurrencePresetKey = useStore(
    store,
    schedulerRecurringEventSelectors.defaultPresetKey,
    occurrence.displayTimezone.rrule,
    occurrence.displayTimezone.start,
  );

  // Captured once per editing session, like `initialValues` below.
  // See `getResourceSelectionMode` for the creating-vs-editing rule.
  const resourceSelectionMode = useRefWithInit(() =>
    getResourceSelectionMode(occurrence.resource, canHaveMultipleResources, isCreating),
  ).current;

  // Built once: the provider ignores later values anyway.
  const initialValues = useRefWithInit((): EventDialogFormValues => {
    const fmtDate = (d: SchedulerProcessedDate) => adapter.formatByString(d.value, 'yyyy-MM-dd');
    const fmtTime = (d: SchedulerProcessedDate) => adapter.formatByString(d.value, 'HH:mm');

    const base = occurrence.displayTimezone.rrule;
    // The occurrence only carries the built-in event properties — custom fields
    // come from the raw model. When creating an event there is no model yet.
    const model = schedulerEventSelectors.modelLookup(store.state).get(occurrence.id);
    // Keys holding an explicit `undefined` (e.g. from a spread) would otherwise
    // count as seeded and shadow the field's `defaultValue`.
    const customProperties = Object.fromEntries(
      Object.entries(model ? getCustomEventProperties(model) : {}).filter(
        ([, value]) => value !== undefined,
      ),
    );

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
    <EventDialogFormProvider
      initialValues={initialValues}
      occurrence={occurrence}
      resourceSelectionMode={resourceSelectionMode}
      onValuesChange={pushPlaceholder}
    >
      <FormContentInner {...props} />
    </EventDialogFormProvider>
  );
}

function FormContentInner(props: Omit<FormContentProps, 'occurrence'>) {
  const { onClose, dragHandlerRef, isDraggable } = props;

  // Context hooks
  const adapter = useAdapterContext();
  const { schedulerId, classes, localeText } = useEventEditingStyledContext();
  const store = useSchedulerStoreContext();
  const formStore = useEventDialogFormContext();
  const { occurrence, resourceSelectionMode } = formStore;

  // Selector hooks
  const recurringEventsPlugin = useStore(store, schedulerOtherSelectors.recurringEventsPlugin);
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);
  const showRecurrence = useStore(store, schedulerOtherSelectors.areRecurringEventsAvailable);
  const shouldEventRequireResource = useStore(
    store,
    schedulerOtherSelectors.shouldEventRequireResource,
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

  // Both surfaces unmount the form when the editing session stops, so the cleanup
  // marks the end of the session for submissions still awaiting async validation.
  const isSessionAliveRef = React.useRef(true);
  React.useEffect(() => {
    isSessionAliveRef.current = true;
    return () => {
      isSessionAliveRef.current = false;
    };
  }, []);
  const isSubmittingRef = React.useRef(false);
  // The ref guards synchronous re-entry, the state drives the Save button.
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Dev companion to the submit-level blocks: a custom General tab can omit any
  // built-in section, leaving the stored error with no visible field.
  const warnUnvalidatedField = (field: string, problem: string) => {
    if (process.env.NODE_ENV !== 'production' && !formStore.hasValidator(field)) {
      warnOnce([
        `MUI X Scheduler: ${problem} but no field of the event dialog validates the "${field}" field.`,
        'Saving is still blocked, but the end user may have no visible field to fix it.',
        'Render the missing section in the General tab, or register a validator for the field.',
      ]);
    }
  };

  // Submit-level checks that hold regardless of which sections are mounted.
  const runSubmitChecks = (
    values: EventDialogFormValues,
    start: TemporalSupportedObject,
    end: TemporalSupportedObject,
  ): boolean => {
    const isMissingRequiredResource = shouldEventRequireResource && values.resourceIds.length === 0;
    if (
      isMissingRequiredResource &&
      eventDialogFormSelectors.error(formStore.state, 'resourceIds') === undefined
    ) {
      formStore.setError('resourceIds', localeText.requiredResourceError);
    }

    // Only custom fields can produce unparseable or empty date values.
    const invalidRangeField = findInvalidRangeField(adapter, values, displayTimezone);
    if (invalidRangeField) {
      warnUnvalidatedField(invalidRangeField, 'The value cannot be parsed into a date');
      if (eventDialogFormSelectors.error(formStore.state, invalidRangeField) === undefined) {
        formStore.setError(
          invalidRangeField,
          invalidRangeField === 'startDate' || invalidRangeField === 'endDate'
            ? localeText.invalidDateError
            : localeText.invalidTimeError,
        );
      }
    }

    const rangeError = validateRange(adapter, start, end, values.allDay);
    if (rangeError) {
      warnUnvalidatedField(rangeError.field, 'The date range is invalid');
      // A validator on the same field may have stored a more specific message.
      if (eventDialogFormSelectors.error(formStore.state, rangeError.field) === undefined) {
        formStore.setError(rangeError.field, getRangeErrorMessage(rangeError.field, localeText));
      }
    }

    return !isMissingRequiredResource && !invalidRangeField && !rangeError;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      // Checked on submit rather than on mount: the registry is only complete once
      // every section has run its effects, whatever the composition.
      if (shouldEventRequireResource && !formStore.hasValidator('resourceIds')) {
        warnOnce([
          'MUI X Scheduler: `shouldEventRequireResource` is enabled but no field of the event dialog validates the resource.',
          'Saving without a resource is still blocked, but the end user has no visible field to fix it.',
          'Render the resource section in the General tab, or register a validator for the "resourceIds" field.',
        ]);
      }
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      let isValid: boolean;
      try {
        isValid = await formStore.validateAll();
      } catch (error) {
        // A consumer validator threw or rejected; surface it instead of dying silently.
        if (process.env.NODE_ENV !== 'production') {
          console.error('MUI X Scheduler: A form field validator threw during the submit.', error);
        }
        setTabValue('general');
        return;
      }

      if (!isSessionAliveRef.current) {
        return;
      }

      const values = formStore.state.values;
      const { start, end } = computeRange(adapter, values, displayTimezone);

      if (!runSubmitChecks(values, start, end) || !isValid) {
        // The failing fields render in the General tab.
        setTabValue('general');
        return;
      }

      // Only the custom fields the user actually edited enter the changes payload,
      // so untouched fields keep resolving against the live model on the recurring paths.
      const editedCustomValues = formStore.getDirtyValues(BUILT_IN_FORM_KEYS);
      // A custom field named after a built-in event property (`id`, `readOnly`, ...)
      // must not rewrite it; the hook already warns about these keys in dev.
      for (const key of Object.keys(editedCustomValues)) {
        if (isBuiltInEventProperty(key)) {
          delete editedCustomValues[key];
        }
      }

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

      // Read directly instead of subscribing: the placeholder changes on every
      // creation keystroke and would re-render the whole dialog.
      const rawPlaceholder = schedulerOccurrencePlaceholderSelectors.value(store.state);
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
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
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

  const hasTabs = Boolean(showRecurrence && RecurrenceTabRenderer);

  return (
    <DialogContent className={classes.eventDialogContent}>
      <EventDialogForm onSubmit={handleSubmit} className={classes.eventDialogForm}>
        <EventDialogHeader
          onClose={onClose}
          dragHandlerRef={dragHandlerRef}
          isDraggable={isDraggable}
        >
          <TitleSection />
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
        <GeneralTab value={hasTabs ? tabValue : 'general'} hasTabs={hasTabs} />
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
            // A delete during a pending recurring submit would get its scope
            // operation overwritten by the resolving update.
            disabled={isSubmitting}
          >
            {localeText.deleteEvent}
          </Button>
          <Button
            className={classes.eventDialogSaveButton}
            variant="contained"
            type="submit"
            disabled={isSubmitting}
          >
            {localeText.saveChanges}
          </Button>
        </FormActions>
      </EventDialogForm>
    </DialogContent>
  );
}
