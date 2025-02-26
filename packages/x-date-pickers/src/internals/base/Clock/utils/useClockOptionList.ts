import * as React from 'react';
import { PickerValidDate } from '../../../../models';
import { useClockRootContext } from '../root/ClockRootContext';

export function useClockOptionList(parameters: useClockOptionList.Parameters) {
  const { children, getItems, getDefaultItems } = parameters;

  const rootContext = useClockRootContext();

  const items = React.useMemo(() => {
    if (getItems) {
      return getItems({
        minTime: rootContext.validationProps.minTime,
        maxTime: rootContext.validationProps.maxTime,
        getDefaultItems,
      });
    }

    return getDefaultItems();
  }, [
    getItems,
    getDefaultItems,
    rootContext.validationProps.minTime,
    rootContext.validationProps.maxTime,
  ]);

  const resolvedChildren = React.useMemo(() => {
    if (!React.isValidElement(children) && typeof children === 'function') {
      return children({ items });
    }

    return children;
  }, [children, items]);

  return { resolvedChildren };
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
    getDefaultItems: () => PickerValidDate[];
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
