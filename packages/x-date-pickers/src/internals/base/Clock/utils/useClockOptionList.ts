import * as React from 'react';
import { PickerValidDate } from '../../../../models';
import { useClockRootContext } from '../root/ClockRootContext';
import { useUtils } from '../../../hooks/useUtils';
import { ClockPrecision, ClockSection } from './types';
import { ClockOptionListContext } from './ClockOptionListContext';
import { useScrollableList } from '../../utils/useScrollableList';
import {
  endOfHour,
  endOfMinute,
  isSameMinute,
  isSameSecond,
  startOfHour,
  startOfMinute,
} from '../../utils/future-adapter-methods';

export function useClockOptionList(parameters: useClockOptionList.Parameters) {
  const { children, getItems, focusOnMount, precision, section, step, format } = parameters;

  const utils = useUtils();
  const rootContext = useClockRootContext();
  const { scrollerRef } = useScrollableList({ focusOnMount });

  const { getStartOfRange, getEndOfRange } = React.useMemo<{
    getStartOfRange: (referenceTime: PickerValidDate) => PickerValidDate;
    getEndOfRange: (referenceTime: PickerValidDate) => PickerValidDate;
  }>(() => {
    switch (section) {
      case 'hour':
        return {
          getStartOfRange: utils.startOfDay,
          getEndOfRange: utils.endOfDay,
        };
      case 'minute':
        return {
          getStartOfRange: (value) => startOfHour(utils, value),
          getEndOfRange: (value) => endOfHour(utils, value),
        };
      case 'second':
        return {
          getStartOfRange: (value) => startOfMinute(utils, value),
          getEndOfRange: (value) => endOfMinute(utils, value),
        };
      case 'full-time': {
        return {
          getStartOfRange: utils.startOfDay,
          getEndOfRange: utils.endOfDay,
        };
      }
      default:
        throw new Error('Invalid section');
    }
  }, [utils, section]);

  const { getNextItem, areOptionsEqual } = React.useMemo<{
    getNextItem: (date: PickerValidDate) => PickerValidDate;
    areOptionsEqual: (value: PickerValidDate, comparing: PickerValidDate) => boolean;
  }>(() => {
    switch (precision) {
      case 'hour':
        return {
          getNextItem: (date) => utils.addHours(date, step),
          areOptionsEqual: utils.isSameHour,
        };
      case 'minute':
        return {
          getNextItem: (date) => utils.addMinutes(date, step),
          areOptionsEqual: (value, comparing) => isSameMinute(utils, value, comparing),
        };
      case 'second':
        return {
          getNextItem: (date) => utils.addSeconds(date, step),
          areOptionsEqual: (value, comparing) => isSameSecond(utils, value, comparing),
        };
      default:
        throw new Error('Invalid precision');
    }
  }, [utils, precision, step]);

  const items = React.useMemo(() => {
    const getDefaultItems = () => {
      const start = getStartOfRange(rootContext.referenceDate);
      const end = getEndOfRange(rootContext.referenceDate);
      let current = start;
      const tempItems: PickerValidDate[] = [];

      while (!utils.isAfter(current, end)) {
        tempItems.push(current);
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
    getStartOfRange,
    getEndOfRange,
    getNextItem,
    rootContext.referenceDate,
    rootContext.validationProps.minTime,
    rootContext.validationProps.maxTime,
  ]);

  const resolvedChildren = React.useMemo(() => {
    if (!React.isValidElement(children) && typeof children === 'function') {
      return children({ items });
    }

    return children;
  }, [children, items]);

  const canOptionBeTabbed = React.useMemo(() => {
    let tabbableOptions: PickerValidDate[];
    const selectedOptions =
      rootContext.value == null
        ? []
        : items.filter((item) => areOptionsEqual(item, rootContext.value!));
    if (selectedOptions.length > 0) {
      tabbableOptions = selectedOptions;
    } else {
      tabbableOptions = items.slice(0, 1);
    }

    const formattedTabbableOptions = new Set(
      tabbableOptions.map((option) => utils.formatByString(option, format)),
    );

    return (option: PickerValidDate) =>
      formattedTabbableOptions.has(utils.formatByString(option, format));
  }, [rootContext.value, items, areOptionsEqual, format, utils]);

  const isOptionSelected = React.useCallback(
    (option: PickerValidDate) => {
      return rootContext.value != null && areOptionsEqual(option, rootContext.value);
    },
    [rootContext.value, areOptionsEqual],
  );

  const context: ClockOptionListContext = React.useMemo(
    () => ({
      section,
      precision,
      canOptionBeTabbed,
      isOptionSelected,
      defaultFormat: format,
    }),
    [isOptionSelected, canOptionBeTabbed, section, precision, format],
  );

  return { resolvedChildren, context, scrollerRef };
}

export namespace useClockOptionList {
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
