'use client';
import * as React from 'react';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useCompositeRootContext } from '../root/CompositeRootContext';
import { useCompositeListItem } from '../list/useCompositeListItem';
import { HTMLProps } from '../../utils/types';

export interface UseCompositeItemParameters<Metadata> {
  metadata?: Metadata;
}

export function useCompositeItem<Metadata>(params: UseCompositeItemParameters<Metadata> = {}) {
  const { highlightItemOnHover, highlightedIndex, onHighlightedIndexChange } =
    useCompositeRootContext();
  const { ref, index } = useCompositeListItem(params);

  const isHighlighted = highlightedIndex === index;

  const itemRef = React.useRef<HTMLElement | null>(null);
  const mergedRef = useMergedRefs(ref, itemRef);

  const compositeProps = React.useMemo<HTMLProps>(
    () => ({
      tabIndex: isHighlighted ? 0 : -1,
      onFocus() {
        onHighlightedIndexChange(index);
      },
      onMouseMove() {
        const item = itemRef.current;
        if (!highlightItemOnHover || !item) {
          return;
        }

        const disabled = item.hasAttribute('disabled') || item.ariaDisabled === 'true';
        if (!isHighlighted && !disabled) {
          item.focus();
        }
      },
    }),
    [isHighlighted, onHighlightedIndexChange, index, highlightItemOnHover],
  );

  return {
    compositeProps,
    compositeRef: mergedRef as React.RefCallback<HTMLElement | null>,
    index,
  };
}
