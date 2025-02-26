import * as React from 'react';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeReactProps } from '../../base-utils/mergeReactProps';
import { useClockOptionList } from '../utils/useClockOptionList';
import { useUtils } from '../../../hooks/useUtils';

export function useClockMinuteOptions(parameters: useClockMinuteOptions.Parameters) {
  const { children, getItems, step = 1 } = parameters;
  const utils = useUtils();

  const { resolvedChildren, context, scrollerRef } = useClockOptionList({
    section: 'minute',
    precision: 'minute',
    children,
    getItems,
    step,
    format: utils.formats.minutes,
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

export namespace useClockMinuteOptions {
  export interface Parameters extends useClockOptionList.PublicParameters {
    /**
     * The step in minutes between two consecutive items.
     * @default 1
     */
    step?: number;
  }
}
