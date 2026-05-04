'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-internals/base-ui-copy';
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

  const setFocusedCell = React.useCallback((coordinates: TimelineGridCellCoordinates) => {
    setFocusedCellState((prev) =>
      prev?.columnType === coordinates.columnType && prev.rowIndex === coordinates.rowIndex
        ? prev
        : coordinates,
    );
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
        setFocusedCellState(null);
      }
      return;
    }
    // `relatedTarget` is null with portals, programmatic blur, or window-blur.
    // Defer to let focus settle, then recheck whether focus truly left the grid.
    queueMicrotask(() => {
      if (!rootRef.current?.contains(document.activeElement)) {
        setFocusedCellState(null);
      }
    });
  }, []);

  const contextValue: TimelineGridRootContext = React.useMemo(
    () => ({ focusedCell, setFocusedCell, clearFocusedCellIfMatches, columnTypes }),
    [focusedCell, setFocusedCell, clearFocusedCellIfMatches, columnTypes],
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
