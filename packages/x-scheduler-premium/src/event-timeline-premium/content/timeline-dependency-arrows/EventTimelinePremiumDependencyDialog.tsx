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
  useEventEditingStyledContext,
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

/**
 * The point the dialog is anchored to. An element (not a virtual rect) so the event
 * dialog's positioning, which follows its anchor, works unchanged.
 */
const DependencyDialogAnchor = styled('span', {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogAnchor',
})({
  position: 'absolute',
  width: 0,
  height: 0,
  pointerEvents: 'none',
});

// Narrower than the event form, which has more fields. Keeps its `maxWidth: '100%'`, so
// it still shrinks to the viewport on narrow screens.
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
  // Wider than the rows inside a group, like the recurrence tab between its sections.
  gap: theme.spacing(3),
  padding: theme.spacing(0, 3, 3),
}));

// The rows mirror the "Repeat" section of the event dialog's recurrence tab: a label
// column, then the inputs.
const LABEL_MIN_WIDTH = 60;

// Same right inset as the Type select, so both arrows line up.
const DependencyDialogLag = styled(TextField, {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogLag',
})({
  [`& .${outlinedInputClasses.root}`]: {
    paddingRight: 7,
  },
});

// The unit sits inside the lag field, as a borderless select in its end adornment.
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
  gridTemplateColumns: `minmax(${LABEL_MIN_WIDTH}px, auto) 1fr`,
  columnGap: 8,
  rowGap: 12,
  margin: 0,
  color: (theme.vars || theme).palette.text.primary,
  '& dd': {
    margin: 0,
  },
}));

/**
 * The dialog to edit a dependency (or show its details when it is read-only), opened by
 * a double click on its arrow or from its context menu. Built from the same pieces as the
 * event dialog: anchored next to the point the user clicked, draggable, non-modal.
 * TODO(dependencies public flip, #23420): add the utility classes of the dialog.
 */
export function EventTimelinePremiumDependencyDialog() {
  const store = useEventTimelinePremiumStoreContext();
  const editor = useStore(store, eventTimelinePremiumDependencySelectors.editor);

  // Checked before reading the geometry, whose provider is a pass-through while the
  // dependencies feature is disabled (the editor is then always closed).
  if (editor === null) {
    return null;
  }

  return <DependencyDialog editor={editor} />;
}

interface DependencyDialogContentProps {
  dependency: SchedulerDependency;
  anchor: HTMLElement;
  onClose: () => void;
}

