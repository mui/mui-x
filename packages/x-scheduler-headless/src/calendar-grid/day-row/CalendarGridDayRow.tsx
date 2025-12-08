'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { CompositeList } from '../../base-ui-copy/composite/list/CompositeList';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { CalendarGridDayRowContext } from './CalendarGridDayRowContext';
import { TemporalSupportedObject } from '../../models';

export const CalendarGridDayRow = React.forwardRef(function CalendarGridDayRow(
  componentProps: CalendarGridDayRow.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    start,
    end,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const props = { role: 'row' };
  const cellsRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const contextValue: CalendarGridDayRowContext = React.useMemo(
    () => ({
      start,
      end,
    }),
    [start, end],
  );

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [props, elementProps],
  });

  return (
    <CompositeList elementsRef={cellsRefs}>
      <CalendarGridDayRowContext.Provider value={contextValue}>
        {element}
      </CalendarGridDayRowContext.Provider>
    </CompositeList>
  );
});

export namespace CalendarGridDayRow {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * The data and time at which the row starts.
     */
    start: TemporalSupportedObject;
    /**
     * The data and time at which the row ends.
     */
    end: TemporalSupportedObject;
  }
}
