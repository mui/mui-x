'use client';
import * as React from 'react';
import { isElementDisabled } from '@base-ui-components/utils/isElementDisabled';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import {
  ALL_KEYS,
  ARROW_DOWN,
  ARROW_KEYS,
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_UP,
  END,
  HOME,
  HORIZONTAL_KEYS,
  HORIZONTAL_KEYS_WITH_EXTRA_KEYS,
  MODIFIER_KEYS,
  VERTICAL_KEYS,
  VERTICAL_KEYS_WITH_EXTRA_KEYS,
  createGridCellMap,
  findNonDisabledListIndex,
  getGridCellIndexOfCorner,
  getGridCellIndices,
  getGridNavigatedIndex,
  getMaxListIndex,
  getMinListIndex,
  isListIndexDisabled,
  isIndexOutOfListBounds,
  isNativeInput,
  scrollIntoViewIfNeeded,
  type Dimensions,
  type ModifierKey,
} from '../composite';
import { ACTIVE_COMPOSITE_ITEM } from '../constants';
import { CompositeMetadata } from '../list/CompositeList';
import { HTMLProps } from '../../utils/types';

export interface UseCompositeRootParameters {
  orientation?: 'horizontal' | 'vertical' | 'both';
  cols?: number;
  loop?: boolean;
  highlightedIndex?: number;
  onHighlightedIndexChange?: (index: number) => void;
  dense?: boolean;
  direction: 'ltr' | 'rtl';
  itemSizes?: Array<Dimensions>;
  rootRef?: React.Ref<Element>;
  /**
   * When `true`, pressing the Home key moves focus to the first item,
   * and pressing the End key moves focus to the last item.
   * @default false
   */
  enableHomeAndEndKeys?: boolean;
  /**
   * When `true`, keypress events on Composite's navigation keys
   * be stopped with event.stopPropagation()
   * @default false
   */
  stopEventPropagation?: boolean;
  /**
   * Array of item indices to be considered disabled.
   * Used for composite items that are focusable when disabled.
   */
  disabledIndices?: number[];
  /**
   * Array of [modifier key values](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#modifier_keys) that should allow normal keyboard actions
   * when pressed. By default, all modifier keys prevent normal actions.
   * @default []
   */
  modifierKeys?: ModifierKey[];
}

const EMPTY_ARRAY: never[] = [];

