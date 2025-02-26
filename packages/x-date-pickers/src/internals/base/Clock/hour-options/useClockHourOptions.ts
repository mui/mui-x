import * as React from 'react';
import { useUtils } from '../../../hooks/useUtils';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeReactProps } from '../../base-utils/mergeReactProps';
import { PickerValidDate } from '../../../../models';
import { useClockRootContext } from '../root/ClockRootContext';
import { ClockOptionListContext } from '../utils/ClockOptionListContext';
import { useClockOptionList } from '../utils/useClockOptionList';

export function useClockHourOptions(parameters: useClockHourOptions.Parameters) {
  const { children, getItems } = parameters;
  const utils = useUtils();
  const rootContext = useClockRootContext();

  const getDefaultItems = React.useCallback(() => {
    return Array.from({ length: 24 }, (_, index) =>
      utils.setHours(rootContext.referenceDate, index),
    );
  }, [utils, rootContext.referenceDate]);

  const { resolvedChildren } = useClockOptionList({
    getDefaultItems,
    getItems,
    children,
  });

  const isOptionSelected = React.useCallback(
    (option: PickerValidDate) => {
      return rootContext.value != null && utils.isSameHour(option, rootContext.value);
    },
    [rootContext.value, utils],
  );

  const context: ClockOptionListContext = React.useMemo(
    () => ({
      canOptionBeTabbed: () => true,
      isOptionSelected,
      section: 'hour',
      defaultFormat: utils.formats.hours24h,
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
  export interface Parameters extends useClockOptionList.PublicParameters {}
}
