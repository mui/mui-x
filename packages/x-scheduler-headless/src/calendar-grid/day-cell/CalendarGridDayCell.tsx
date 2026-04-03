'use client';
import * as React from 'react';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import { BaseUIComponentProps } from '@base-ui/react/internals/types';
import { useCompositeListItem } from '../../base-ui-copy/composite/list/useCompositeListItem';
import { useAdapterContext } from '../../use-adapter-context';
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
    style,
    // Internal props
    value,
    addPropertiesToDroppedEvent,
    lockSurfaceType,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const adapter = useAdapterContext();
  const { ref: listItemRef, index } = useCompositeListItem();
  const dropTargetRef = useDayCellDropTarget({ value, addPropertiesToDroppedEvent });

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

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef, dropTargetRef, listItemRef],
    props: [elementProps, { role: 'gridcell' }, eventCreationProps],
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