export function useCompositeRoot(params: UseCompositeRootParameters) {
  const {
    itemSizes,
    cols = 1,
    loop = true,
    dense = false,
    orientation = 'both',
    direction,
    highlightedIndex: externalHighlightedIndex,
    onHighlightedIndexChange: externalSetHighlightedIndex,
    rootRef: externalRef,
    enableHomeAndEndKeys = false,
    stopEventPropagation = false,
    disabledIndices,
    modifierKeys = EMPTY_ARRAY,
  } = params;

  const [internalHighlightedIndex, internalSetHighlightedIndex] = React.useState(0);

  const isGrid = cols > 1;

  const rootRef = React.useRef<HTMLElement | null>(null);
  const mergedRef = useMergedRefs(rootRef, externalRef);

  const elementsRef = React.useRef<Array<HTMLDivElement | null>>([]);
  const hasSetDefaultIndexRef = React.useRef(false);

  const highlightedIndex = externalHighlightedIndex ?? internalHighlightedIndex;
  const onHighlightedIndexChange = useEventCallback((index, shouldScrollIntoView = false) => {
    (externalSetHighlightedIndex ?? internalSetHighlightedIndex)(index);
    if (shouldScrollIntoView) {
      const newActiveItem = elementsRef.current[index];
      scrollIntoViewIfNeeded(rootRef.current, newActiveItem, direction, orientation);
    }
  });

  const onMapChange = useEventCallback((map: Map<Element, CompositeMetadata<any>>) => {
    if (map.size === 0 || hasSetDefaultIndexRef.current) {
      return;
    }
    hasSetDefaultIndexRef.current = true;
    const sortedElements = Array.from(map.keys());
    const activeItem = (sortedElements.find((compositeElement) =>
      compositeElement?.hasAttribute(ACTIVE_COMPOSITE_ITEM),
    ) ?? null) as HTMLElement | null;
    // Set the default highlighted index of an arbitrary composite item.
    const activeIndex = activeItem ? sortedElements.indexOf(activeItem) : -1;

    if (activeIndex !== -1) {
      onHighlightedIndexChange(activeIndex);
    }

    scrollIntoViewIfNeeded(rootRef.current, activeItem, direction, orientation);
  });

  const props = React.useMemo<HTMLProps>(
    () => ({
      'aria-orientation': orientation === 'both' ? undefined : orientation,
      ref: mergedRef,
      onFocus(event) {
        const element = rootRef.current;
        if (!element || !isNativeInput(event.target)) {
          return;
        }
        event.target.setSelectionRange(0, event.target.value.length ?? 0);
      },
      onKeyDown(event) {
        const RELEVANT_KEYS = enableHomeAndEndKeys ? ALL_KEYS : ARROW_KEYS;
        if (!RELEVANT_KEYS.has(event.key)) {
          return;
        }

        if (isModifierKeySet(event, modifierKeys)) {
          return;
        }

        const element = rootRef.current;
        if (!element) {
          return;
        }
        const isRtl = direction === 'rtl';

        const horizontalForwardKey = isRtl ? ARROW_LEFT : ARROW_RIGHT;
        const forwardKey = {
          horizontal: horizontalForwardKey,
          vertical: ARROW_DOWN,
          both: horizontalForwardKey,
        }[orientation];
        const horizontalBackwardKey = isRtl ? ARROW_RIGHT : ARROW_LEFT;
        const backwardKey = {
          horizontal: horizontalBackwardKey,
          vertical: ARROW_UP,
          both: horizontalBackwardKey,
        }[orientation];

        if (isNativeInput(event.target) && !isElementDisabled(event.target)) {
          const selectionStart = event.target.selectionStart;
          const selectionEnd = event.target.selectionEnd;
          const textContent = event.target.value ?? '';
          // return to native textbox behavior when
          // 1 - Shift is held to make a text selection, or if there already is a text selection
          if (selectionStart == null || event.shiftKey || selectionStart !== selectionEnd) {
            return;
          }
          // 2 - arrow-ing forward and not in the last position of the text
          if (event.key !== backwardKey && selectionStart < textContent.length) {
            return;
          }
          // 3 -arrow-ing backward and not in the first position of the text
          if (event.key !== forwardKey && selectionStart > 0) {
            return;
          }
        }

        let nextIndex = highlightedIndex;
        const minIndex = getMinListIndex(elementsRef, disabledIndices);
        const maxIndex = getMaxListIndex(elementsRef, disabledIndices);

        if (isGrid) {
          const sizes =
            itemSizes ||
            Array.from({ length: elementsRef.current.length }, () => ({
              width: 1,
              height: 1,
            }));
          // To calculate movements on the grid, we use hypothetical cell indices
          // as if every item was 1x1, then convert back to real indices.
          const cellMap = createGridCellMap(sizes, cols, dense);
          const minGridIndex = cellMap.findIndex(
            (index) => index != null && !isListIndexDisabled(elementsRef, index, disabledIndices),
          );
          // last enabled index
          const maxGridIndex = cellMap.reduce(
            (foundIndex: number, index, cellIndex) =>
              index != null && !isListIndexDisabled(elementsRef, index, disabledIndices)
                ? cellIndex
                : foundIndex,
            -1,
          );

          nextIndex = cellMap[
            getGridNavigatedIndex(
              {
                current: cellMap.map((itemIndex) =>
                  itemIndex ? elementsRef.current[itemIndex] : null,
                ),
              },
              {
                event,
                orientation,
                loop,
                cols,
                // treat undefined (empty grid spaces) as disabled indices so we
                // don't end up in them
                disabledIndices: getGridCellIndices(
                  [
                    ...(disabledIndices ||
                      elementsRef.current.map((_, index) =>
                        isListIndexDisabled(elementsRef, index) ? index : undefined,
                      )),
                    undefined,
                  ],
                  cellMap,
                ),
                minIndex: minGridIndex,
                maxIndex: maxGridIndex,
                prevIndex: getGridCellIndexOfCorner(
                  highlightedIndex > maxIndex ? minIndex : highlightedIndex,
                  sizes,
                  cellMap,
                  cols,
                  // use a corner matching the edge closest to the direction we're
                  // moving in so we don't end up in the same item. Prefer
                  // top/left over bottom/right.
                  // eslint-disable-next-line no-nested-ternary
                  event.key === ARROW_DOWN ? 'bl' : event.key === ARROW_RIGHT ? 'tr' : 'tl',
                ),
                rtl: isRtl,
              },
            )
          ] as number; // navigated cell will never be nullish
        }

        const forwardKeys = {
          horizontal: [horizontalForwardKey],
          vertical: [ARROW_DOWN],
          both: [horizontalForwardKey, ARROW_DOWN],
        }[orientation];

        const backwardKeys = {
          horizontal: [horizontalBackwardKey],
          vertical: [ARROW_UP],
          both: [horizontalBackwardKey, ARROW_UP],
        }[orientation];

        const preventedKeys = isGrid
          ? RELEVANT_KEYS
          : {
              horizontal: enableHomeAndEndKeys ? HORIZONTAL_KEYS_WITH_EXTRA_KEYS : HORIZONTAL_KEYS,
              vertical: enableHomeAndEndKeys ? VERTICAL_KEYS_WITH_EXTRA_KEYS : VERTICAL_KEYS,
              both: RELEVANT_KEYS,
            }[orientation];

        if (enableHomeAndEndKeys) {
          if (event.key === HOME) {
            nextIndex = minIndex;
          } else if (event.key === END) {
            nextIndex = maxIndex;
          }
        }

        if (
          nextIndex === highlightedIndex &&
          (forwardKeys.includes(event.key) || backwardKeys.includes(event.key))
        ) {
          if (loop && nextIndex === maxIndex && forwardKeys.includes(event.key)) {
            nextIndex = minIndex;
          } else if (loop && nextIndex === minIndex && backwardKeys.includes(event.key)) {
            nextIndex = maxIndex;
          } else {
            nextIndex = findNonDisabledListIndex(elementsRef, {
              startingIndex: nextIndex,
              decrement: backwardKeys.includes(event.key),
              disabledIndices,
            });
          }
        }

        if (nextIndex !== highlightedIndex && !isIndexOutOfListBounds(elementsRef, nextIndex)) {
          if (stopEventPropagation) {
            event.stopPropagation();
          }

          if (preventedKeys.has(event.key)) {
            event.preventDefault();
          }
          onHighlightedIndexChange(nextIndex, true);

          // Wait for FocusManager `returnFocus` to execute.
          queueMicrotask(() => {
            elementsRef.current[nextIndex]?.focus();
          });
        }
      },
    }),
    [
      cols,
      dense,
      direction,
      disabledIndices,
      elementsRef,
      enableHomeAndEndKeys,
      highlightedIndex,
      isGrid,
      itemSizes,
      loop,
      mergedRef,
      modifierKeys,
      onHighlightedIndexChange,
      orientation,
      stopEventPropagation,
    ],
  );

  return React.useMemo(
    () => ({
      props,
      highlightedIndex,
      onHighlightedIndexChange,
      elementsRef,
      disabledIndices,
      onMapChange,
    }),
    [props, highlightedIndex, onHighlightedIndexChange, elementsRef, disabledIndices, onMapChange],
  );
}

function isModifierKeySet(event: React.KeyboardEvent, ignoredModifierKeys: ModifierKey[]) {
  for (const key of MODIFIER_KEYS.values()) {
    if (ignoredModifierKeys.includes(key)) {
      continue;
    }
    if (event.getModifierState(key)) {
      return true;
    }
  }
  return false;
}
