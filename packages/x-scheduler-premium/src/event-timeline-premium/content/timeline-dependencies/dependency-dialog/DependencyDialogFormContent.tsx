'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
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
  focusFirstInvalid,
  SchedulerFormStore,
  schedulerFormSelectors,
  useSchedulerFormField,
} from '@mui/x-scheduler/internals';
import { useEventTimelinePremiumStyledContext } from '../../../EventTimelinePremiumStyledContext';
import {
  DEPENDENCY_LAG_UNIT_KEYS,
  DEPENDENCY_LAG_UNITS,
  DEPENDENCY_TYPES,
  DEPENDENCY_UPDATE_REJECTION_KEYS,
  getAllDayLagNote,
  getDependencyTypeLabel,
  isSameLag,
  isValidLagAmount,
  toLagDraft,
} from './dependencyDialogUtils';
import type { DependencyFormValues } from './dependencyDialogUtils';
import {
  DependencyDialogBody,
  DependencyDialogDetails,
  DependencyDialogEndpoints,
} from './DependencyDialogDetails';
import type { DependencyDialogViewProps } from './DependencyDialogDetails';
import {
  DependencyDialogActions,
  DependencyDialogForm,
  DependencyDialogHeader,
} from './DependencyDialogLayout';

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
  const { schedulerId, classes, localeText } = useEventTimelinePremiumStyledContext();
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
  // Stable: a new validator restarts a pending validation, and an inline `localeText` changes
  // on every render.
  const validateLagAmount = useStableCallback((lagAmount: string, values: DependencyFormValues) =>
    isValidLagAmount(lagAmount, values.lagUnit) ? null : localeText.dependencyInvalidLagError,
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
    lagAmountField.error ?? getAllDayLagNote(localeText, draftLag, effectiveLag);

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
      // Only write what the user changed: a value changed in the props while the dialog is
      // open stays, and an untouched lag keeps its original form.
      const isTypeChanged = 'type' in formStore.getDirtyValues();
      const isLagChanged = !isSameLag(submittedLag, initialLag);
      const result = store.updateDependency(dependency.id, {
        ...(isTypeChanged ? { type: values.type } : null),
        ...(isLagChanged ? { lag: submittedLag?.amount, lagUnit: submittedLag?.unit } : null),
      });
      // `featureDisabled` can't happen: the dialog only exists when the dependencies feature is provided.
      if (result.status === 'rejected' && result.reason !== 'featureDisabled') {
        // On the field that caused it (Type by default), like the event form.
        const isLagRejected =
          (result.reason === 'cascadeBlocked' || result.reason === 'datesNotWritable') &&
          isLagChanged;
        ReactDOM.flushSync(() =>
          formStore.setError(
            isLagRejected ? 'lagAmount' : 'type',
            localeText[DEPENDENCY_UPDATE_REJECTION_KEYS[result.reason]],
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
    <DependencyDialogForm onSubmit={handleSubmit} className={classes.dependencyDialogForm}>
      <DependencyDialogHeader onClose={onClose} dragHandlerRef={dragHandlerRef}>
        <Typography variant="h6" id={titleId} className={classes.dependencyDialogTitle}>
          {localeText.dependencyEditTitle}
        </Typography>
      </DependencyDialogHeader>
      <DependencyDialogBody className={classes.dependencyDialogBody}>
        <DependencyDialogDetails className={classes.dependencyDialogDetails}>
          <DependencyDialogEndpoints {...props} />
        </DependencyDialogDetails>
        <FormControl fullWidth size="small" error={typeField.error !== undefined}>
          <InputLabel id={typeLabelId}>{localeText.dependencyTypeLabel}</InputLabel>
          <Select
            labelId={typeLabelId}
            label={localeText.dependencyTypeLabel}
            value={typeField.value}
            aria-describedby={typeField.error === undefined ? undefined : typeHelperId}
            onChange={(event) => typeField.setValue(event.target.value as SchedulerDependencyType)}
          >
            {DEPENDENCY_TYPES.map((option) => (
              <MenuItem key={option} value={option}>
                {getDependencyTypeLabel(localeText, option)}
              </MenuItem>
            ))}
          </Select>
          {typeField.error !== undefined && (
            <FormHelperText id={typeHelperId}>{typeField.error}</FormHelperText>
          )}
        </FormControl>
        <DependencyDialogLag
          id={lagId}
          className={classes.dependencyDialogLag}
          fullWidth
          size="small"
          label={localeText.dependencyLagLabel}
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
                    className={classes.dependencyDialogLagUnit}
                    variant="standard"
                    disableUnderline
                    value={lagUnitField.value}
                    inputProps={{ 'aria-label': localeText.dependencyLagUnitAriaLabel }}
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
                        {localeText[DEPENDENCY_LAG_UNIT_KEYS[option]]}
                      </MenuItem>
                    ))}
                  </DependencyDialogLagUnit>
                </InputAdornment>
              ),
            },
          }}
        />
      </DependencyDialogBody>
      <Divider className={classes.dependencyDialogDivider} />
      <DependencyDialogActions className={classes.dependencyDialogActions}>
        <Button color="error" type="button" onClick={handleDelete} disabled={isSubmitting}>
          {localeText.deleteDependency}
        </Button>
        <Button variant="contained" type="submit" disabled={isSubmitting}>
          {localeText.saveChanges}
        </Button>
      </DependencyDialogActions>
    </DependencyDialogForm>
  );
}
