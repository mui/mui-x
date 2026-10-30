'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import type { DialogProps } from '@mui/material/Dialog';
import MuiDialogContent from '@mui/material/DialogContent';
import Paper from '@mui/material/Paper';
import type { PaperProps } from '@mui/material/Paper';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import { eventTimelinePremiumDependencySelectors } from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import type { SchedulerDependencyEditor } from '@mui/x-scheduler-internals-premium/models';
import {
  dialogContentBaseStyles,
  dialogRootBaseStyles,
  getDialogPaperBaseStyles,
  useDraggableAnchoredPaper,
} from '@mui/x-scheduler/internals';
import { useEventTimelinePremiumStyledContext } from '../../../EventTimelinePremiumStyledContext';
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

const DependencyDialogRoot = styled(Dialog, {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialog',
})(dialogRootBaseStyles);

const DependencyDialogPaper = styled(Paper, {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogPaper',
})(({ theme }) => getDialogPaperBaseStyles(theme));

interface DependencyDialogDraggablePaperProps extends PaperProps {
  anchor: HTMLElement | null;
  dragHandlerRef: React.RefObject<HTMLElement | null>;
}

const DependencyDialogDraggablePaper = function DependencyDialogDraggablePaper(
  props: DependencyDialogDraggablePaperProps,
) {
  const { anchor, dragHandlerRef, ...other } = props;
  const paperRef = useDraggableAnchoredPaper(anchor, dragHandlerRef);

  return <DependencyDialogPaper {...other} ref={paperRef} />;
} as any as DialogProps['PaperComponent'];

// Narrower than the event dialog: it only has four fields.
const DependencyDialogContentRoot = styled(MuiDialogContent, {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogContent',
})({
  ...dialogContentBaseStyles,
  width: 345,
});

/**
 * Dialog to edit a dependency, or show its details when read-only.
 * Opens on double click on an arrow or from its context menu.
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
  const { schedulerId, classes } = useEventTimelinePremiumStyledContext();
  const isReadOnly = useStore(store, eventTimelinePremiumDependencySelectors.isReadOnly);
  const dragHandlerRef = React.useRef<HTMLElement>(null);
  const titleId = `${schedulerId}-dependency-dialog-title`;

  const viewProps = { ...other, titleId, dragHandlerRef };

  return (
    <DependencyDialogRoot
      open
      onClose={other.onClose}
      PaperComponent={DependencyDialogDraggablePaper}
      aria-labelledby={titleId}
      aria-modal="false"
      className={classes.dependencyDialog}
      slotProps={{
        paper: {
          className: classes.dependencyDialogPaper,
          anchor,
          dragHandlerRef,
        } as DependencyDialogDraggablePaperProps,
      }}
    >
      <DependencyDialogContentRoot className={classes.dependencyDialogContent}>
        {isReadOnly ? (
          <DependencyDialogReadonlyContent {...viewProps} />
        ) : (
          <DependencyDialogFormContent {...viewProps} />
        )}
      </DependencyDialogContentRoot>
    </DependencyDialogRoot>
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
        data-dependency-dialog-anchor=""
        style={{
          insetInlineStart: `calc(var(--title-column-width) + ${editor.anchor.x}px)`,
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
