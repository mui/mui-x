'use client';
import * as React from 'react';
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
import { eventTimelinePremiumDependencySelectors } from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import type {
  SchedulerDependency,
  SchedulerDependencyEditor,
  SchedulerDependencyLagUnit,
  SchedulerDependencyType,
  SchedulerResolvedDependencyLag,
  SchedulerUpdateDependencyResult,
} from '@mui/x-scheduler-internals-premium/models';
import {
  getDependencyLag,
  getDependencyLagIssue,
  getEffectiveDependencyLag,
} from '@mui/x-scheduler-internals-premium/internals';
import {
  EventDialogDraggablePaper,
  EventDialogForm,
  EventDialogFormActions,
  EventDialogFormContent,
  EventDialogHeader,
  EventDialogRoot,
  getPaletteVariants,
  SchedulerFormStore,
  schedulerFormSelectors,
  useEventEditingStyledContext,
  useSchedulerFormField,
} from '@mui/x-scheduler/internals';
import type { EventDialogDraggablePaperProps } from '@mui/x-scheduler/internals';
import { useDependencyGeometry } from './EventTimelinePremiumDependencyGeometry';

// TODO(dependencies public flip, #23420): move to localeText.
const DEPENDENCY_DIALOG_TEXT = {
  editTitle: 'Edit dependency',
  detailsTitle: 'Dependency details',
  sourceLabel: 'From',
  targetLabel: 'To',
  typeLabel: 'Type',
  lagLabel: 'Lag',
  lagUnitLabel: 'Lag unit',
  noLag: 'None',
  invalidLag: 'Enter a whole number, 0 or more.',
  allDayLagIgnored: 'An all-day event can only wait whole days, so this lag adds no wait.',
  allDayLagRounded: (lag: string) => `An all-day event can only wait whole days: ${lag}.`,
  delete: 'Delete',
};

// TODO(dependencies public flip, #23420): move to localeText.
const DEPENDENCY_LAG_UNIT_LABELS: Record<SchedulerDependencyLagUnit, string> = {
  minute: 'minutes',
  hour: 'hours',
  day: 'days',
  week: 'weeks',
};

const DEPENDENCY_LAG_UNITS = Object.keys(
  DEPENDENCY_LAG_UNIT_LABELS,
) as SchedulerDependencyLagUnit[];

// TODO(dependencies public flip, #23420): move to localeText.
function formatLag(lag: SchedulerResolvedDependencyLag) {
  return `${lag.amount} ${lag.unit}${lag.amount === 1 ? '' : 's'}`;
}

interface DependencyFormValues extends Record<string, unknown> {
  type: SchedulerDependencyType;
  // Kept as typed, so the field can be emptied.
  lagAmount: string;
  lagUnit: SchedulerDependencyLagUnit;
}

function toLagDraft(lagAmount: string, lagUnit: SchedulerDependencyLagUnit) {
  return { lag: lagAmount.trim() === '' ? 0 : Number(lagAmount), lagUnit };
}

// Module level so its identity is stable: a new validator restarts a pending validation.
function validateLagAmount(lagAmount: string, values: DependencyFormValues) {
  return getDependencyLagIssue(toLagDraft(lagAmount, values.lagUnit)) === null
    ? null
    : DEPENDENCY_DIALOG_TEXT.invalidLag;
}

function isSameLag(
  a: SchedulerResolvedDependencyLag | null,
  b: SchedulerResolvedDependencyLag | null,
) {
  return a?.amount === b?.amount && a?.unit === b?.unit;
}

// TODO(dependencies public flip, #23420): move to localeText.
const DEPENDENCY_TYPE_LABELS: Record<SchedulerDependencyType, string> = {
  FinishToStart: 'Finish to start',
  StartToStart: 'Start to start',
  FinishToFinish: 'Finish to finish',
  StartToFinish: 'Start to finish',
};

const DEPENDENCY_TYPES = Object.keys(DEPENDENCY_TYPE_LABELS) as SchedulerDependencyType[];

// TODO(dependencies public flip, #23420): move to localeText.
const UPDATE_REJECTION_MESSAGES: Record<
  Extract<SchedulerUpdateDependencyResult, { status: 'rejected' }>['reason'],
  string
> = {
  cascadeBlocked: 'This change would move a read-only event, so it was not applied.',
  duplicateDependency: 'A dependency of this type already exists between these two events.',
  readOnly: 'Dependencies cannot be changed while the scheduler is read-only.',
  unknownDependency: 'This dependency no longer exists.',
};

const DependencyDialogAnchor = styled('span', {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogAnchor',
})({
  position: 'absolute',
  width: 0,
  height: 0,
  pointerEvents: 'none',
});

// TODO(dependencies public flip, #23420): settle the width with the dialog's own styles.
const DependencyDialogFormContent = styled(EventDialogFormContent, {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogFormContent',
})({
  minWidth: 0,
  width: 345,
});

const DependencyDialogBody = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogBody',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(0, 3, 3),
}));

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

