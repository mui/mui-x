'use client';
import * as React from 'react';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useId } from '@base-ui-components/utils/useId';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { CalendarPrimitiveEventData } from '../../models';
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
    onEventChange,
    id: idProp,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const id = useId(idProp);
  const props = React.useMemo(() => ({ role: 'grid', id }), [id]);

  const updateEvent = useEventCallback(onEventChange);

  const contextValue: TimeGridRootContext = React.useMemo(
    () => ({ updateEvent, id }),
    [updateEvent, id],
  );

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [props, elementProps],
  });

  return (
    <TimeGridRootContext.Provider value={contextValue}>{element}</TimeGridRootContext.Provider>
  );
});

export namespace TimeGridRoot {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * Event handler called when an event is changed.
     * Provides the new event data as an argument.
     */
    onEventChange?: (data: CalendarPrimitiveEventData) => void;
  }
}
