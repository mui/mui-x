import * as React from 'react';
import { isHTMLElement } from '@floating-ui/utils/dom';
import { useLatestRef } from '@base-ui-components/utils/useLatestRef';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import {
  activeElement,
  contains,
  getDocument,
  isTypeableCombobox,
  isVirtualClick,
  isVirtualPointerEvent,
  stopEvent,
  getFloatingFocusElement,
  isIndexOutOfListBounds,
  getMinListIndex,
  getMaxListIndex,
  getGridNavigatedIndex,
  isListIndexDisabled,
  createGridCellMap,
  getGridCellIndices,
  getGridCellIndexOfCorner,
  findNonDisabledListIndex,
} from '../utils';

import { useFloatingParentNodeId, useFloatingTree } from '../components/FloatingTree';
import type { Dimensions, ElementProps, FloatingRootContext } from '../types';
import { createChangeEventDetails } from '../../utils/createBaseUIEventDetails';
import { enqueueFocus } from '../utils/enqueueFocus';
import { ARROW_UP, ARROW_DOWN, ARROW_RIGHT, ARROW_LEFT } from '../utils/constants';

export const ESCAPE = 'Escape';

function doSwitch(
  orientation: UseListNavigationProps['orientation'],
  vertical: boolean,
  horizontal: boolean,
) {
  switch (orientation) {
    case 'vertical':
      return vertical;
    case 'horizontal':
      return horizontal;
    default:
      return vertical || horizontal;
  }
}

function isMainOrientationKey(key: string, orientation: UseListNavigationProps['orientation']) {
  const vertical = key === ARROW_UP || key === ARROW_DOWN;
  const horizontal = key === ARROW_LEFT || key === ARROW_RIGHT;
  return doSwitch(orientation, vertical, horizontal);
}

function isMainOrientationToEndKey(
  key: string,
  orientation: UseListNavigationProps['orientation'],
  rtl: boolean,
) {
  const vertical = key === ARROW_DOWN;
  const horizontal = rtl ? key === ARROW_LEFT : key === ARROW_RIGHT;
  return (
    doSwitch(orientation, vertical, horizontal) || key === 'Enter' || key === ' ' || key === ''
  );
}

function isCrossOrientationOpenKey(
  key: string,
  orientation: UseListNavigationProps['orientation'],
  rtl: boolean,
) {
  const vertical = rtl ? key === ARROW_LEFT : key === ARROW_RIGHT;
  const horizontal = key === ARROW_DOWN;
  return doSwitch(orientation, vertical, horizontal);
}

function isCrossOrientationCloseKey(
  key: string,
  orientation: UseListNavigationProps['orientation'],
  rtl: boolean,
  cols?: number,
) {
  const vertical = rtl ? key === ARROW_RIGHT : key === ARROW_LEFT;
  const horizontal = key === ARROW_UP;
  if (orientation === 'both' || (orientation === 'horizontal' && cols && cols > 1)) {
    return key === ESCAPE;
  }
  return doSwitch(orientation, vertical, horizontal);
}

