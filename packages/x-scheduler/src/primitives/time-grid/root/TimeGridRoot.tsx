'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { useEventCallback } from '../../../base-ui-copy/utils/useEventCallback';
import { SchedulerValidDate } from '../../models';
import { TimeGridRootContext } from './TimeGridRootContext';

export const TimeGridRoot = React.forwardRef(function TimeGridRoot(
  componentProps: TimeGridRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    onEventChange: onEventChangeProp,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const props = React.useMemo(() => ({ role: 'grid' }), []);

  const state: TimeGridRoot.State = React.useMemo(() => ({}), []);

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
    props: [props, elementProps],
  });

  const onEventChange = useEventCallback(onEventChangeProp);

  const contextValue: TimeGridRootContext = React.useMemo(
    () => ({ onEventChange }),
    [onEventChange],
  );

  return (
    <TimeGridRootContext.Provider value={contextValue}>{element}</TimeGridRootContext.Provider>
  );
});

export namespace TimeGridRoot {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {
    onEventChange?: (data: EventData) => void;
  }

  export interface EventData {
    id: string | number;
    start: SchedulerValidDate;
    end: SchedulerValidDate;
  }
}