const DependencyDialogDetails = styled('dl', {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogDetails',
})(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(60px, auto) 1fr',
  columnGap: 8,
  rowGap: 12,
  margin: 0,
  color: (theme.vars || theme).palette.text.primary,
  '& dd': {
    margin: 0,
    // Lets a long event title shrink to an ellipsis.
    minWidth: 0,
  },
}));

const DependencyDialogEventChip = styled('span', {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogEventChip',
})(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  maxWidth: '100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  verticalAlign: 'middle',
  padding: theme.spacing(0.25, 1, 0.25, 1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'var(--event-surface-subtle)',
  color: 'var(--event-on-surface-subtle-primary)',
  ...theme.typography.body2,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 3,
    background: 'var(--event-surface-accent)',
  },
  variants: getPaletteVariants(theme),
}));

/**
 * Dialog to edit a dependency, or show its details when read-only.
 * Opens on double click on an arrow or from its context menu.
 * TODO(dependencies public flip, #23420): add the utility classes of the dialog.
 */
export function EventTimelinePremiumDependencyDialog() {
  const store = useEventTimelinePremiumStoreContext();
  const editor = useStore(store, eventTimelinePremiumDependencySelectors.editor);

  // Before reading the geometry: it is not provided while the feature is disabled.
  if (editor === null) {
    return null;
  }

  return <DependencyDialog editor={editor} />;
}

interface DependencyDialogContentProps extends Pick<
  SchedulerDependencyEditor,
  'sourceResourceId' | 'targetResourceId'
> {
  dependency: SchedulerDependency;
  anchor: HTMLElement;
  onClose: () => void;
}

