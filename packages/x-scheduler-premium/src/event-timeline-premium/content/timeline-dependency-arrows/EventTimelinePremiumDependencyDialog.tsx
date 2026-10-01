'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import type { PaperProps } from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import { eventTimelinePremiumDependencySelectors } from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import type {
  SchedulerDependency,
  SchedulerDependencyEditor,
  SchedulerDependencyType,
  SchedulerUpdateDependencyResult,
} from '@mui/x-scheduler-internals-premium/models';
import {
  EventDialogDraggablePaper,
  EventDialogForm,
  EventDialogFormActions,
  EventDialogFormContent,
  EventDialogHeader,
  EventDialogRoot,
  useEventEditingStyledContext,
} from '@mui/x-scheduler/internals';
import { useDependencyGeometry } from './EventTimelinePremiumDependencyGeometry';

// TODO(dependencies public flip, #23420): move to localeText.
const DEPENDENCY_DIALOG_TEXT = {
  editTitle: 'Edit dependency',
  detailsTitle: 'Dependency details',
  sourceLabel: 'From',
  targetLabel: 'To',
  typeLabel: 'Type',
  delete: 'Delete',
};

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
  duplicateDependency: 'A dependency of this type already exists between these two events.',
  readOnlyEvent: 'Dependencies cannot involve read-only events.',
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

const DependencyDialogBody = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogBody',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(0, 3, 3),
}));

const DependencyDialogDetails = styled('dl', {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogDetails',
})(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  columnGap: theme.spacing(3),
  rowGap: theme.spacing(1.5),
  margin: 0,
  '& dt': {
    color: (theme.vars || theme).palette.text.secondary,
  },
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

interface DependencyDialogContentProps {
  dependency: SchedulerDependency;
  anchor: HTMLElement;
  onClose: () => void;
}

function DependencyDialogContent(props: DependencyDialogContentProps) {
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
  const dragHandlerRef = React.useRef<HTMLElement>(null);
  const [type, setType] = React.useState(dependency.type);

  const titleId = `${schedulerId}-dependency-dialog-title`;
  const typeLabelId = `${schedulerId}-dependency-dialog-type-label`;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = store.updateDependency(dependency.id, { type });
    if (result.status === 'rejected') {
      store.pushError(
        /* minify-error-disabled */ new Error(UPDATE_REJECTION_MESSAGES[result.reason]),
        { transient: true },
      );
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
        paper: { className: classes.eventDialogPaper, anchor, dragHandlerRef } as PaperProps,
      }}
    >
      <EventDialogFormContent className={classes.eventDialogContent}>
        <EventDialogForm onSubmit={handleSubmit} className={classes.eventDialogForm}>
          <EventDialogHeader onClose={onClose} dragHandlerRef={dragHandlerRef}>
            <Typography variant="h6" id={titleId} className={classes.eventDialogTitle}>
              {isReadOnly ? DEPENDENCY_DIALOG_TEXT.detailsTitle : DEPENDENCY_DIALOG_TEXT.editTitle}
            </Typography>
          </EventDialogHeader>
          <DependencyDialogBody>
            <DependencyDialogDetails>
              <Typography variant="body2" component="dt">
                {DEPENDENCY_DIALOG_TEXT.sourceLabel}
              </Typography>
              <Typography variant="body2" component="dd">
                {sourceTitle}
              </Typography>
              <Typography variant="body2" component="dt">
                {DEPENDENCY_DIALOG_TEXT.targetLabel}
              </Typography>
              <Typography variant="body2" component="dd">
                {targetTitle}
              </Typography>
              {isReadOnly && (
                <React.Fragment>
                  <Typography variant="body2" component="dt">
                    {DEPENDENCY_DIALOG_TEXT.typeLabel}
                  </Typography>
                  <Typography variant="body2" component="dd">
                    {DEPENDENCY_TYPE_LABELS[dependency.type]}
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
                  onChange={(event) => setType(event.target.value as SchedulerDependencyType)}
                >
                  {DEPENDENCY_TYPES.map((option) => (
                    <MenuItem key={option} value={option}>
                      {DEPENDENCY_TYPE_LABELS[option]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                <Button variant="contained" type="submit">
                  {localeText.saveChanges}
                </Button>
              </React.Fragment>
            )}
          </EventDialogFormActions>
        </EventDialogForm>
      </EventDialogFormContent>
    </EventDialogRoot>
  );
}
