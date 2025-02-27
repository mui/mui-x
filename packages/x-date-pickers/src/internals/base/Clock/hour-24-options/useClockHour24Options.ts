import * as React from 'react';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeReactProps } from '../../base-utils/mergeReactProps';
import { useClockOptionList } from '../utils/useClockOptionList';
import { useUtils } from '../../../hooks/useUtils';

export function useClockHour24Options(parameters: useClockHour24Options.Parameters) {
  const { children, getItems } = parameters;
  const utils = useUtils();

  const { resolvedChildren, context, scrollerRef } = useClockOptionList({
    section: 'hour24',
    precision: 'hour',
    children,
    getItems,
    step: 1, // TODO: Add step prop?
    format: utils.formats.hours24h,
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

export namespace useClockHour24Options {
  export interface Parameters extends useClockOptionList.PublicParameters {}
}
