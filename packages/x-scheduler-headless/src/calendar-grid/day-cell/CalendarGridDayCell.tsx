'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { useCompositeListItem } from '../../base-ui-copy/composite/list/useCompositeListItem';
import { useAdapter } from '../../use-adapter';
import { useEventCreation } from '../../internals/utils/useEventCreation';
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
    // Internal props
    value,
    addPropertiesToDroppedEvent,
    lockSurfaceType,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const adapter = useAdapter();
  const { ref: listItemRef, index } = useCompositeListItem();
  const dropTargetRef = useDayCellDropTarget({ value, addPropertiesToDroppedEvent });

  const eventCreationProps = useEventCreation(() => ({
    surfaceType: 'day-grid',
    start: adapter.startOfDay(value),
    end: adapter.endOfDay(value),
    lockSurfaceType,
    resourceId: null,
  }));

  const props = { role: 'gridcell' };

  const contextValue: CalendarGridDayCellContext = React.useMemo(
    () => ({
      index,
    }),
    [index],
  );

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef, dropTargetRef, listItemRef],
    props: [props, eventCreationProps, elementProps],
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
