import * as React from 'react';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeReactProps } from '../../base-utils/mergeReactProps';
import { PickerValidDate } from '../../../../models';

export function useClockOptions() {
  const getOptionsProps = React.useCallback((externalProps: GenericHTMLProps) => {
    return mergeReactProps(externalProps, { role: 'listbox' });
  }, []);

  return React.useMemo(() => ({ getOptionsProps }), [getOptionsProps]);
}

export namespace useClockOptions {
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
