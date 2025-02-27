import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { useClockOption } from './useClockOption';
import { useClockRootContext } from '../root/ClockRootContext';
import { useClockOptionListContext } from '../utils/ClockOptionListContext';
import { useCompositeListItem } from '../../composite/list/useCompositeListItem';

export function useClockOptionWrapper(
  parameters: useClockOptionWrapper.Parameters,
): useClockOptionWrapper.ReturnValue {
  const { forwardedRef, value, format } = parameters;
  const rootContext = useClockRootContext();
  const optionListContext = useClockOptionListContext();
  const { ref: listItemRef } = useCompositeListItem();
  const mergedRef = useForkRef(forwardedRef, listItemRef);

  const isOptionSelected = optionListContext.isOptionSelected;
  const isSelected = React.useMemo(() => isOptionSelected(value), [isOptionSelected, value]);

  const isOptionInvalid = rootContext.isOptionInvalid;
  const isInvalid = React.useMemo(
    () => isOptionInvalid(value, optionListContext.precision),
    [value, isOptionInvalid, optionListContext.precision],
  );

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

    rootContext.setValue(time, { section: optionListContext.section });
  });

  const ctx = React.useMemo<useClockOption.Context>(
    () => ({
      isSelected,
      isDisabled,
      isInvalid,
      isTabbable,
      selectOption,
      format: format ?? optionListContext.defaultFormat,
    }),
    [
      isSelected,
      isDisabled,
      isInvalid,
      isTabbable,
      selectOption,
      format,
      optionListContext.defaultFormat,
    ],
  );

  return {
    ref: mergedRef,
    ctx,
  };
}

export namespace useClockOptionWrapper {
  export interface Parameters extends Pick<useClockOption.Parameters, 'value' | 'format'> {
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
