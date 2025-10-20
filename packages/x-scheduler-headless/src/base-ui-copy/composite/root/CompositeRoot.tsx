'use client';
import * as React from 'react';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '@base-ui-components/utils/empty';
import { CompositeList, type CompositeMetadata } from '../list/CompositeList';
import { useCompositeRoot } from './useCompositeRoot';
import { CompositeRootContext } from './CompositeRootContext';
import { useRenderElement } from '../../utils/useRenderElement';
import type { BaseUIComponentProps } from '../../utils/types';
import type { Dimensions, ModifierKey } from '../composite';
import { StateAttributesMapping } from '../../utils/getStateAttributesProps';

/**
 * @internal
 */
export function CompositeRoot<Metadata extends {}, State extends Record<string, any>>(
  componentProps: CompositeRoot.Props<Metadata, State>,
) {
  const {
    render,
    className,
    refs = EMPTY_ARRAY as React.Ref<Element>[],
    props = EMPTY_ARRAY,
    state = EMPTY_OBJECT as State,
    stateAttributesMapping,
    highlightedIndex: highlightedIndexProp,
    onHighlightedIndexChange: onHighlightedIndexChangeProp,
    orientation,
    dense,
    itemSizes,
    loop,
    cols,
    enableHomeAndEndKeys,
    onMapChange: onMapChangeProp,
    stopEventPropagation = true,
    rootRef,
    disabledIndices,
    modifierKeys,
    highlightItemOnHover = false,
    tag = 'div',
    ...elementProps
  } = componentProps;

  // TODO: Use Composite from Base UI package to get the real direction.
  const direction = 'ltr';

  const {
    props: defaultProps,
    highlightedIndex,
    onHighlightedIndexChange,
    elementsRef,
    onMapChange: onMapChangeUnwrapped,
  } = useCompositeRoot({
    itemSizes,
    cols,
    loop,
    dense,
    orientation,
    highlightedIndex: highlightedIndexProp,
    onHighlightedIndexChange: onHighlightedIndexChangeProp,
    rootRef,
    stopEventPropagation,
    enableHomeAndEndKeys,
    direction,
    disabledIndices,
    modifierKeys,
  });

  const onMapChange = useEventCallback(
    (newMap: Map<Element, CompositeMetadata<Metadata> | null>) => {
      onMapChangeProp?.(newMap);
      onMapChangeUnwrapped(newMap);
    },
  );

  const element = useRenderElement(tag, componentProps, {
    state,
    ref: refs,
    props: [defaultProps, ...props, elementProps],
    stateAttributesMapping,
  });

  const contextValue: CompositeRootContext = React.useMemo(
    () => ({ highlightedIndex, onHighlightedIndexChange, highlightItemOnHover }),
    [highlightedIndex, onHighlightedIndexChange, highlightItemOnHover],
  );

  return (
    <CompositeRootContext.Provider value={contextValue}>
      <CompositeList<Metadata> elementsRef={elementsRef} onMapChange={onMapChange}>
        {element}
      </CompositeList>
    </CompositeRootContext.Provider>
  );
}

export namespace CompositeRoot {
  export interface Props<Metadata, State extends Record<string, any>>
    extends Pick<BaseUIComponentProps<'div', State>, 'render' | 'className' | 'children'> {
    props?: Array<Record<string, any> | (() => Record<string, any>)>;
    state?: State;
    stateAttributesMapping?: StateAttributesMapping<State>;
    refs?: React.Ref<HTMLElement | null>[];
    tag?: keyof React.JSX.IntrinsicElements;
    orientation?: 'horizontal' | 'vertical' | 'both';
    cols?: number;
    loop?: boolean;
    highlightedIndex?: number;
    onHighlightedIndexChange?: (index: number) => void;
    itemSizes?: Dimensions[];
    dense?: boolean;
    enableHomeAndEndKeys?: boolean;
    onMapChange?: (newMap: Map<Node, CompositeMetadata<Metadata> | null>) => void;
    stopEventPropagation?: boolean;
    rootRef?: React.RefObject<HTMLElement | null>;
    disabledIndices?: number[];
    modifierKeys?: ModifierKey[];
    highlightItemOnHover?: boolean;
  }
}
