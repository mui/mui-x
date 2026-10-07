'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import type {
  SchedulerDependencyLagUnit,
  SchedulerDependencyType,
} from '@mui/x-scheduler-internals-premium/models';
import {
  getDependencyLag,
  getEffectiveDependencyLag,
} from '@mui/x-scheduler-internals-premium/internals';
import {
  EventDialogForm,
  EventDialogFormActions,
  EventDialogHeader,
  focusFirstInvalid,
  SchedulerFormStore,
  schedulerFormSelectors,
  useEventEditingStyledContext,
  useSchedulerFormField,
} from '@mui/x-scheduler/internals';
import {
  DEPENDENCY_DIALOG_TEXT,
  DEPENDENCY_LAG_UNIT_LABELS,
  DEPENDENCY_LAG_UNITS,
  DEPENDENCY_TYPE_LABELS,
  DEPENDENCY_TYPES,
  getAllDayLagNote,
  isSameLag,
  toLagDraft,
  UPDATE_REJECTION_MESSAGES,
  validateLagAmount,
} from './dependencyDialogUtils';
import type { DependencyFormValues } from './dependencyDialogUtils';
import {
  DependencyDialogBody,
  DependencyDialogDetails,
  DependencyDialogEndpoints,
} from './DependencyDialogDetails';
import type { DependencyDialogViewProps } from './DependencyDialogDetails';

// Same right inset as the Type select, so both arrows line up.
const DependencyDialogLag = styled(TextField, {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogLag',
})({
  [`& .${outlinedInputClasses.root}`]: {
    paddingRight: 7,
  },
});

const DependencyDialogLagUnit = styled(Select, {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogLagUnit',
})({
  '& .MuiSelect-select:focus': {
    backgroundColor: 'transparent',
  },
});

