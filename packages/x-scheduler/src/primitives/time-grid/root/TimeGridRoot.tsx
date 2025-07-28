'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { useEventCallback } from '../../../base-ui-copy/utils/useEventCallback';
import { useLazyRef } from '../../../base-ui-copy/utils/useLazyRef';
import { Store } from '../../../base-ui-copy/utils/store';
import { useModernLayoutEffect } from '../../../base-ui-copy/utils/useModernLayoutEffect';
import { TimeGridRootContext } from './TimeGridRootContext';
import { useSetPlaceholder } from '../../utils/useSetPlaceholder';
import { EventData } from '../../models/event';
import { State } from './store';
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

  const store = useLazyRef(() => new Store<State>({ placeholder: null, adapter })).current;
  const setPlaceholder = useSetPlaceholder(store);

  const props = React.useMemo(() => ({ role: 'grid' }), []);

  const state: TimeGridRoot.State = React.useMemo(() => ({}), []);

  const onEventChange = useEventCallback(onEventChangeProp);

  const contextValue: TimeGridRootContext = React.useMemo(
    () => ({ onEventChange, setPlaceholder, store }),
    [onEventChange, setPlaceholder, store],
  );

  useModernLayoutEffect(() => {
    store.apply({ adapter });
  }, [store, adapter]);

  const element = useRenderElement('div', componentProps, {
    state,
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
    onEventChange?: (data: EventData) => void;
  }
}
