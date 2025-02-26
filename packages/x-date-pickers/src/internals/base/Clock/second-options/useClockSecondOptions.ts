import * as React from 'react';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeReactProps } from '../../base-utils/mergeReactProps';
import { useClockOptionList } from '../utils/useClockOptionList';
import { useUtils } from '../../../hooks/useUtils';

export function useClockSecondOptions(parameters: useClockSecondOptions.Parameters) {
  const { children, getItems, step = 1 } = parameters;
  const utils = useUtils();

  const { resolvedChildren, context, scrollerRef } = useClockOptionList({
    section: 'second',
    precision: 'second',
    children,
    getItems,
    step,
    format: utils.formats.seconds,
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
}