export function DependencyDialogFormContent(props: DependencyDialogViewProps) {
  const { dependency, titleId, dragHandlerRef, onClose } = props;
  const store = useEventTimelinePremiumStoreContext();
  const { schedulerId, classes, localeText } = useEventEditingStyledContext();
  const isTargetAllDay = useStore(
    store,
    (state) => schedulerEventSelectors.processedEvent(state, dependency.target)?.allDay ?? false,
  );
  // A lag the engine ignores (invalid in the props) shows as unset.
  const [initialLag] = React.useState(() => getDependencyLag(dependency));
  const [formStore] = React.useState(
    () =>
      new SchedulerFormStore<DependencyFormValues>({
        type: dependency.type,
        lagAmount: initialLag === null ? '' : String(initialLag.amount),
        lagUnit: initialLag?.unit ?? 'day',
      }),
  );
  const typeField = useSchedulerFormField<DependencyFormValues, SchedulerDependencyType>(
    formStore,
    'type',
  );
  const lagUnitField = useSchedulerFormField<DependencyFormValues, SchedulerDependencyLagUnit>(
    formStore,
    'lagUnit',
  );
  const lagAmountField = useSchedulerFormField<DependencyFormValues, string>(
    formStore,
    'lagAmount',
    { validate: validateLagAmount },
  );
  const isSubmitting = useStore(formStore, schedulerFormSelectors.isSubmitting);

  // Like the event form: a dialog closed while the validation is pending must not save.
  const isSessionAliveRef = React.useRef(true);
  React.useEffect(() => {
    isSessionAliveRef.current = true;
    return () => {
      isSessionAliveRef.current = false;
    };
  }, []);

  const typeLabelId = `${schedulerId}-dependency-dialog-type-label`;
  const typeHelperId = `${schedulerId}-dependency-dialog-type-helper-text`;
  const lagId = `${schedulerId}-dependency-dialog-lag`;
  const lagHelperId = `${lagId}-helper-text`;

  const draft = toLagDraft(lagAmountField.value, lagUnitField.value);
  const draftLag = getDependencyLag(draft);
  const effectiveLag = getEffectiveDependencyLag(draft, isTargetAllDay);
  const lagHelperText: React.ReactNode =
    lagAmountField.error ?? getAllDayLagNote(draftLag, effectiveLag);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formStore.state.isSubmitting) {
      return;
    }
    const form = event.currentTarget;
    formStore.setSubmitting(true);
    try {
      const isValid = await formStore.validateAll();
      if (!isSessionAliveRef.current) {
        return;
      }
      if (!isValid) {
        // Rendered synchronously so the error is in the DOM to take the focus.
        ReactDOM.flushSync(() => {});
        focusFirstInvalid(form);
        return;
      }
      const { values } = formStore.state;
      const submittedLag = getDependencyLag(toLagDraft(values.lagAmount, values.lagUnit));
      // Only write the lag if the user changed it, so an untouched one stays as is.
      const isLagChanged = !isSameLag(submittedLag, initialLag);
      const result = store.updateDependency(
        dependency.id,
        isLagChanged
          ? { type: values.type, lag: submittedLag?.amount, lagUnit: submittedLag?.unit }
          : { type: values.type },
      );
      if (result.status === 'rejected') {
        // On the field that caused it (Type by default), like the event form.
        const isLagRejected = result.reason === 'cascadeBlocked' && isLagChanged;
        ReactDOM.flushSync(() =>
          formStore.setError(
            isLagRejected ? 'lagAmount' : 'type',
            UPDATE_REJECTION_MESSAGES[result.reason],
          ),
        );
        focusFirstInvalid(form);
        return;
      }
      onClose();
    } finally {
      formStore.setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (store.deleteDependency(dependency.id)) {
      onClose();
    }
  };

  return (
    <EventDialogForm onSubmit={handleSubmit} className={classes.eventDialogForm}>
      <EventDialogHeader onClose={onClose} dragHandlerRef={dragHandlerRef}>
        <Typography variant="h6" id={titleId} className={classes.eventDialogTitle}>
          {DEPENDENCY_DIALOG_TEXT.editTitle}
        </Typography>
      </EventDialogHeader>
      <DependencyDialogBody>
        <DependencyDialogDetails>
          <DependencyDialogEndpoints {...props} />
        </DependencyDialogDetails>
        <FormControl fullWidth size="small" error={typeField.error !== undefined}>
          <InputLabel id={typeLabelId}>{DEPENDENCY_DIALOG_TEXT.typeLabel}</InputLabel>
          <Select
            labelId={typeLabelId}
            label={DEPENDENCY_DIALOG_TEXT.typeLabel}
            value={typeField.value}
            aria-describedby={typeField.error === undefined ? undefined : typeHelperId}
            onChange={(event) => typeField.setValue(event.target.value as SchedulerDependencyType)}
          >
            {DEPENDENCY_TYPES.map((option) => (
              <MenuItem key={option} value={option}>
                {DEPENDENCY_TYPE_LABELS[option]}
              </MenuItem>
            ))}
          </Select>
          {typeField.error !== undefined && (
            <FormHelperText id={typeHelperId}>{typeField.error}</FormHelperText>
          )}
        </FormControl>
        <DependencyDialogLag
          id={lagId}
          fullWidth
          size="small"
          label={DEPENDENCY_DIALOG_TEXT.lagLabel}
          value={lagAmountField.value}
          placeholder="0"
          error={lagAmountField.error !== undefined}
          helperText={lagHelperText}
          onChange={(event) => lagAmountField.setValue(event.target.value)}
          slotProps={{
            // Keep the label up so the placeholder shows.
            inputLabel: { shrink: true },
            // Not `type="number"`: it changes on wheel and has its own validation.
            htmlInput: { inputMode: 'numeric' },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <DependencyDialogLagUnit
                    variant="standard"
                    disableUnderline
                    value={lagUnitField.value}
                    inputProps={{ 'aria-label': DEPENDENCY_DIALOG_TEXT.lagUnitLabel }}
                    SelectDisplayProps={{
                      'aria-describedby': lagHelperText === null ? undefined : lagHelperId,
                    }}
                    onChange={(event) => {
                      lagUnitField.setValue(event.target.value as SchedulerDependencyLagUnit);
                      // The unit is part of the lag value: check it again.
                      if (lagAmountField.error !== undefined) {
                        formStore.setError(
                          'lagAmount',
                          validateLagAmount(lagAmountField.value, formStore.state.values),
                        );
                      }
                    }}
                  >
                    {DEPENDENCY_LAG_UNITS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {DEPENDENCY_LAG_UNIT_LABELS[option]}
                      </MenuItem>
                    ))}
                  </DependencyDialogLagUnit>
                </InputAdornment>
              ),
            },
          }}
        />
      </DependencyDialogBody>
      <Divider className={classes.eventDialogFormDivider} />
      <EventDialogFormActions className={classes.eventDialogFormActions}>
        <Button color="error" type="button" onClick={handleDelete} disabled={isSubmitting}>
          {DEPENDENCY_DIALOG_TEXT.delete}
        </Button>
        <Button variant="contained" type="submit" disabled={isSubmitting}>
          {localeText.saveChanges}
        </Button>
      </EventDialogFormActions>
    </EventDialogForm>
  );
}
