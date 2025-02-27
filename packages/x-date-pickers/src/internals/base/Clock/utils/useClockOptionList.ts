import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { useClockRootContext } from '../root/ClockRootContext';
import { useUtils } from '../../../hooks/useUtils';
import { ClockPrecision, ClockSection } from './types';
import { ClockOptionListContext } from './ClockOptionListContext';
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

export function useClockOptionList(parameters: useClockOptionList.Parameters) {
  const {
    children,
    getItems,
    focusOnMount,
    precision,
    section,
    step,
    format,
    loop = false,
  } = parameters;

  const utils = useUtils();
  const rootContext = useClockRootContext();
  const { scrollerRef } = useScrollableList({ focusOnMount });
  const optionsRef = React.useRef<(HTMLElement | null)[]>([]);

  const { getFirstOption, getEndOfRange } = React.useMemo<{
    getFirstOption: (referenceTime: PickerValidDate) => PickerValidDate;
    getEndOfRange: (referenceTime: PickerValidDate) => PickerValidDate;
  }>(() => {
    switch (section) {
      case 'meridiem': {
        return {
          getFirstOption: (value) => {
            const currentHour = utils.getHours(value);
            return currentHour > 11 ? utils.setHours(value, currentHour - 12) : value;
          },
          getEndOfRange: utils.endOfDay,
        };
      }
      case 'hour24':
        return {
          getFirstOption: (value) => utils.setHours(value, 0),
          getEndOfRange: utils.endOfDay,
        };
      case 'hour12':
        return {
          getFirstOption: (value) => utils.setHours(value, utils.getHours(value) > 11 ? 12 : 0),
          getEndOfRange: (value) => endOfMeridiem(utils, value),
        };
      case 'minute':
        return {
          getFirstOption: (value) => utils.setMinutes(value, 0),
          getEndOfRange: (value) => endOfHour(utils, value),
        };
      case 'second':
        return {
          getFirstOption: (value) => utils.setSeconds(value, 0),
          getEndOfRange: (value) => endOfMinute(utils, value),
        };
      case 'full-time': {
        return {
          getFirstOption: (value) => {
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

  const { getNextItem, areOptionsEqual } = React.useMemo<{
    getNextItem: (date: PickerValidDate) => PickerValidDate;
    areOptionsEqual: (value: PickerValidDate, comparing: PickerValidDate) => boolean;
  }>(() => {
    switch (precision) {
      case 'meridiem': {
        return {
          getNextItem: (date) => utils.addHours(date, 12),
          areOptionsEqual: (value, comparing) => isSameMeridiem(utils, value, comparing),
        };
      }
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
      const firstOption = getFirstOption(rootContext.referenceDate);
      const boundary = getEndOfRange(rootContext.referenceDate);
      let current = firstOption;
      const tempItems: PickerValidDate[] = [];

      while (!utils.isAfter(current, boundary)) {
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
    getFirstOption,
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

  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    navigateInList({
      options: optionsRef.current,
      event,
      loop,
    });
  });

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

  const getOptionsProps = React.useCallback(
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
    () => ({ context, scrollerRef, optionsRef, getOptionsProps }),
    [context, scrollerRef, optionsRef, getOptionsProps],
  );
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
