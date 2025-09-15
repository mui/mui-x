'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { DayGridRowContext } from './DayGridRowContext';
import { SchedulerValidDate } from '../../models';

export const DayGridRow = React.forwardRef(function DayGridRow(
  componentProps: DayGridRow.Props,
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

  const props = React.useMemo(() => ({ role: 'row' }), []);

  const contextValue: DayGridRowContext = React.useMemo(
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

  return <DayGridRowContext.Provider value={contextValue}>{element}</DayGridRowContext.Provider>;
});

export namespace DayGridRow {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * The data and time at which the row starts.
     */
    start: SchedulerValidDate;
    /**
     * The data and time at which the row ends.
     */
    end: SchedulerValidDate;
  }
}
