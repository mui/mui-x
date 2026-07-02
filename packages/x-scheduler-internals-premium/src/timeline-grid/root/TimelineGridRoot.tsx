'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import type { BaseUIComponentProps } from '@mui/x-scheduler-internals/base-ui-copy';
import { useRenderElement } from '@mui/x-scheduler-internals/base-ui-copy';
import type { SchedulerResourceId } from '@mui/x-scheduler-internals/models';
import { schedulerOccurrenceSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { eventTimelinePremiumPresetSelectors } from '../../event-timeline-premium-selectors';
import { TimelineGridRootCssVars } from './TimelineGridRootCssVars';
import type {
  TimelineGridCellCoordinates,
  TimelineGridColumnType,
} from '../../models/timelineGrid';
import { TimelineGridRootContext, DEFAULT_COLUMN_TYPES } from './TimelineGridRootContext';

export const TimelineGridRoot = React.forwardRef(function TimelineGridRoot(
  componentProps: TimelineGridRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    style,
    columnTypes = DEFAULT_COLUMN_TYPES,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  if (process.env.NODE_ENV !== 'production') {
    const seen = new Set<TimelineGridColumnType>();
    for (const type of columnTypes) {
      if (seen.has(type)) {
        // TODO: fix mui/no-guarded-throw
        // eslint-disable-next-line mui/no-guarded-throw
        throw new Error(
          `MUI X Scheduler: The \`columnTypes\` prop of <TimelineGrid.Root /> contains a duplicate entry "${type}". ` +
            'Arrow-key navigation relies on each column type appearing exactly once. ' +
            'Remove the duplicate entry.',
        );
      }
      seen.add(type);
    }
  }

  // Context hooks
  const store = useEventTimelinePremiumStoreContext();

  // Selector hooks
  const presetConfig = useStore(store, eventTimelinePremiumPresetSelectors.config);
  const resources = useStore(
    store,
    schedulerOccurrenceSelectors.groupedByResourceList,
    presetConfig.start,
    presetConfig.end,
  );

  const rootRef = React.useRef<HTMLDivElement>(null);

  const [focusedCell, setFocusedCellState] = React.useState<TimelineGridCellCoordinates | null>(
    null,
  );

  // Latest resource list, read by the stable `setFocusedCell` and the re-homing
  // effect below without adding them to a dependency array.
  const resourcesRef = React.useRef(resources);
  useIsoLayoutEffect(() => {
    resourcesRef.current = resources;
  });

  // Tracks the resource under the focused cell so focus can be re-homed to the
  // nearest surviving row if that row is removed (e.g. an ancestor resource
  // collapses), instead of letting it drop to the document body.
  const focusedResourceRef = React.useRef<{
    resourceId: SchedulerResourceId;
    columnType: TimelineGridColumnType;
    rowIndex: number;
  } | null>(null);

  const setFocusedCell = React.useCallback((coordinates: TimelineGridCellCoordinates) => {
    setFocusedCellState((prev) =>
      prev?.columnType === coordinates.columnType && prev.rowIndex === coordinates.rowIndex
        ? prev
        : coordinates,
    );
    const entry = resourcesRef.current[coordinates.rowIndex];
    focusedResourceRef.current = entry
      ? {
          resourceId: entry.resource.id,
          columnType: coordinates.columnType,
          rowIndex: coordinates.rowIndex,
        }
      : null;
  }, []);

  const clearFocusedCellIfMatches = React.useCallback(
    (columnType: TimelineGridColumnType, rowIndex: number) => {
      setFocusedCellState((prev) =>
        prev?.columnType === columnType && prev.rowIndex === rowIndex ? null : prev,
      );
    },
    [],
  );

  // Clears focusedCell when focus leaves the grid.
  const handleBlur = React.useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget) {
      if (!rootRef.current?.contains(nextTarget)) {
        focusedResourceRef.current = null;
        setFocusedCellState(null);
      }
      return;
    }
    // `relatedTarget` is null with portals, programmatic blur, or window-blur.
    // Defer to let focus settle, then recheck whether focus truly left the grid.
    // The tracked resource is left untouched: a null `relatedTarget` also covers
    // the focused row unmounting on collapse, which the effect below re-homes.
    queueMicrotask(() => {
      if (!rootRef.current?.contains(document.activeElement)) {
        setFocusedCellState(null);
      }
    });
  }, []);

  // When the focused resource row is removed (e.g. an ancestor collapses), move
  // focus to the nearest surviving row in the same column. Runs as a passive
  // effect so the removed rows' unmount cleanup clears `focusedCell` first and
  // this write wins.
  React.useEffect(() => {
    const focused = focusedResourceRef.current;
    if (focused === null) {
      return;
    }

    const nextIndex = resources.findIndex((entry) => entry.resource.id === focused.resourceId);
    if (nextIndex !== -1) {
      // Still visible; keep the tracked index in sync in case rows shifted above it.
      focused.rowIndex = nextIndex;
      return;
    }

    // Do not steal focus if it already moved to an element outside the grid.
    const ownerDocument = rootRef.current?.ownerDocument;
    const activeElement = ownerDocument?.activeElement ?? null;
    if (
      activeElement !== null &&
      activeElement !== ownerDocument?.body &&
      !rootRef.current?.contains(activeElement)
    ) {
      focusedResourceRef.current = null;
      return;
    }

    if (resources.length === 0) {
      focusedResourceRef.current = null;
      setFocusedCellState(null);
      return;
    }

    setFocusedCell({
      columnType: focused.columnType,
      rowIndex: Math.min(focused.rowIndex, resources.length - 1),
    });
  }, [resources, setFocusedCell]);

  const totalRowCount = resources.length;

  const contextValue: TimelineGridRootContext = React.useMemo(
    () => ({ focusedCell, setFocusedCell, clearFocusedCellIfMatches, columnTypes, totalRowCount }),
    [focusedCell, setFocusedCell, clearFocusedCellIfMatches, columnTypes, totalRowCount],
  );

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef, rootRef],
    props: [
      elementProps,
      {
        role: 'grid',
        onBlur: handleBlur,
        style: {
          [TimelineGridRootCssVars.unitCount]: presetConfig.tickCount,
          [TimelineGridRootCssVars.rowCount]: resources.length,
        } as React.CSSProperties,
      },
    ],
  });

  return (
    <TimelineGridRootContext.Provider value={contextValue}>
      {element}
    </TimelineGridRootContext.Provider>
  );
});

export namespace TimelineGridRoot {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * The ordered list of column types that are rendered in the grid.
     * Used for horizontal arrow-key navigation.
     * @default ['title', 'events']
     */
    columnTypes?: readonly [TimelineGridColumnType, ...TimelineGridColumnType[]];
  }
}
