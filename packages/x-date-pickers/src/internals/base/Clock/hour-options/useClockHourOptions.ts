import * as React from 'react';
import { useUtils } from '../../../hooks/useUtils';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeReactProps } from '../../base-utils/mergeReactProps';
import { useClockOptionList } from '../utils/useClockOptionList';

export function useClockHourOptions(parameters: useClockHourOptions.Parameters) {
  const { children, getItems } = parameters;
  const utils = useUtils();

  const helpers = React.useMemo<useClockOptionList.Parameters['helpers']>(
    () => ({
      section: 'hour',
      format: utils.formats.hours24h,
      // TODO: Add step?
      getNextItem: (date) => utils.addHours(date, 1),
      getStartOfRange: utils.startOfDay,
      getEndOfRange: utils.endOfDay,
      areOptionsEqual: utils.isSameHour,
    }),
    [utils],
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

export namespace useClockHourOptions {
  export interface Parameters extends useClockOptionList.PublicParameters {}
}
