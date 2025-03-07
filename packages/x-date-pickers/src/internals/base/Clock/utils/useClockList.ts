import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { useClockRootContext } from '../root/ClockRootContext';
import { useUtils } from '../../../hooks/useUtils';
import { ClockPrecision, ClockSection } from './types';
import { ClockListContext } from './ClockListContext';
import { useScrollableList } from '../../utils/useScrollableList';
import {
  endOfHour,
  endOfMeridiem,
  endOfMinute,
  isSameMeridiem,
  isSameMinute,
  isSameSecond,
} from '../../utils/future-adapter-methods';
import { navigateInList } from './keyboardNavigation';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeReactProps } from '../../base-utils/mergeReactProps';

export function useClockList(parameters: useClockList.Parameters) {
  const {
    children,
    getItems,
    focusOnMount,
    precision,
    section,
    step,
    format,
    loop = false,
    skipInvalidItems = false,
  } = parameters;

  const utils = useUtils();
  const rootContext = useClockRootContext();
  const { scrollerRef } = useScrollableList({ focusOnMount });
  const cellsRef = React.useRef<(HTMLElement | null)[]>([]);

  const valueOrReferenceDate = rootContext.value ?? rootContext.referenceDate;

  const { getFirstItem, getEndOfRange } = React.useMemo<{
    getFirstItem: (referenceTime: PickerValidDate) => PickerValidDate;
    getEndOfRange: (referenceTime: PickerValidDate) => PickerValidDate;
  }>(() => {
    switch (section) {
      case 'meridiem': {
        return {
          getFirstItem: (value) => {
            const currentHour = utils.getHours(value);
            return currentHour > 11 ? utils.setHours(value, currentHour - 12) : value;
          },
          getEndOfRange: utils.endOfDay,
        };
      }
      case 'hour24':
        return {
          getFirstItem: (value) => utils.setHours(value, 0),
          getEndOfRange: utils.endOfDay,
        };
      case 'hour12':
        return {
          getFirstItem: (value) => utils.setHours(value, utils.getHours(value) > 11 ? 12 : 0),
          getEndOfRange: (value) => endOfMeridiem(utils, value),
        };
      case 'minute':
        return {
          getFirstItem: (value) => utils.setMinutes(value, 0),
          getEndOfRange: (value) => endOfHour(utils, value),
        };
      case 'second':
        return {
          getFirstItem: (value) => utils.setSeconds(value, 0),
          getEndOfRange: (value) => endOfMinute(utils, value),
        };
      case 'full-time': {
        return {
          getFirstItem: (value) => {
            // TODO: Check if this is correct
            return utils.startOfDay(value);
          },
          getEndOfRange: utils.endOfDay,
        };
      }
      default:
        throw new Error('Invalid section');
    }
  }, [utils, section]);

  const { getNextItem, areItemsEqual } = React.useMemo<{
    getNextItem: (date: PickerValidDate) => PickerValidDate;
    areItemsEqual: (value: PickerValidDate, comparing: PickerValidDate) => boolean;
  }>(() => {
    switch (precision) {
      case 'meridiem': {
        return {
          getNextItem: (date) => utils.addHours(date, 12),
          areItemsEqual: (value, comparing) => isSameMeridiem(utils, value, comparing),
        };
      }
      case 'hour':
        return {
          getNextItem: (date) => utils.addHours(date, step),
          areItemsEqual: utils.isSameHour,
        };
      case 'minute':
        return {
          getNextItem: (date) => utils.addMinutes(date, step),
          areItemsEqual: (value, comparing) => isSameMinute(utils, value, comparing),
        };
      case 'second':
        return {
          getNextItem: (date) => utils.addSeconds(date, step),
          areItemsEqual: (value, comparing) => isSameSecond(utils, value, comparing),
        };
      default:
        throw new Error('Invalid precision');
    }
  }, [utils, precision, step]);

  const isItemInvalid = rootContext.isItemInvalid;
  const items = React.useMemo(() => {
    const getDefaultItems = () => {
      const fistItem = getFirstItem(valueOrReferenceDate);
      const boundary = getEndOfRange(valueOrReferenceDate);
      let current = fistItem;
      const tempItems: PickerValidDate[] = [];

      while (!utils.isAfter(current, boundary)) {
        if (!skipInvalidItems || !isItemInvalid(current, precision)) {
          tempItems.push(current);
        }
        current = getNextItem(current);
      }

      return tempItems;
    };

    if (getItems) {
      return getItems({
        minTime: rootContext.validationProps.minTime,
        maxTime: rootContext.validationProps.maxTime,
        getDefaultItems,
      });
    }

    return getDefaultItems();
  }, [
    utils,
    getItems,
    getFirstItem,
    getEndOfRange,
    getNextItem,
    isItemInvalid,
    precision,
    skipInvalidItems,
    valueOrReferenceDate,
    rootContext.validationProps.minTime,
    rootContext.validationProps.maxTime,
  ]);

  const resolvedChildren = React.useMemo(() => {
    if (!React.isValidElement(children) && typeof children === 'function') {
      return children({ items });
    }

    return children;
  }, [children, items]);

  const canItemBeTabbed = React.useMemo(() => {
    let tabbableItems: PickerValidDate[];
    const selectedItems =
      rootContext.value == null
        ? []
        : items.filter((item) => areItemsEqual(item, rootContext.value!));
    if (selectedItems.length > 0) {
      tabbableItems = selectedItems;
    } else {
      tabbableItems = items.slice(0, 1);
    }

    const formattedTabbableItems = new Set(
      tabbableItems.map((item) => utils.formatByString(item, format)),
    );

    return (item: PickerValidDate) =>
      formattedTabbableItems.has(utils.formatByString(item, format));
  }, [rootContext.value, items, areItemsEqual, format, utils]);

  const isItemSelected = React.useCallback(
    (item: PickerValidDate) => {
      return rootContext.value != null && areItemsEqual(item, rootContext.value);
    },
    [rootContext.value, areItemsEqual],
  );

  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    navigateInList({
      cells: cellsRef.current,
      event,
      loop,
    });
  });

  const context: ClockListContext = React.useMemo(
    () => ({
      section,
      precision,
      canItemBeTabbed,
      isItemSelected,
      defaultFormat: format,
    }),
    [isItemSelected, canItemBeTabbed, section, precision, format],
  );

  const getListProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'listbox',
        children: resolvedChildren,
        onKeyDown,
      });
    },
    [resolvedChildren, onKeyDown],
  );

  return React.useMemo(
    () => ({ context, scrollerRef, cellsRef, getListProps }),
    [context, scrollerRef, cellsRef, getListProps],
  );
}