export interface UseListNavigationProps {
  /**
   * A ref that holds an array of list items.
   * @default empty list
   */
  listRef: React.MutableRefObject<Array<HTMLElement | null>>;
  /**
   * The index of the currently active (focused or highlighted) item, which may
   * or may not be selected.
   * @default null
   */
  activeIndex: number | null;
  /**
   * A callback that is called when the user navigates to a new active item,
   * passed in a new `activeIndex`.
   */
  onNavigate?: (activeIndex: number | null, event: React.SyntheticEvent | undefined) => void;
  /**
   * Whether the Hook is enabled, including all internal Effects and event
   * handlers.
   * @default true
   */
  enabled?: boolean;
  /**
   * The currently selected item index, which may or may not be active.
   * @default null
   */
  selectedIndex?: number | null;
  /**
   * Whether to focus the item upon opening the floating element. 'auto' infers
   * what to do based on the input type (keyboard vs. pointer), while a boolean
   * value will force the value.
   * @default 'auto'
   */
  focusItemOnOpen?: boolean | 'auto';
  /**
   * Whether hovering an item synchronizes the focus.
   * @default true
   */
  focusItemOnHover?: boolean;
  /**
   * Whether pressing an arrow key on the navigation’s main axis opens the
   * floating element.
   * @default true
   */
  openOnArrowKeyDown?: boolean;
  /**
   * By default elements with either a `disabled` or `aria-disabled` attribute
   * are skipped in the list navigation — however, this requires the items to
   * be rendered.
   * This prop allows you to manually specify indices which should be disabled,
   * overriding the default logic.
   * For Windows-style select popups, where the menu does not open when
   * navigating via arrow keys, specify an empty array.
   * @default undefined
   */
  disabledIndices?: Array<number> | ((index: number) => boolean);
  /**
   * Determines whether focus can escape the list, such that nothing is selected
   * after navigating beyond the boundary of the list. In some
   * autocomplete/combobox components, this may be desired, as screen
   * readers will return to the input.
   * `loop` must be `true`.
   * @default false
   */
  allowEscape?: boolean;
  /**
   * Determines whether focus should loop around when navigating past the first
   * or last item.
   * @default false
   */
  loop?: boolean;
  /**
   * If the list is nested within another one (e.g. a nested submenu), the
   * navigation semantics change.
   * @default false
   */
  nested?: boolean;
  /**
   * Allows to specify the orientation of the parent list, which is used to
   * determine the direction of the navigation.
   * This is useful when list navigation is used within a Composite,
   * as the hook can't determine the orientation of the parent list automatically.
   */
  parentOrientation?: UseListNavigationProps['orientation'];
  /**
   * Whether the direction of the floating element’s navigation is in RTL
   * layout.
   * @default false
   */
  rtl?: boolean;
  /**
   * Whether the focus is virtual (using `aria-activedescendant`).
   * Use this if you need focus to remain on the reference element
   * (such as an input), but allow arrow keys to navigate list items.
   * This is common in autocomplete listbox components.
   * Your virtually-focused list items must have a unique `id` set on them.
   * If you’re using a component role with the `useRole()` Hook, then an `id` is
   * generated automatically.
   * @default false
   */
  virtual?: boolean;
  /**
   * The orientation in which navigation occurs.
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /**
   * Specifies how many columns the list has (i.e., it’s a grid). Use an
   * orientation of 'horizontal' (e.g. for an emoji picker/date picker, where
   * pressing ArrowRight or ArrowLeft can change rows), or 'both' (where the
   * current row cannot be escaped with ArrowRight or ArrowLeft, only ArrowUp
   * and ArrowDown).
   * @default 1
   */
  cols?: number;
  /**
   * Whether to scroll the active item into view when navigating. The default
   * value uses nearest options.
   */
  scrollItemIntoView?: boolean | ScrollIntoViewOptions;
  /**
   * Only for `cols > 1`, specify sizes for grid items.
   * `{ width: 2, height: 2 }` means an item is 2 columns wide and 2 rows tall.
   */
  itemSizes?: Dimensions[];
  /**
   * Only relevant for `cols > 1` and items with different sizes, specify if
   * the grid is dense (as defined in the CSS spec for `grid-auto-flow`).
   * @default false
   */
  dense?: boolean;
  /**
   * The id of the root component.
   */
  id?: string | undefined;
}

/**
 * Adds arrow key-based navigation of a list of items, either using real DOM
 * focus or virtual focus.
 * @see https://floating-ui.com/docs/useListNavigation
 */
