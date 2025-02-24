import * as React from 'react';
import { useUtils } from '../../../hooks/useUtils';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeReactProps } from '../../base-utils/mergeReactProps';
import { PickerValidDate } from '../../../../models';

export function useClockOption(parameters: useClockOption.Parameters) {
  const { value } = parameters;
  const utils = useUtils();

  const getOptionsProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'option',
        children: utils.format(value, 'hours24h'),
      });
    },
    [utils, value],
  );

  return React.useMemo(() => ({ getOptionsProps }), [getOptionsProps]);
}

namespace useClockOption {
  export interface Parameters {
    /**
     * The value to select when this option is clicked.
     */
    value: PickerValidDate;
    /**
     * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
     */
    ctx: Context;
  }

  export interface Context {
    isSelected: boolean;
    isDisabled: boolean;
    isInvalid: boolean;
    isTabbable: boolean;
    selectOption: (value: PickerValidDate) => void;
  }
}