export namespace useClockList {
  export interface PublicParameters extends useScrollableList.Parameters {
    /**
     * The children of the component.
     * If a function is provided, it will be called with the public context as its parameter.
     */
    children?: React.ReactNode | ((parameters: ChildrenParameters) => React.ReactNode);
    /**
     * Generate the list of items to render.
     * @param {GetItemsParameters} parameters The current parameters of the list.
     * @returns {PickerValidDate[]} The list of items.
     */
    getItems?: (parameters: GetItemsParameters) => PickerValidDate[];
    // Behavior change: Equivalent of skipDisabled in the old implementation
    /**
     * If `true`, the invalid items will not be rendered.
     * @default false
     */
    skipInvalidItems?: boolean;
    /**
     * Whether to loop keyboard focus back to the first item
     * when the end of the list is reached while using the arrow keys.
     * @default true
     */
    loop?: boolean;
  }

  export interface Parameters extends PublicParameters {
    section: ClockSection;
    precision: ClockPrecision;
    step: number;
    format: string;
  }

  export interface ChildrenParameters {
    items: PickerValidDate[];
  }

  export interface GetItemsParameters {
    /**
     * The minimum valid time.
     */
    minTime: PickerValidDate | undefined;
    /**
     * The maximum valid time.
     */
    maxTime: PickerValidDate | undefined;
    /**
     * A function that returns the items that would be rendered if getItems is not provided.
     * @returns {PickerValidDate[]} The list of the items to render.
     */
    getDefaultItems: () => PickerValidDate[];
  }
}
