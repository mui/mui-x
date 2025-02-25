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
  const rootContext = useClockRootContext();

  const items = React.useMemo(() => {
    const getDefaultItems = () => {
      return Array.from({ length: 24 }, (_, index) =>
        utils.setHours(rootContext.referenceDate, index),
      );
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
    rootContext.validationProps.minTime,
    rootContext.validationProps.maxTime,
    rootContext.referenceDate,
  ]);

  const resolvedChildren = React.useMemo(() => {
    if (!React.isValidElement(children) && typeof children === 'function') {
      return children({ items });
    }

    return children;
  }, [children, items]);

  const isOptionSelected = React.useCallback(
    (option: PickerValidDate) => {
      return rootContext.value != null && utils.isSameHour(option, rootContext.value);
    },
    [rootContext.value, utils],
  );

  const context: ClockOptionListContext = React.useMemo(
    () => ({
      canOptionBeTabbed: () => true,
      isOptionInvalid: () => false,
      isOptionSelected,
      section: 'hour',
      format: utils.formats.hours24h,
    }),
    [utils, isOptionSelected],
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
