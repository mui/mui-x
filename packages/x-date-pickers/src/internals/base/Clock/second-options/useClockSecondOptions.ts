import * as React from 'react';
import { useUtils } from '../../../hooks/useUtils';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeReactProps } from '../../base-utils/mergeReactProps';
import { PickerValidDate } from '../../../../models';
import { useClockOptionList } from '../utils/useClockOptionList';
import { startOfMinute, endOfMinute, isSameSecond } from '../../utils/future-adapter-methods';

export function useClockSecondOptions(parameters: useClockSecondOptions.Parameters) {
  const { children, getItems, step = 1 } = parameters;
  const utils = useUtils();

  const helpers = React.useMemo<useClockOptionList.Parameters['helpers']>(
    () => ({
      section: 'second',
      format: utils.formats.seconds,
      getNextItem: (date) => utils.addSeconds(date, step),
      getStartOfRange: (value) => startOfMinute(utils, value),
      getEndOfRange: (value) => endOfMinute(utils, value),
      areOptionsEqual: (value, comparing) => isSameSecond(utils, value, comparing),
    }),
    [utils, step],
  );

  const { resolvedChildren, context, scrollerRef } = useClockOptionList({
    children,
    getItems,
    helpers,
  });

  const getOptionsProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, { role: 'listbox', children: resolvedChildren });
    },
    [resolvedChildren],
  );

  return React.useMemo(
    () => ({ getOptionsProps, context, scrollerRef }),
    [getOptionsProps, context, scrollerRef],
  );
}

export namespace useClockSecondOptions {
  export interface Parameters extends useClockOptionList.PublicParameters {
    /**
     * The step in seconds between two consecutive items.
     * @default 1
     */
    step?: number;
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
