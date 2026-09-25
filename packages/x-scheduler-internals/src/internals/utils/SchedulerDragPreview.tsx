'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { Draggable } from '@base-ui/react/draggable';
import type { DragLocationHistory } from '@base-ui/react/draggable';
import type { RenderDragPreviewParameters } from '../../models';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import { schedulerEventSelectors } from '../../scheduler-selectors';
import { schedulerEventDragKinds, schedulerDropTargetKind } from './schedulerDrag';

function isOutsideScheduler(location: DragLocationHistory) {
  return !location.current.dropTargets.some((target) => schedulerDropTargetKind.matches(target));
}

/** Visibility changes only when the target changes; Base UI positions the floating preview. */
export function SchedulerFloatingPreview(props: {
  location: DragLocationHistory;
  children: React.ReactNode;
}) {
  const { location, children } = props;
  const [visible, setVisible] = React.useState(() => isOutsideScheduler(location));
  Draggable.useMonitor({
    accept: schedulerEventDragKinds,
    onMoveStart: (event) => setVisible(isOutsideScheduler(event.location)),
    onTargetChange: (event) => setVisible(isOutsideScheduler(event.location)),
  });
  return <div style={{ visibility: visible ? undefined : 'hidden' }}>{children}</div>;
}

/** The floating preview outside Scheduler targets. In-grid occurrence previews stay in the grid. */
export function SchedulerDragPreview(props: SchedulerDragPreview.Props) {
  const { renderDragPreview, data, type } = props;
  const store = useSchedulerStoreContext();
  const enabled = useStore(store, schedulerEventSelectors.canDropEventsToTheOutside);

  return (
    <Draggable.Preview disabled={!enabled} offset="pointer" style={{ pointerEvents: 'none' }}>
      {({ location }) => (
        <SchedulerFloatingPreview location={location}>
          {renderDragPreview({ data, type })}
        </SchedulerFloatingPreview>
      )}
    </Draggable.Preview>
  );
}

export namespace SchedulerDragPreview {
  export interface Props extends Extract<RenderDragPreviewParameters, { type: 'internal-event' }> {
    renderDragPreview: (parameters: RenderDragPreviewParameters) => React.ReactNode;
  }
}