// Memoized: the geometry read by the parent changes while scrolling.
const DependencyDialogContent = React.memo(function DependencyDialogContent(
  props: DependencyDialogContentProps,
) {
  const { dependency, anchor, onClose, sourceResourceId, targetResourceId } = props;
  const store = useEventTimelinePremiumStoreContext();
  const { schedulerId, classes, localeText } = useEventEditingStyledContext();
  const isReadOnly = useStore(store, eventTimelinePremiumDependencySelectors.isReadOnly);
  const sourceTitle = useStore(
    store,
    (state) => schedulerEventSelectors.processedEvent(state, dependency.source)?.title ?? '',
  );
  const targetTitle = useStore(
    store,
    (state) => schedulerEventSelectors.processedEvent(state, dependency.target)?.title ?? '',
  );
  const sourceColor = useStore(
    store,
    schedulerEventSelectors.color,
    dependency.source,
    sourceResourceId,
  );
  const targetColor = useStore(
    store,
    schedulerEventSelectors.color,
    dependency.target,
    targetResourceId,
  );
  const isTargetAllDay = useStore(
    store,
    (state) => schedulerEventSelectors.processedEvent(state, dependency.target)?.allDay ?? false,
  );
  const dragHandlerRef = React.useRef<HTMLElement>(null);
  const typeInputRef = React.useRef<HTMLInputElement>(null);
  const lagInputRef = React.useRef<HTMLInputElement>(null);
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

  const titleId = `${schedulerId}-dependency-dialog-title`;
  const typeLabelId = `${schedulerId}-dependency-dialog-type-label`;
  const typeHelperId = `${schedulerId}-dependency-dialog-type-helper-text`;
  const lagId = `${schedulerId}-dependency-dialog-lag`;
  const lagHelperId = `${lagId}-helper-text`;

  const draft = toLagDraft(lagAmountField.value, lagUnitField.value);
  const draftLag = getDependencyLag(draft);
  const effectiveLag = getEffectiveDependencyLag(draft, isTargetAllDay);
  let lagHelperText: React.ReactNode = lagAmountField.error ?? null;
  if (lagHelperText === null && getDependencyLagIssue(draft) === null) {
    if (!isSameLag(effectiveLag, draftLag)) {
      lagHelperText =
        effectiveLag === null
          ? DEPENDENCY_DIALOG_TEXT.allDayLagIgnored
          : DEPENDENCY_DIALOG_TEXT.allDayLagRounded(formatLag(effectiveLag));
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    formStore.setSubmitting(true);
    try {
      if (!(await formStore.validateAll())) {
        lagInputRef.current?.focus();
        return;
      }
      const { values } = formStore.state;
      const submittedLag = getDependencyLag(toLagDraft(values.lagAmount, values.lagUnit));
      // Only write the lag if the user changed it, so an untouched one stays as is.
      const result = store.updateDependency(
        dependency.id,
        isSameLag(submittedLag, initialLag)
          ? { type: values.type }
          : { type: values.type, lag: submittedLag?.amount, lagUnit: submittedLag?.unit },
      );
      if (result.status === 'rejected') {
        // On the field that caused it, like the event form: editing that field clears it.
        const isLagRejected =
          result.reason === 'cascadeBlocked' && !isSameLag(submittedLag, initialLag);
        formStore.setError(
          isLagRejected ? 'lagAmount' : 'type',
          UPDATE_REJECTION_MESSAGES[result.reason],
        );
        (isLagRejected ? lagInputRef : typeInputRef).current?.focus();
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
    <EventDialogRoot
      open
      onClose={onClose}
      PaperComponent={EventDialogDraggablePaper}
      aria-labelledby={titleId}
      aria-modal="false"
      className={classes.eventDialog}
      slotProps={{
        paper: {
          className: classes.eventDialogPaper,
          anchor,
          dragHandlerRef,
        } as EventDialogDraggablePaperProps,
      }}
    >
      <DependencyDialogFormContent className={classes.eventDialogContent}>
        <EventDialogForm onSubmit={handleSubmit} className={classes.eventDialogForm}>
          <EventDialogHeader onClose={onClose} dragHandlerRef={dragHandlerRef}>
            <Typography variant="h6" id={titleId} className={classes.eventDialogTitle}>
              {isReadOnly ? DEPENDENCY_DIALOG_TEXT.detailsTitle : DEPENDENCY_DIALOG_TEXT.editTitle}
            </Typography>
          </EventDialogHeader>
          <DependencyDialogBody>
            <DependencyDialogDetails>
              <Typography component="dt">{DEPENDENCY_DIALOG_TEXT.sourceLabel}</Typography>
              <Typography component="dd">
                <DependencyDialogEventChip data-palette={sourceColor} title={sourceTitle}>
                  {sourceTitle}
                </DependencyDialogEventChip>
              </Typography>
              <Typography component="dt">{DEPENDENCY_DIALOG_TEXT.targetLabel}</Typography>
              <Typography component="dd">
                <DependencyDialogEventChip data-palette={targetColor} title={targetTitle}>
                  {targetTitle}
                </DependencyDialogEventChip>
              </Typography>
              {isReadOnly && (
                <React.Fragment>
                  <Typography component="dt">{DEPENDENCY_DIALOG_TEXT.typeLabel}</Typography>
                  <Typography component="dd">{DEPENDENCY_TYPE_LABELS[dependency.type]}</Typography>
                  <Typography component="dt">{DEPENDENCY_DIALOG_TEXT.lagLabel}</Typography>
                  <Typography component="dd">
                    {initialLag === null ? DEPENDENCY_DIALOG_TEXT.noLag : formatLag(initialLag)}
                  </Typography>
                </React.Fragment>
              )}
            </DependencyDialogDetails>
            {!isReadOnly && (
              <FormControl fullWidth size="small" error={typeField.error !== undefined}>
                <InputLabel id={typeLabelId}>{DEPENDENCY_DIALOG_TEXT.typeLabel}</InputLabel>
                <Select
                  labelId={typeLabelId}
                  label={DEPENDENCY_DIALOG_TEXT.typeLabel}
                  inputRef={typeInputRef}
                  value={typeField.value}
                  aria-describedby={typeField.error === undefined ? undefined : typeHelperId}
                  onChange={(event) =>
                    typeField.setValue(event.target.value as SchedulerDependencyType)
                  }
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
            )}
            {!isReadOnly && (
              <DependencyDialogLag
                id={lagId}
                fullWidth
                size="small"
                label={DEPENDENCY_DIALOG_TEXT.lagLabel}
                inputRef={lagInputRef}
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
                            // The unit is part of the lag value.
                            formStore.clearErrors(['lagAmount']);
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
            )}
          </DependencyDialogBody>
          <Divider className={classes.eventDialogFormDivider} />
          <EventDialogFormActions className={classes.eventDialogFormActions}>
            {isReadOnly ? (
              <Button variant="contained" type="button" onClick={onClose}>
                {localeText.closeButtonLabel}
              </Button>
            ) : (
              <React.Fragment>
                <Button color="error" type="button" onClick={handleDelete} disabled={isSubmitting}>
                  {DEPENDENCY_DIALOG_TEXT.delete}
                </Button>
                <Button variant="contained" type="submit" disabled={isSubmitting}>
                  {localeText.saveChanges}
                </Button>
              </React.Fragment>
            )}
          </EventDialogFormActions>
        </EventDialogForm>
      </DependencyDialogFormContent>
    </EventDialogRoot>
  );
});

function DependencyDialog({ editor }: { editor: SchedulerDependencyEditor }) {
  const store = useEventTimelinePremiumStoreContext();
  const dependency = useStore(
    store,
    eventTimelinePremiumDependencySelectors.model,
    editor.dependencyId,
  );
  const { offsetTop } = useDependencyGeometry();
  const [anchor, setAnchor] = React.useState<HTMLSpanElement | null>(null);

  if (dependency === null) {
    return null;
  }

  return (
    <React.Fragment>
      <DependencyDialogAnchor
        ref={setAnchor}
        style={{
          left: `calc(var(--title-column-width) + ${editor.anchor.x}px)`,
          top: editor.anchor.y - offsetTop,
        }}
      />
      {anchor !== null && (
        <DependencyDialogContent
          // Remount per dependency to reset the draft.
          key={String(dependency.id)}
          dependency={dependency}
          anchor={anchor}
          onClose={store.closeDependencyEditor}
          sourceResourceId={editor.sourceResourceId}
          targetResourceId={editor.targetResourceId}
        />
      )}
    </React.Fragment>
  );
}
