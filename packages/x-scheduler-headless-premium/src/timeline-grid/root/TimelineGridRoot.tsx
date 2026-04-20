'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-headless/base-ui-copy';
import { schedulerOccurrenceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { eventTimelinePremiumViewSelectors } from '../../event-timeline-premium-selectors';
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
    // Internal props
    columnTypes = DEFAULT_COLUMN_TYPES,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // Context hooks
  const store = useEventTimelinePremiumStoreContext();

  // Selector hooks
  const viewConfig = useStore(store, eventTimelinePremiumViewSelectors.config);
  const resources = useStore(
    store,
    schedulerOccurrenceSelectors.groupedByResourceList,
    viewConfig.start,
    viewConfig.end,
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

  const handleBlur = React.useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    if (!rootRef.current?.contains(event.relatedTarget as Node)) {
      setFocusedCellState(null);
    }
  }, []);

  React.useEffect(() => {
    if (focusedCell !== null && focusedCell.rowIndex >= resources.length) {
      setFocusedCellState(null);
    }
  }, [focusedCell, resources.length]);

  const contextValue: TimelineGridRootContext = React.useMemo(
    () => ({ focusedCell, setFocusedCell, columnTypes }),
    [focusedCell, setFocusedCell, columnTypes],
  );

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef, rootRef],
    props: [
      elementProps,
      {
        role: 'grid',
        onBlur: handleBlur,
        style: {
          [TimelineGridRootCssVars.unitCount]: viewConfig.unitCount,
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
    columnTypes?: TimelineGridColumnType[];
  }
}
