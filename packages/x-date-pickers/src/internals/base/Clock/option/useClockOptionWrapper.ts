import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import { useUtils } from '../../../hooks/useUtils';
import { PickerValidDate } from '../../../../models';
import { useClockOption } from './useClockOption';
import { useClockRootContext } from '../root/ClockRootContext';
import { useClockOptionListContext } from '../utils/ClockOptionListContext';

export function useClockOptionWrapper(
  parameters: useClockOptionWrapper.Parameters,
): useClockOptionWrapper.ReturnValue {
  const { forwardedRef, value } = parameters;
  const rootContext = useClockRootContext();
  const optionListContext = useClockOptionListContext();
  const ref = React.useRef<HTMLButtonElement>(null);
  const utils = useUtils();
  const mergedRef = useForkRef(forwardedRef, ref);

  // TODO: Fix the equality check
  const isSelected = React.useMemo(
    () => rootContext.value != null && utils.isSameHour(rootContext.value, value),
    [rootContext.value, value, utils],
  );

  const isOptionInvalid = optionListContext.isOptionInvalid;
  const isInvalid = React.useMemo(() => isOptionInvalid(value), [value, isOptionInvalid]);

  const isDisabled = React.useMemo(() => {
    if (rootContext.disabled) {
      return true;
    }

    return isInvalid;
  }, [rootContext.disabled, isInvalid]);

  const canOptionBeTabbed = optionListContext.canOptionBeTabbed;
  const isTabbable = React.useMemo(() => canOptionBeTabbed(value), [canOptionBeTabbed, value]);

  const selectOption = useEventCallback((time: PickerValidDate) => {
    if (rootContext.readOnly) {
      return;
    }

    console.log('SELECT', time);
  });

  const ctx = React.useMemo<useClockOption.Context>(
    () => ({
      isSelected,
      isDisabled,
      isInvalid,
      isTabbable,
      selectOption,
    }),
    [isSelected, isDisabled, isInvalid, isTabbable, selectOption],
  );

  return {
    ref: mergedRef,
    ctx,
  };
}

export namespace useClockOptionWrapper {
  export interface Parameters extends Pick<useClockOption.Parameters, 'value'> {
    /**
     * The ref forwarded by the parent component.
     */
    forwardedRef: React.ForwardedRef<HTMLButtonElement>;
  }

  export interface ReturnValue {
    /**
     * The ref to forward to the component.
     */
    ref: React.RefCallback<HTMLButtonElement> | null;
    /**
     * The memoized context to forward to the memoized component so that it does not need to subscribe to any context.
     */
    ctx: useClockOption.Context;
  }
}