// Memoized: the geometry read by the parent changes while scrolling.
const DependencyDialogContent = React.memo(function DependencyDialogContent(
  props: DependencyDialogContentProps,
) {
  const { dependency, anchor, onClose } = props;
  const store = useEventTimelinePremiumStoreContext();
  const { schedulerId, classes, localeText } = useEventEditingStyledContext();
  const isReadOnly = useStore(
    store,
    eventTimelinePremiumDependencySelectors.isModelReadOnly,
    dependency.id,
  );
  const sourceTitle = useStore(
    store,
    (state) => schedulerEventSelectors.processedEvent(state, dependency.source)?.title ?? '',
  );
  const targetTitle = useStore(
    store,
    (state) => schedulerEventSelectors.processedEvent(state, dependency.target)?.title ?? '',
  );
  const isTargetAllDay = useStore(
    store,
    (state) => schedulerEventSelectors.processedEvent(state, dependency.target)?.allDay ?? false,
  );
  const dragHandlerRef = React.useRef<HTMLElement>(null);
  const [type, setType] = React.useState(dependency.type);
  // A lag the engine ignores (invalid in the props) shows as unset.
  const [initialLag] = React.useState(() => getDependencyLag(dependency));
  // Kept as typed, so the field can be emptied.
  const [lagAmount, setLagAmount] = React.useState(
    initialLag === null ? '' : String(initialLag.amount),
  );
  const [lagUnit, setLagUnit] = React.useState<SchedulerDependencyLagUnit>(
    initialLag?.unit ?? 'day',
  );
  // Shown in the form, not as a toast: the dialog hides the rest of the page, the
  // scheduler's error container included, from assistive technologies.
  const [rejection, setRejection] = React.useState<string | null>(null);

  const titleId = `${schedulerId}-dependency-dialog-title`;
  const typeLabelId = `${schedulerId}-dependency-dialog-type-label`;
  const lagId = `${schedulerId}-dependency-dialog-lag`;
  const lagHelperId = `${lagId}-helper-text`;

  const draft = { lag: lagAmount.trim() === '' ? 0 : Number(lagAmount), lagUnit };
  const isLagInvalid = getDependencyLagIssue(draft) !== null;
  const draftLag = getDependencyLag(draft);
  const effectiveLag = getEffectiveDependencyLag(draft, isTargetAllDay);
  let lagHelperText: string | null = null;
  if (isLagInvalid) {
    lagHelperText = DEPENDENCY_DIALOG_TEXT.invalidLag;
  } else if (!isSameLag(effectiveLag, draftLag)) {
    lagHelperText =
      effectiveLag === null
        ? DEPENDENCY_DIALOG_TEXT.allDayLagIgnored
        : DEPENDENCY_DIALOG_TEXT.allDayLagRounded(formatLag(effectiveLag));
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLagInvalid) {
      return;
    }
    // Only a lag the user changed is written: an untouched one keeps its original form
    // (a default unit left implicit, an ignored value from the props).
    const result = store.updateDependency(
      dependency.id,
      isSameLag(draftLag, initialLag)
        ? { type }
        : { type, lag: draftLag?.amount, lagUnit: draftLag?.unit },
    );
    if (result.status === 'rejected') {
      setRejection(UPDATE_REJECTION_MESSAGES[result.reason]);
      return;
    }
    onClose();
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
              <Typography component="dd">{sourceTitle}</Typography>
              <Typography component="dt">{DEPENDENCY_DIALOG_TEXT.targetLabel}</Typography>
              <Typography component="dd">{targetTitle}</Typography>
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
              <FormControl fullWidth size="small">
                <InputLabel id={typeLabelId}>{DEPENDENCY_DIALOG_TEXT.typeLabel}</InputLabel>
                <Select
                  labelId={typeLabelId}
                  label={DEPENDENCY_DIALOG_TEXT.typeLabel}
                  value={type}
                  onChange={(event) => {
                    setType(event.target.value as SchedulerDependencyType);
                    setRejection(null);
                  }}
                >
                  {DEPENDENCY_TYPES.map((option) => (
                    <MenuItem key={option} value={option}>
                      {DEPENDENCY_TYPE_LABELS[option]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {!isReadOnly && (
              <DependencyDialogLag
                id={lagId}
                fullWidth
                size="small"
                label={DEPENDENCY_DIALOG_TEXT.lagLabel}
                value={lagAmount}
                placeholder="0"
                error={isLagInvalid}
                helperText={lagHelperText}
                onChange={(event) => {
                  setLagAmount(event.target.value);
                  setRejection(null);
                }}
                slotProps={{
                  // Shrunk so the placeholder shows: an end adornment does not shrink it.
                  inputLabel: { shrink: true },
                  // A text input: a number input changes on wheel and accepts `e` or `-`,
                  // which the browser rejects with its own message instead of ours.
                  htmlInput: { inputMode: 'numeric' },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <DependencyDialogLagUnit
                          variant="standard"
                          disableUnderline
                          value={lagUnit}
                          inputProps={{ 'aria-label': DEPENDENCY_DIALOG_TEXT.lagUnitLabel }}
                          SelectDisplayProps={{
                            'aria-describedby': lagHelperText === null ? undefined : lagHelperId,
                          }}
                          onChange={(event) => {
                            setLagUnit(event.target.value as SchedulerDependencyLagUnit);
                            setRejection(null);
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
            {rejection !== null && (
              <FormHelperText error role="alert">
                {rejection}
              </FormHelperText>
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
                <Button color="error" type="button" onClick={handleDelete}>
                  {DEPENDENCY_DIALOG_TEXT.delete}
                </Button>
                <Button variant="contained" type="submit" disabled={isLagInvalid}>
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
          // Remount per dependency so the draft re-seeds from the opened dependency.
          key={String(dependency.id)}
          dependency={dependency}
          anchor={anchor}
          onClose={store.closeDependencyEditor}
        />
      )}
    </React.Fragment>
  );
}
