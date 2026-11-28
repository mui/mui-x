'use client';
import * as React from 'react';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import type { BaseUIComponentProps } from '@base-ui/react/internals/types';
import { useCompositeListItem } from '@base-ui/react/internals/composite';
import { toEpochMs } from '../../internals/utils/plain-date-utils/timeZone';
import { useEventCreation } from '../../internals/utils/useEventCreation';
import { getCalendarGridHeaderCellId } from '../../internals/utils/accessibility-utils';
import { useKeyboardEventCreation } from '../../internals/utils/useKeyboardEventCreation';
import { useCalendarGridCellKeyboard } from '../../internals/utils/useCalendarGridCellKeyboard';
import { useCalendarGridRootContext } from '../root/CalendarGridRootContext';
import { useCalendarGridDayRowContext } from '../day-row/CalendarGridDayRowContext';
import { useDayCellDropTarget } from './useDayCellDropTarget';

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

  const { id: rootId } = useCalendarGridRootContext();
  const { rowIndex } = useCalendarGridDayRowContext();
  const { ref: listItemRef, index } = useCompositeListItem();
  const dropTargetRef = useDayCellDropTarget({ value, addPropertiesToDroppedEvent });
  const columnHeaderId = getCalendarGridHeaderCellId(rootId, index);

  const cellRef = React.useRef<HTMLDivElement>(null);

  const getPlaceholderFields = ({ timezone }: { timezone: string }) => {
    // One all-day day, ending at the start of the next one.
    return {
      surfaceType: 'day-grid' as const,
      start: toEpochMs(value, timezone),
      end: toEpochMs(value.add({ days: 1 }), timezone),
      lockSurfaceType,
      resourceId: null,
    };
  };

  const eventCreationProps = useEventCreation(getPlaceholderFields);
  const triggerKeyboardCreation = useKeyboardEventCreation(getPlaceholderFields);

  const keyboardProps = useCalendarGridCellKeyboard({
    rowType: 'day-grid',
    rowIndex,
    columnIndex: index,
    cellRef,
    createEvent: triggerKeyboardCreation,
  });

  // Associate this cell with its column header.
  // Any additional aria-labelledby passed by the styled layer (e.g., an "All day" row header) is appended.
  const { 'aria-labelledby': elementAriaLabelledBy, ...restElementProps } = elementProps;
  const ariaLabelledBy = [columnHeaderId, elementAriaLabelledBy].filter(Boolean).join(' ');

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef, dropTargetRef, listItemRef, cellRef],
    props: [
      {
        role: 'gridcell',
        'aria-labelledby': ariaLabelledBy || undefined,
        'aria-colindex': index + 1,
      },
      keyboardProps,
      eventCreationProps,
      restElementProps,
    ],
  });
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
