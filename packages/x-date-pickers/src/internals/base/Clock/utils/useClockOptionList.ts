import * as React from 'react';
import { PickerValidDate } from '../../../../models';
import { useClockRootContext } from '../root/ClockRootContext';
import { useUtils } from '../../../hooks/useUtils';
import { ClockSection } from './types';
import { ClockOptionListContext } from './ClockOptionListContext';

export function useClockOptionList(parameters: useClockOptionList.Parameters) {
  const {
    children,
    getItems,
    helpers: { getNextItem, getStartOfRange, getEndOfRange, areOptionsEqual, format, section },
  } = parameters;

  const utils = useUtils();
  const rootContext = useClockRootContext();

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
      canOptionBeTabbed,
      isOptionSelected,
      defaultFormat: format,
    }),
    [isOptionSelected, canOptionBeTabbed, section, format],
  );

  return { resolvedChildren, context };
}

export namespace useClockOptionList {
  export interface PublicParameters {
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
    helpers: {
      section: ClockSection;
      /**
       * Format to format the option to a unique string in the option list.
       * Does not take the format prop into account to make sure we have a unique string.
       */
      format: string;
      getStartOfRange: (referenceTime: PickerValidDate) => PickerValidDate;
      getEndOfRange: (referenceTime: PickerValidDate) => PickerValidDate;
      getNextItem: (date: PickerValidDate) => PickerValidDate;
      areOptionsEqual: (value: PickerValidDate, comparing: PickerValidDate) => boolean;
    };
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
