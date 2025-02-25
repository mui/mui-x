import * as React from 'react';
import { useUtils } from '../../../hooks/useUtils';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeReactProps } from '../../base-utils/mergeReactProps';
import { PickerValidDate } from '../../../../models';
import { useClockRootContext } from '../root/ClockRootContext';
import { ClockOptionListContext } from '../utils/ClockOptionListContext';

export function useClockHourOptions(parameters: useClockHourOptions.Parameters) {
  const { children, getItems } = parameters;
  const utils = useUtils();
  const clockRootContext = useClockRootContext();

  const items = React.useMemo(() => {
    const getDefaultItems = () => {
      return Array.from({ length: 24 }, (_, index) => utils.setHours(utils.date(), index));
    };

    if (getItems) {
      return getItems({
        minTime: clockRootContext.validationProps.minTime,
        maxTime: clockRootContext.validationProps.maxTime,
        getDefaultItems,
      });
    }

    return getDefaultItems();
  }, [
    utils,
    getItems,
    clockRootContext.validationProps.minTime,
    clockRootContext.validationProps.maxTime,
  ]);

  const resolvedChildren = React.useMemo(() => {
    if (!React.isValidElement(children) && typeof children === 'function') {
      return children({ items });
    }

    return children;
  }, [children, items]);

  const context: ClockOptionListContext = React.useMemo(
    () => ({
      canOptionBeTabbed: () => true,
      isOptionInvalid: () => false,
      section: 'minute',
    }),
    [],
  );

  const getOptionsProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, { role: 'listbox', children: resolvedChildren });
    },
    [resolvedChildren],
  );

  return React.useMemo(() => ({ getOptionsProps, context }), [getOptionsProps, context]);
}

export namespace useClockHourOptions {
  export interface Parameters {
    /**
     * Generate the list of items to render.
     * @param {GetItemsParameters} parameters The current parameters of the list.
     * @returns {PickerValidDate[]} The list of items.
     */
    getItems?: (parameters: GetItemsParameters) => PickerValidDate[];
    /**
     * The children of the component.
     * If a function is provided, it will be called with the public context as its parameter.
     */
    children?: React.ReactNode | ((parameters: ChildrenParameters) => React.ReactNode);
  }

  export interface ChildrenParameters {
    items: PickerValidDate[];
  }

  export interface GetItemsParameters {
    /**
     * The minimum valid time of the clock.
     */
    minTime: PickerValidDate | undefined;
    /**
     * The maximum valid time of the clock.
     */
    maxTime: PickerValidDate | undefined;
    /**
     * A function that returns the items that would be rendered if getItems is not provided.
     * @returns {PickerValidDate[]} The list of the items to render.
     */
    getDefaultItems: () => PickerValidDate[];
  }
}
