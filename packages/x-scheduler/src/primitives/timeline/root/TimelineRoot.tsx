'use client';
import * as React from 'react';
import { Store } from '@base-ui-components/utils/store';
import { useLazyRef } from '@base-ui-components/utils/useLazyRef';
import { useModernLayoutEffect } from '@base-ui-components/utils/useModernLayoutEffect';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { State } from './store';
import { TimelineRootContext } from './TimelineRootContext';

export const TimelineRoot = React.forwardRef(function TimelineRoot(
  componentProps: TimelineRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    items: itemsProp,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const props = React.useMemo(() => ({ role: 'grid' }), []);

  const state: TimelineRoot.State = React.useMemo(() => ({}), []);

  const store = useLazyRef(() => new Store<State>({ items: itemsProp })).current;

  const contextValue = React.useMemo(() => ({ store }), [store]);

  useModernLayoutEffect(() => {
    store.apply({ items: itemsProp });
  }, [store, itemsProp]);

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
    props: [props, elementProps],
  });

  return (
    <TimelineRootContext.Provider value={contextValue}>{element}</TimelineRootContext.Provider>
  );
}) as TimelineRoot.Component;

export namespace TimelineRoot {
  export interface State {}

  export interface Props<Item = any> extends BaseUIComponentProps<'div', State> {
    items: Item[];
  }

  export type Component = <Item = any>(
    props: Props<Item> & React.RefAttributes<HTMLDivElement>,
  ) => React.ReactElement;
}
