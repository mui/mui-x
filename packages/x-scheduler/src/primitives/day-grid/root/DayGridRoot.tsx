import * as React from 'react';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useRefWithInit } from '@base-ui-components/utils/useRefWithInit';
import { Store } from '@base-ui-components/utils/store';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { DayGridRootContext } from './DayGridRootContext';
import { useSetPlaceholder } from '../../utils/useSetPlaceholder';
import { CalendarPrimitiveEventData } from '../../models/event';
import { State } from './store';
import { useAdapter } from '../../utils/adapter/useAdapter';

export const DayGridRoot = React.forwardRef(function DayGridRoot(
  componentProps: DayGridRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const adapter = useAdapter();

  const {
    // Rendering props
    className,
    render,
    // Internal props
    onEventChange,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const store = useRefWithInit(() => new Store<State>({ placeholder: null, adapter })).current;
  const setPlaceholder = useSetPlaceholder(store);

  const props = React.useMemo(() => ({ role: 'grid' }), []);

  const updateEvent = useEventCallback(onEventChange);

  const contextValue: DayGridRootContext = React.useMemo(
    () => ({ updateEvent, setPlaceholder, store }),
    [updateEvent, setPlaceholder, store],
  );

  useIsoLayoutEffect(() => {
    store.apply({ adapter });
  }, [store, adapter]);

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [props, elementProps],
  });

  return <DayGridRootContext.Provider value={contextValue}>{element}</DayGridRootContext.Provider>;
});

export namespace DayGridRoot {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * Event handler called when an event is changed.
     * Provides the new event data as an argument.
     */
    onEventChange?: (data: CalendarPrimitiveEventData) => void;
  }
}