export function useListNavigation(
  context: FloatingRootContext,
  props: UseListNavigationProps,
): ElementProps {
  const { open, onOpenChange, elements } = context;
  const {
    listRef,
    activeIndex,
    onNavigate: onNavigateProp = () => {},
    enabled = true,
    selectedIndex = null,
    allowEscape = false,
    loop = false,
    nested = false,
    rtl = false,
    virtual = false,
    focusItemOnOpen = 'auto',
    focusItemOnHover = true,
    openOnArrowKeyDown = true,
    disabledIndices = undefined,
    orientation = 'vertical',
    parentOrientation,
    cols = 1,
    scrollItemIntoView = true,
    itemSizes,
    dense = false,
    id,
  } = props;

  if (process.env.NODE_ENV !== 'production') {
    if (allowEscape) {
      if (!loop) {
        console.warn('`useListNavigation` looping must be enabled to allow escaping.');
      }

      if (!virtual) {
        console.warn('`useListNavigation` must be virtual to allow escaping.');
      }
    }

    if (orientation === 'vertical' && cols > 1) {
      console.warn(
        'In grid list navigation mode (`cols` > 1), the `orientation` should',
        'be either "horizontal" or "both".',
      );
    }
  }

  const floatingFocusElement = getFloatingFocusElement(elements.floating);
  const floatingFocusElementRef = useLatestRef(floatingFocusElement);

  const parentId = useFloatingParentNodeId();
  const tree = useFloatingTree();

  useIsoLayoutEffect(() => {
    context.dataRef.current.orientation = orientation;
  }, [context, orientation]);

  const typeableComboboxReference = isTypeableCombobox(elements.domReference);

  const focusItemOnOpenRef = React.useRef(focusItemOnOpen);
  const indexRef = React.useRef(selectedIndex ?? -1);
  const keyRef = React.useRef<null | string>(null);
  const isPointerModalityRef = React.useRef(true);

  const onNavigate = useEventCallback((event?: React.SyntheticEvent) => {
    onNavigateProp(indexRef.current === -1 ? null : indexRef.current, event);
  });

  const previousOnNavigateRef = React.useRef(onNavigate);
  const previousMountedRef = React.useRef(!!elements.floating);
  const previousOpenRef = React.useRef(open);
  const forceSyncFocusRef = React.useRef(false);
  const forceScrollIntoViewRef = React.useRef(false);

  const disabledIndicesRef = useLatestRef(disabledIndices);
  const latestOpenRef = useLatestRef(open);
  const scrollItemIntoViewRef = useLatestRef(scrollItemIntoView);
  const selectedIndexRef = useLatestRef(selectedIndex);

  const focusItem = useEventCallback(() => {
    function runFocus(item: HTMLElement) {
      if (virtual) {
        tree?.events.emit('virtualfocus', item);
      } else {
        enqueueFocus(item, {
          sync: forceSyncFocusRef.current,
          preventScroll: true,
        });
      }
    }

    const initialItem = listRef.current[indexRef.current];
    const forceScrollIntoView = forceScrollIntoViewRef.current;

    if (initialItem) {
      runFocus(initialItem);
    }

    const scheduler = forceSyncFocusRef.current ? (v: () => void) => v() : requestAnimationFrame;

    scheduler(() => {
      const waitedItem = listRef.current[indexRef.current] || initialItem;

      if (!waitedItem) {
        return;
      }

      if (!initialItem) {
        runFocus(waitedItem);
      }

      const scrollIntoViewOptions = scrollItemIntoViewRef.current;
      const shouldScrollIntoView =
        scrollIntoViewOptions &&
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        item &&
        (forceScrollIntoView || !isPointerModalityRef.current);

      if (shouldScrollIntoView) {
        // JSDOM doesn't support `.scrollIntoView()` but it's widely supported
        // by all browsers.
        waitedItem.scrollIntoView?.(
          typeof scrollIntoViewOptions === 'boolean'
            ? { block: 'nearest', inline: 'nearest' }
            : scrollIntoViewOptions,
        );
      }
    });
  });

  // Sync `selectedIndex` to be the `activeIndex` upon opening the floating
  // element. Also, reset `activeIndex` upon closing the floating element.
  useIsoLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    if (open && elements.floating) {
      if (focusItemOnOpenRef.current && selectedIndex != null) {
        // Regardless of the pointer modality, we want to ensure the selected
        // item comes into view when the floating element is opened.
        forceScrollIntoViewRef.current = true;
        indexRef.current = selectedIndex;
        onNavigate();
      }
    } else if (previousMountedRef.current) {
      // Since the user can specify `onNavigate` conditionally
      // (onNavigate: open ? setActiveIndex : setSelectedIndex),
      // we store and call the previous function.
      indexRef.current = -1;
      previousOnNavigateRef.current();
    }
  }, [enabled, open, elements.floating, selectedIndex, onNavigate]);

  // Sync `activeIndex` to be the focused item while the floating element is
  // open.
  useIsoLayoutEffect(() => {
    if (!enabled) {
      return;
    }
    if (!open) {
      forceSyncFocusRef.current = false;
      return;
    }
    if (!elements.floating) {
      return;
    }

    if (activeIndex == null) {
      forceSyncFocusRef.current = false;

      if (selectedIndexRef.current != null) {
        return;
      }

      // Reset while the floating element was open (e.g. the list changed).
      if (previousMountedRef.current) {
        indexRef.current = -1;
        focusItem();
      }

      // Initial sync.
      if (
        (!previousOpenRef.current || !previousMountedRef.current) &&
        focusItemOnOpenRef.current &&
        (keyRef.current != null || (focusItemOnOpenRef.current === true && keyRef.current == null))
      ) {
        let runs = 0;
        const waitForListPopulated = () => {
          if (listRef.current[0] == null) {
            // Avoid letting the browser paint if possible on the first try,
            // otherwise use rAF. Don't try more than twice, since something
            // is wrong otherwise.
            if (runs < 2) {
              const scheduler = runs ? requestAnimationFrame : queueMicrotask;
              scheduler(waitForListPopulated);
            }
            runs += 1;
          } else {
            // initially focus the first non-disabled item
            indexRef.current =
              keyRef.current == null ||
              isMainOrientationToEndKey(keyRef.current, orientation, rtl) ||
              nested
                ? getMinListIndex(listRef)
                : getMaxListIndex(listRef);
            keyRef.current = null;
            onNavigate();
          }
        };

        waitForListPopulated();
      }
    } else if (!isIndexOutOfListBounds(listRef, activeIndex)) {
      indexRef.current = activeIndex;
      focusItem();
      forceScrollIntoViewRef.current = false;
    }
  }, [
    enabled,
    open,
    elements.floating,
    activeIndex,
    selectedIndexRef,
    nested,
    listRef,
    orientation,
    rtl,
    onNavigate,
    focusItem,
    disabledIndicesRef,
  ]);

  // Ensure the parent floating element has focus when a nested child closes
  // to allow arrow key navigation to work after the pointer leaves the child.
  useIsoLayoutEffect(() => {
    if (!enabled || elements.floating || !tree || virtual || !previousMountedRef.current) {
      return;
    }

    const nodes = tree.nodesRef.current;
    const parent = nodes.find((node) => node.id === parentId)?.context?.elements.floating;
    const activeEl = activeElement(getDocument(elements.floating));
    const treeContainsActiveEl = nodes.some(
      (node) => node.context && contains(node.context.elements.floating, activeEl),
    );

    if (parent && !treeContainsActiveEl && isPointerModalityRef.current) {
      parent.focus({ preventScroll: true });
    }
  }, [enabled, elements.floating, tree, parentId, virtual]);

  useIsoLayoutEffect(() => {
    previousOnNavigateRef.current = onNavigate;
    previousOpenRef.current = open;
    previousMountedRef.current = !!elements.floating;
  });

  useIsoLayoutEffect(() => {
    if (!open) {
      keyRef.current = null;
      focusItemOnOpenRef.current = focusItemOnOpen;
    }
  }, [open, focusItemOnOpen]);

  const hasActiveIndex = activeIndex != null;

  const item = React.useMemo(() => {
    function syncCurrentTarget(event: React.SyntheticEvent<any>) {
      if (!latestOpenRef.current) {
        return;
      }
      const index = listRef.current.indexOf(event.currentTarget);
      if (index !== -1 && indexRef.current !== index) {
        indexRef.current = index;
        onNavigate(event);
      }
    }

    const itemProps: ElementProps['item'] = {
      onFocus(event) {
        forceSyncFocusRef.current = true;
        syncCurrentTarget(event);
      },
      onClick: ({ currentTarget }) => currentTarget.focus({ preventScroll: true }), // Safari
      onMouseMove(event) {
        forceSyncFocusRef.current = true;
        forceScrollIntoViewRef.current = false;
        if (focusItemOnHover) {
          syncCurrentTarget(event);
        }
      },
      onPointerLeave(event) {
        if (!isPointerModalityRef.current || event.pointerType === 'touch') {
          return;
        }

        forceSyncFocusRef.current = true;

        const relatedTarget = event.relatedTarget as HTMLElement | null;

        if (!focusItemOnHover || listRef.current.includes(relatedTarget)) {
          return;
        }

        indexRef.current = -1;
        onNavigate(event);

        if (!virtual) {
          floatingFocusElementRef.current?.focus({ preventScroll: true });
        }
      },
    };

    return itemProps;
  }, [latestOpenRef, floatingFocusElementRef, focusItemOnHover, listRef, onNavigate, virtual]);

  const getParentOrientation = React.useCallback(() => {
    return (
      parentOrientation ??
      (tree?.nodesRef.current.find((node) => node.id === parentId)?.context?.dataRef?.current
        .orientation as UseListNavigationProps['orientation'])
    );
  }, [parentId, tree, parentOrientation]);

  const commonOnKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    isPointerModalityRef.current = false;
    forceSyncFocusRef.current = true;

    // When composing a character, Chrome fires ArrowDown twice. Firefox/Safari
    // don't appear to suffer from this. `event.isComposing` is avoided due to
    // Safari not supporting it properly (although it's not needed in the first
    // place for Safari, just avoiding any possible issues).
    if (event.which === 229) {
      return;
    }

    // If the floating element is animating out, ignore navigation. Otherwise,
    // the `activeIndex` gets set to 0 despite not being open so the next time
    // the user ArrowDowns, the first item won't be focused.
    if (!latestOpenRef.current && event.currentTarget === floatingFocusElementRef.current) {
      return;
    }

    if (nested && isCrossOrientationCloseKey(event.key, orientation, rtl, cols)) {
      // If the nested list's close key is also the parent navigation key,
      // let the parent navigate. Otherwise, stop propagating the event.
      if (!isMainOrientationKey(event.key, getParentOrientation())) {
        stopEvent(event);
      }

      onOpenChange(false, createChangeEventDetails('list-navigation', event.nativeEvent));

      if (isHTMLElement(elements.domReference)) {
        if (virtual) {
          tree?.events.emit('virtualfocus', elements.domReference);
        } else {
          elements.domReference.focus();
        }
      }

      return;
    }

    const currentIndex = indexRef.current;
    const minIndex = getMinListIndex(listRef, disabledIndices);
    const maxIndex = getMaxListIndex(listRef, disabledIndices);

    if (!typeableComboboxReference) {
      if (event.key === 'Home') {
        stopEvent(event);
        indexRef.current = minIndex;
        onNavigate(event);
      }

      if (event.key === 'End') {
        stopEvent(event);
        indexRef.current = maxIndex;
        onNavigate(event);
      }
    }

    // Grid navigation.
    if (cols > 1) {
      const sizes =
        itemSizes ||
        Array.from({ length: listRef.current.length }, () => ({
          width: 1,
          height: 1,
        }));
      // To calculate movements on the grid, we use hypothetical cell indices
      // as if every item was 1x1, then convert back to real indices.
      const cellMap = createGridCellMap(sizes, cols, dense);
      const minGridIndex = cellMap.findIndex(
        (index) => index != null && !isListIndexDisabled(listRef, index, disabledIndices),
      );
      // last enabled index
      const maxGridIndex = cellMap.reduce(
        (foundIndex: number, index, cellIndex) =>
          index != null && !isListIndexDisabled(listRef, index, disabledIndices)
            ? cellIndex
            : foundIndex,
        -1,
      );

      const index =
        cellMap[
          getGridNavigatedIndex(
            {
              current: cellMap.map((itemIndex) =>
                itemIndex != null ? listRef.current[itemIndex] : null,
              ),
            },
            {
              event,
              orientation,
              loop,
              rtl,
              cols,
              // treat undefined (empty grid spaces) as disabled indices so we
              // don't end up in them
              disabledIndices: getGridCellIndices(
                [
                  ...((typeof disabledIndices !== 'function' ? disabledIndices : null) ||
                    listRef.current.map((_, listIndex) =>
                      isListIndexDisabled(listRef, listIndex, disabledIndices)
                        ? listIndex
                        : undefined,
                    )),
                  undefined,
                ],
                cellMap,
              ),
              minIndex: minGridIndex,
              maxIndex: maxGridIndex,
              prevIndex: getGridCellIndexOfCorner(
                indexRef.current > maxIndex ? minIndex : indexRef.current,
                sizes,
                cellMap,
                cols,
                // use a corner matching the edge closest to the direction
                // we're moving in so we don't end up in the same item. Prefer
                // top/left over bottom/right.
                // eslint-disable-next-line no-nested-ternary
                event.key === ARROW_DOWN
                  ? 'bl'
                  : event.key === (rtl ? ARROW_LEFT : ARROW_RIGHT)
                    ? 'tr'
                    : 'tl',
              ),
              stopEvent: true,
            },
          )
        ];

      if (index != null) {
        indexRef.current = index;
        onNavigate(event);
      }

      if (orientation === 'both') {
        return;
      }
    }

    if (isMainOrientationKey(event.key, orientation)) {
      stopEvent(event);

      // Reset the index if no item is focused.
      if (
        open &&
        !virtual &&
        activeElement(event.currentTarget.ownerDocument) === event.currentTarget
      ) {
        indexRef.current = isMainOrientationToEndKey(event.key, orientation, rtl)
          ? minIndex
          : maxIndex;
        onNavigate(event);
        return;
      }

      if (isMainOrientationToEndKey(event.key, orientation, rtl)) {
        if (loop) {
          if (currentIndex >= maxIndex) {
            if (allowEscape && currentIndex !== listRef.current.length) {
              indexRef.current = -1;
            } else {
              // Give time for virtualizers to update the listRef.
              forceSyncFocusRef.current = false;
              indexRef.current = minIndex;
            }
          } else {
            indexRef.current = findNonDisabledListIndex(listRef, {
              startingIndex: currentIndex,
              disabledIndices,
            });
          }
        } else {
          indexRef.current = Math.min(
            maxIndex,
            findNonDisabledListIndex(listRef, {
              startingIndex: currentIndex,
              disabledIndices,
            }),
          );
        }
      } else if (loop) {
        if (currentIndex <= minIndex) {
          if (allowEscape && currentIndex !== -1) {
            indexRef.current = listRef.current.length;
          } else {
            // Give time for virtualizers to update the listRef.
            forceSyncFocusRef.current = false;
            indexRef.current = maxIndex;
          }
        } else {
          indexRef.current = findNonDisabledListIndex(listRef, {
            startingIndex: currentIndex,
            decrement: true,
            disabledIndices,
          });
        }
      } else {
        indexRef.current = Math.max(
          minIndex,
          findNonDisabledListIndex(listRef, {
            startingIndex: currentIndex,
            decrement: true,
            disabledIndices,
          }),
        );
      }

      if (isIndexOutOfListBounds(listRef, indexRef.current)) {
        indexRef.current = -1;
      }

      onNavigate(event);
    }
  });

  const ariaActiveDescendantProp = React.useMemo(() => {
    return (
      virtual &&
      open &&
      hasActiveIndex && {
        'aria-activedescendant': `${id}-${activeIndex}`,
      }
    );
  }, [virtual, open, hasActiveIndex, id, activeIndex]);

  const floating: ElementProps['floating'] = React.useMemo(() => {
    return {
      'aria-orientation': orientation === 'both' ? undefined : orientation,
      ...(!typeableComboboxReference ? ariaActiveDescendantProp : {}),
      onKeyDown(event: React.KeyboardEvent) {
        // Close submenu on Shift+Tab
        if (event.key === 'Tab' && event.shiftKey && open && !virtual) {
          stopEvent(event);
          onOpenChange(false, createChangeEventDetails('list-navigation', event.nativeEvent));

          if (isHTMLElement(elements.domReference)) {
            elements.domReference.focus();
          }

          return;
        }

        commonOnKeyDown(event);
      },
      onPointerMove() {
        isPointerModalityRef.current = true;
      },
    };
  }, [
    ariaActiveDescendantProp,
    commonOnKeyDown,
    orientation,
    typeableComboboxReference,
    onOpenChange,
    open,
    virtual,
    elements.domReference,
  ]);

  const reference: ElementProps['reference'] = React.useMemo(() => {
    function checkVirtualMouse(event: React.PointerEvent) {
      if (focusItemOnOpen === 'auto' && isVirtualClick(event.nativeEvent)) {
        focusItemOnOpenRef.current = !virtual;
      }
    }

    function checkVirtualPointer(event: React.PointerEvent) {
      // `pointerdown` fires first, reset the state then perform the checks.
      focusItemOnOpenRef.current = focusItemOnOpen;
      if (focusItemOnOpen === 'auto' && isVirtualPointerEvent(event.nativeEvent)) {
        focusItemOnOpenRef.current = true;
      }
    }

    return {
      ...ariaActiveDescendantProp,
      onKeyDown(event) {
        isPointerModalityRef.current = false;

        const isArrowKey = event.key.startsWith('Arrow');
        const isParentCrossOpenKey = isCrossOrientationOpenKey(
          event.key,
          getParentOrientation(),
          rtl,
        );
        const isMainKey = isMainOrientationKey(event.key, orientation);
        const isNavigationKey =
          (nested ? isParentCrossOpenKey : isMainKey) ||
          event.key === 'Enter' ||
          event.key.trim() === '';

        if (virtual && open) {
          return commonOnKeyDown(event);
        }

        // If a floating element should not open on arrow key down, avoid
        // setting `activeIndex` while it's closed.
        if (!open && !openOnArrowKeyDown && isArrowKey) {
          return undefined;
        }

        if (isNavigationKey) {
          const isParentMainKey = isMainOrientationKey(event.key, getParentOrientation());
          keyRef.current = nested && isParentMainKey ? null : event.key;
        }

        if (nested) {
          if (isParentCrossOpenKey) {
            stopEvent(event);

            if (open) {
              indexRef.current = getMinListIndex(listRef, disabledIndicesRef.current);
              onNavigate(event);
            } else {
              onOpenChange(true, createChangeEventDetails('list-navigation', event.nativeEvent));
            }
          }

          return undefined;
        }

        if (isMainKey) {
          if (selectedIndex != null) {
            indexRef.current = selectedIndex;
          }

          stopEvent(event);

          if (!open && openOnArrowKeyDown) {
            onOpenChange(true, createChangeEventDetails('list-navigation', event.nativeEvent));
          } else {
            commonOnKeyDown(event);
          }

          if (open) {
            onNavigate(event);
          }
        }

        return undefined;
      },
      onFocus(event) {
        if (open && !virtual) {
          indexRef.current = -1;
          onNavigate(event);
        }
      },
      onPointerDown: checkVirtualPointer,
      onPointerEnter: checkVirtualPointer,
      onMouseDown: checkVirtualMouse,
      onClick: checkVirtualMouse,
    };
  }, [
    ariaActiveDescendantProp,
    commonOnKeyDown,
    disabledIndicesRef,
    focusItemOnOpen,
    listRef,
    nested,
    onNavigate,
    onOpenChange,
    open,
    openOnArrowKeyDown,
    orientation,
    getParentOrientation,
    rtl,
    selectedIndex,
    virtual,
  ]);

  return React.useMemo(
    () => (enabled ? { reference, floating, item } : {}),
    [enabled, reference, floating, item],
  );
}
