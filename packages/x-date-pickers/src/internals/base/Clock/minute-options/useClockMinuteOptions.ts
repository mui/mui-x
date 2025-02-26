import * as React from 'react';
import { useUtils } from '../../../hooks/useUtils';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeReactProps } from '../../base-utils/mergeReactProps';
import { PickerValidDate } from '../../../../models';
import { useClockOptionList } from '../utils/useClockOptionList';
import { endOfHour, isSameMinute, startOfHour } from '../../utils/future-adapter-methods';

export function useClockMinuteOptions(parameters: useClockMinuteOptions.Parameters) {
  const { children, getItems, step = 1 } = parameters;
  const utils = useUtils();

  const helpers = React.useMemo<useClockOptionList.Parameters['helpers']>(
    () => ({
      section: 'minute',
      format: utils.formats.minutes,
      getNextItem: (date) => utils.addMinutes(date, step),
      getStartOfRange: (value) => startOfHour(utils, value),
      getEndOfRange: (value) => endOfHour(utils, value),
      areOptionsEqual: (value, comparing) => isSameMinute(utils, value, comparing),
    }),
    [utils, step],
  );

  const { resolvedChildren, context } = useClockOptionList({
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

  return React.useMemo(() => ({ getOptionsProps, context }), [getOptionsProps, context]);
}

export namespace useClockMinuteOptions {
  export interface Parameters extends useClockOptionList.PublicParameters {
    /**
     * The step in minutes between two consecutive items.
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
