import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { useClockCell } from './useClockCell';
import { useClockRootContext } from '../root/ClockRootContext';
import { useClockListContext } from '../utils/ClockListContext';
import { useCompositeListItem } from '../../base-utils/composite/list/useCompositeListItem';

export function useClockCellWrapper(
  parameters: useClockCellWrapper.Parameters,
): useClockCellWrapper.ReturnValue {
  const { forwardedRef, value, format } = parameters;
  const rootContext = useClockRootContext();
  const listContext = useClockListContext();
  const { ref: listItemRef } = useCompositeListItem();
  const mergedRef = useForkRef(forwardedRef, listItemRef);

  const isItemSelected = listContext.isItemSelected;
  const isSelected = React.useMemo(() => isItemSelected(value), [isItemSelected, value]);

  const isItemInvalid = rootContext.isItemInvalid;
  const isInvalid = React.useMemo(
    () => isItemInvalid(value, listContext.precision),
    [value, isItemInvalid, listContext.precision],
  );

  const isDisabled = React.useMemo(() => {
    if (rootContext.disabled) {
      return true;
    }

    return isInvalid;
  }, [rootContext.disabled, isInvalid]);

  const canItemBeTabbed = listContext.canItemBeTabbed;
  const isTabbable = React.useMemo(() => canItemBeTabbed(value), [canItemBeTabbed, value]);

  const selectItem = useEventCallback((item: PickerValidDate) => {
    if (rootContext.readOnly) {
      return;
    }

    rootContext.setValue(item, { section: listContext.section });
  });

  const ctx = React.useMemo<useClockCell.Context>(
    () => ({
      isSelected,
      isDisabled,
      isInvalid,
      isTabbable,
      selectItem,
      format: format ?? listContext.defaultFormat,
    }),
    [isSelected, isDisabled, isInvalid, isTabbable, selectItem, format, listContext.defaultFormat],
  );

  return {
    ref: mergedRef,
    ctx,
  };
}

export namespace useClockCellWrapper {
  export interface Parameters extends Pick<useClockCell.Parameters, 'value' | 'format'> {
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
    ctx: useClockCell.Context;
  }
}
