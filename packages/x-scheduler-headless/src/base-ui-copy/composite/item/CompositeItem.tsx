'use client';
import * as React from 'react';
import { EMPTY_OBJECT, EMPTY_ARRAY } from '@base-ui-components/utils/empty';
import { useRenderElement } from '../../utils/useRenderElement';
import { useCompositeItem } from './useCompositeItem';
import type { BaseUIComponentProps } from '../../utils/types';
import { StateAttributesMapping } from '../../utils/getStateAttributesProps';

/**
 * @internal
 */
export function CompositeItem<Metadata, State extends Record<string, any>>(
  componentProps: CompositeItem.Props<Metadata, State>,
) {
  const {
    render,
    className,
    state = EMPTY_OBJECT as State,
    props = EMPTY_ARRAY,
    refs = EMPTY_ARRAY,
    metadata,
    stateAttributesMapping,
    tag = 'div',
    ...elementProps
  } = componentProps;

  const { compositeProps, compositeRef } = useCompositeItem({ metadata });

  return useRenderElement(tag, componentProps, {
    state,
    ref: [...refs, compositeRef],
    props: [compositeProps, ...props, elementProps],
    stateAttributesMapping,
  });
}

export namespace CompositeItem {
  export interface Props<Metadata, State extends Record<string, any>>
    extends Pick<BaseUIComponentProps<any, State>, 'render' | 'className'> {
    children?: React.ReactNode;
    metadata?: Metadata;
    refs?: React.Ref<HTMLElement | null>[];
    props?: Array<Record<string, any> | (() => Record<string, any>)>;
    state?: State;
    stateAttributesMapping?: StateAttributesMapping<State>;
    tag?: keyof React.JSX.IntrinsicElements;
  }
}
