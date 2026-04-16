'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { useCompositeListItem } from '../../base-ui-copy/composite/list/useCompositeListItem';
import { useAdapterContext } from '../../use-adapter-context';
import { useEventCreation } from '../../internals/utils/useEventCreation';
import { getCalendarGridHeaderCellId } from '../../internals/utils/accessibility-utils';
import { useCalendarGridRootContext } from '../root/CalendarGridRootContext';
import { useDayCellDropTarget } from './useDayCellDropTarget';
import { CalendarGridDayCellContext } from './CalendarGridDayCellContext';

export const CalendarGridDayCell = React.forwardRef(function CalendarGridDayCell(
  componentProps: CalendarGridDayCell.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    style,
    // Internal props
    value,
    addPropertiesToDroppedEvent,
    lockSurfaceType,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const adapter = useAdapterContext();
  const { id: rootId } = useCalendarGridRootContext();
  const { ref: listItemRef, index } = useCompositeListItem();
  const dropTargetRef = useDayCellDropTarget({ value, addPropertiesToDroppedEvent });
  const columnHeaderId = getCalendarGridHeaderCellId(rootId, index);

  const eventCreationProps = useEventCreation(() => ({
    surfaceType: 'day-grid',
    start: adapter.startOfDay(value),
    end: adapter.endOfDay(value),
    lockSurfaceType,
    resourceId: null,
  }));

  const contextValue: CalendarGridDayCellContext = React.useMemo(
    () => ({
      index,
    }),
    [index],
  );

  // Associate this cell with its column header, matching the pattern used by DayEvent and TimeEvent.
  // Any additional aria-labelledby passed by the styled layer (e.g., an "All day" row header) is appended.
  const ariaLabelledBy = [columnHeaderId, elementProps['aria-labelledby']]
    .filter(Boolean)
    .join(' ');

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef, dropTargetRef, listItemRef],
    props: [
      elementProps,
      { role: 'gridcell', 'aria-labelledby': ariaLabelledBy || undefined },
      eventCreationProps,
    ],
  });

  return (
    <CalendarGridDayCellContext.Provider value={contextValue}>
      {element}
    </CalendarGridDayCellContext.Provider>
  );
});

export namespace CalendarGridDayCell {
  export interface State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>, useDayCellDropTarget.Parameters {
    /**
     * Whether to lock the surface type of the created event placeholder.
     * When true, the surfaceType will not be updated when editing the placeholder.
     */
    lockSurfaceType?: boolean;
  }
}
