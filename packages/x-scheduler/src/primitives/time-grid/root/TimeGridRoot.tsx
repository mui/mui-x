'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { useEventCallback } from '../../../base-ui-copy/utils/useEventCallback';
import { SchedulerValidDate } from '../../models';
import { TimeGridRootContext } from './TimeGridRootContext';
import { useAdapter } from '../../utils/adapter/useAdapter';

export const TimeGridRoot = React.forwardRef(function TimeGridRoot(
  componentProps: TimeGridRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const adapter = useAdapter();

  const {
    // Rendering props
    className,
    render,
    // Internal props
    onEventChange: onEventChangeProp,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const [placeholder, setPlaceholder] = React.useState<TimeGridRoot.EventData | null>(null);

  const handlePlaceholderChange = useEventCallback(
    (newPlaceholder: TimeGridRoot.EventData | null) => {
      if (
        newPlaceholder != null &&
        placeholder != null &&
        adapter.isEqual(newPlaceholder.start, placeholder.start) &&
        adapter.isEqual(newPlaceholder.end, placeholder.end) &&
        placeholder.eventId === newPlaceholder.eventId &&
        placeholder.columnId === newPlaceholder.columnId
      ) {
        return;
      }

      setPlaceholder(newPlaceholder);
    },
  );

  const props = React.useMemo(() => ({ role: 'grid' }), []);

  const state: TimeGridRoot.State = React.useMemo(() => ({}), []);

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
    props: [props, elementProps],
  });

  const onEventChange = useEventCallback(onEventChangeProp);

  const contextValue: TimeGridRootContext = React.useMemo(
    () => ({ onEventChange, placeholder, setPlaceholder: handlePlaceholderChange }),
    [onEventChange, placeholder, handlePlaceholderChange],
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
    eventId: string | number;
    columnId: string | null;
    start: SchedulerValidDate;
    end: SchedulerValidDate;
  }
}
