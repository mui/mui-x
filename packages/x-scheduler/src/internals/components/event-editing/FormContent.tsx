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
  TemporalTimezone,
} from '@mui/x-scheduler-internals/models';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
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
  getInvalidValueErrorMessage,
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

// Fields owned by the Recurrence tab; their submit failures must surface there.
const RECURRENCE_FORM_KEYS = new Set(['recurrenceSelection', 'rruleDraft']);

// Scheduler settings read when the async validation resolves; the submit
// continuation must not use the render-time closure values.
interface ResolutionSettings {
  adapter: Adapter;
  displayTimezone: TemporalTimezone;
  shouldEventRequireResource: boolean;
  recurringEventsPlugin: ReturnType<typeof schedulerOtherSelectors.recurringEventsPlugin>;
  showRecurrence: boolean;
  recurrencePresets: ReturnType<typeof schedulerRecurringEventSelectors.presets>;
}

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
  const { schedulerId, classes, localeText } = useEventEditingStyledContext();
  const store = useSchedulerStoreContext();
  const formStore = useEventDialogFormContext();
  const { occurrence, resourceSelectionMode } = formStore;

  // Selector hooks — only what the render itself needs; the submit continuation
  // reads its own `ResolutionSettings` snapshot instead of subscribing here.
  const recurringEventsPlugin = useStore(store, schedulerOtherSelectors.recurringEventsPlugin);
  const showRecurrence = useStore(store, schedulerOtherSelectors.areRecurringEventsAvailable);
  const shouldEventRequireResource = useStore(
    store,
    schedulerOtherSelectors.shouldEventRequireResource,
  );

  // Optional renderer hooks
  const { recurrenceTab: RecurrenceTabRenderer } = useEventEditingOptionalRenderers();

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
  // The ref guards synchronous re-entry; the store's isSubmitting drives the
  // action buttons without re-rendering the sections (a section re-render would
  // churn its inline validator identities mid-validation).
  const isSubmittingRef = React.useRef(false);

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
  // `current` is the settings snapshot taken when the validation resolved: the
  // closure values may predate an async validation.
  const runSubmitChecks = (
    values: EventDialogFormValues,
    start: TemporalSupportedObject,
    end: TemporalSupportedObject,
    current: ResolutionSettings,
  ): boolean => {
    const isMissingRequiredResource =
      current.shouldEventRequireResource && values.resourceIds.length === 0;
    if (
      isMissingRequiredResource &&
      eventDialogFormSelectors.error(formStore.state, 'resourceIds') === undefined
    ) {
      formStore.setError('resourceIds', localeText.requiredResourceError);
    }

    // Only custom fields can produce unparseable or empty date values.
    const invalidRangeField = findInvalidRangeField(
      current.adapter,
      values,
      current.displayTimezone,
    );
    if (invalidRangeField) {
      warnUnvalidatedField(invalidRangeField, 'The value cannot be parsed into a date');
      if (eventDialogFormSelectors.error(formStore.state, invalidRangeField) === undefined) {
        formStore.setError(
          invalidRangeField,
          getInvalidValueErrorMessage(invalidRangeField, localeText),
        );
      }
    }

    // An invalid field already blocks; the ordering verdict would compare
    // against the computeRange fallback and blame a healthy field.
    const rangeError = invalidRangeField
      ? null
      : validateRange(current.adapter, start, end, values.allDay);
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
    formStore.setSubmitting(true);
    try {
      let isValid: boolean;
      try {
        isValid = await formStore.validateAll();
      } catch (error) {
        // Recover the dialog and warn, like the grid does for processRowUpdate errors.
        if (isSessionAliveRef.current) {
          setTabValue('general');
        }
        if (process.env.NODE_ENV !== 'production') {
          warnOnce([
            'MUI X Scheduler: A form field validator threw or rejected during the submit.',
            'The submit was aborted and no error was stored on the form.',
            'Handle failures inside the validator and return the error message instead.',
          ]);
        }
        return;
      }

      if (!isSessionAliveRef.current) {
        return;
      }

      // The async validation may outlive the render that captured this closure and
      // already re-runs against the current rules, so the checks and the
      // serialization read one current snapshot of the scheduler settings too.
      const current: ResolutionSettings = {
        adapter: store.state.adapter,
        displayTimezone: schedulerOtherSelectors.displayTimezone(store.state),
        shouldEventRequireResource: schedulerOtherSelectors.shouldEventRequireResource(store.state),
        recurringEventsPlugin: schedulerOtherSelectors.recurringEventsPlugin(store.state),
        showRecurrence: schedulerOtherSelectors.areRecurringEventsAvailable(store.state),
        recurrencePresets: schedulerRecurringEventSelectors.presets(
          store.state,
          occurrence.displayTimezone.start,
        ),
      };

      const values = formStore.state.values;
      // Read directly instead of subscribing: the placeholder changes on every
      // creation keystroke and would re-render the whole dialog.
      const rawPlaceholder = schedulerOccurrencePlaceholderSelectors.value(store.state);
      const isCreation = rawPlaceholder?.type === 'creation';
      // Edits anchor all-day bounds to the event's own timezone; a creation has no
      // event timezone yet and stays on the display one.
      const allDayTimezone = isCreation
        ? current.displayTimezone
        : schedulerEventSelectors.dataTimezone(store.state, occurrence.id);
      const { start, end } = computeRange(
        current.adapter,
        values,
        current.displayTimezone,
        allDayTimezone,
      );

      if (!runSubmitChecks(values, start, end, current) || !isValid) {
        // Show the tab owning a failing field; General wins when both tabs fail.
        const failingKeys = Object.keys(formStore.state.errors);
        const onlyRecurrenceFails =
          failingKeys.length > 0 && failingKeys.every((key) => RECURRENCE_FORM_KEYS.has(key));
        setTabValue(onlyRecurrenceFails ? 'recurrence' : 'general');
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
      if (!current.showRecurrence || !current.recurrencePresets) {
        rruleToSubmit = undefined;
      } else if (values.recurrenceSelection === null) {
        rruleToSubmit = undefined;
      } else if (values.recurrenceSelection === 'custom') {
        rruleToSubmit = values.rruleDraft;
      } else {
        rruleToSubmit = current.recurrencePresets[values.recurrenceSelection];
      }

      if (isCreation) {
        store.createEvent({
          ...metaChanges,
          start,
          end,
          rrule: rruleToSubmit,
        });
      } else if (
        current.showRecurrence &&
        current.recurringEventsPlugin &&
        occurrence.displayTimezone.rrule
      ) {
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
      // A store write is safe after unmount, unlike the React state update it
      // replaced (React 17, still supported, warns on those).
      formStore.setSubmitting(false);
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

  // The browser blocks a native submit over an invalid control and tries to focus
  // it, which fails when the control is hidden in an inactive tab; showing its
  // panel lets the next attempt reach the field. Only the first invalid control of
  // a submit attempt decides, matching the one the browser focuses.
  const invalidTabHandledRef = React.useRef(false);
  const handleFormInvalid = (event: React.FormEvent<HTMLFormElement>) => {
    if (invalidTabHandledRef.current) {
      return;
    }
    invalidTabHandledRef.current = true;
    // The invalid events of one validation run fire synchronously.
    queueMicrotask(() => {
      invalidTabHandledRef.current = false;
    });
    const panel = (event.target as HTMLElement).closest('[role="tabpanel"]');
    setTabValue(panel?.id === `${schedulerId}-recurrence-tabpanel` ? 'recurrence' : 'general');
  };

  const hasTabs = Boolean(showRecurrence && RecurrenceTabRenderer);

  return (
    <DialogContent className={classes.eventDialogContent}>
      <EventDialogForm
        onSubmit={handleSubmit}
        onInvalidCapture={handleFormInvalid}
        className={classes.eventDialogForm}
      >
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
        <FormActionButtons onDelete={handleDelete} />
      </EventDialogForm>
    </DialogContent>
  );
}

// Subscribes to isSubmitting on its own so a submit only re-renders the buttons.
function FormActionButtons(props: { onDelete: () => void }) {
  const { classes, localeText } = useEventEditingStyledContext();
  const formStore = useEventDialogFormContext();
  const isSubmitting = useStore(formStore, eventDialogFormSelectors.isSubmitting);

  return (
    <FormActions className={classes.eventDialogFormActions}>
      <Button
        className={classes.eventDialogDeleteButton}
        color="error"
        type="button"
        onClick={props.onDelete}
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
  );
}
