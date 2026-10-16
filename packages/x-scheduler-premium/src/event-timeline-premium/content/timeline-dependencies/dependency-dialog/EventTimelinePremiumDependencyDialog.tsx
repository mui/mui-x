'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import { eventTimelinePremiumDependencySelectors } from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import type { SchedulerDependencyEditor } from '@mui/x-scheduler-internals-premium/models';
import {
  EventDialogDraggablePaper,
  EventDialogContentRoot,
  EventDialogRoot,
  useEventEditingStyledContext,
} from '@mui/x-scheduler/internals';
import type { EventDialogDraggablePaperProps } from '@mui/x-scheduler/internals';
import { useDependencyGeometry } from '../EventTimelinePremiumDependencyGeometry';
import { DependencyDialogFormContent } from './DependencyDialogFormContent';
import { DependencyDialogReadonlyContent } from './DependencyDialogReadonlyContent';
import type { DependencyDialogViewProps } from './DependencyDialogDetails';

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
const DependencyDialogContentRoot = styled(EventDialogContentRoot, {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogContent',
})({
  minWidth: 0,
  width: 345,
});

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

interface DependencyDialogContentProps extends Omit<
  DependencyDialogViewProps,
  'titleId' | 'dragHandlerRef'
> {
  anchor: HTMLElement;
}

// Memoized: the geometry read by the parent changes while scrolling.
const DependencyDialogContent = React.memo(function DependencyDialogContent(
  props: DependencyDialogContentProps,
) {
  const { anchor, ...other } = props;
  const store = useEventTimelinePremiumStoreContext();
  const { schedulerId, classes } = useEventEditingStyledContext();
  const isReadOnly = useStore(store, eventTimelinePremiumDependencySelectors.isReadOnly);
  const dragHandlerRef = React.useRef<HTMLElement>(null);
  const titleId = `${schedulerId}-dependency-dialog-title`;

  const viewProps = { ...other, titleId, dragHandlerRef };

  return (
    <EventDialogRoot
      open
      onClose={other.onClose}
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
      <DependencyDialogContentRoot className={classes.eventDialogContent}>
        {isReadOnly ? (
          <DependencyDialogReadonlyContent {...viewProps} />
        ) : (
          <DependencyDialogFormContent {...viewProps} />
        )}
      </DependencyDialogContentRoot>
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
