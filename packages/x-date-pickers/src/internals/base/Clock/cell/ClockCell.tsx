'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useUtils } from '../../../hooks/useUtils';
import { PickerValidDate } from '../../../../models';
import { useClockRootContext } from '../root/ClockRootContext';
import { useClockListContext } from '../utils/ClockListContext';
import { useCompositeListItem } from '../../base-utils/composite/list/useCompositeListItem';

const InnerClockCell = React.forwardRef(function InnerClockCell(
  componentProps: InnerClockCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, ctx, ...elementProps } = componentProps;

  const utils = useUtils();

  const onClick = useEventCallback(() => {
    ctx.selectItem(value);
  });

  const props = React.useMemo(
    () => ({
      role: 'option',
      // TODO: Add aria-disabled / aria-readonly
      'aria-selected': ctx.isSelected,
      children: utils.formatByString(value, ctx.format),
      disabled: ctx.isDisabled,
      tabIndex: ctx.isTabbable ? 0 : -1,
      onClick,
    }),
    [ctx.isSelected, ctx.isDisabled, ctx.isTabbable, onClick, utils, value, ctx.format],
  );

  const state: ClockCell.State = React.useMemo(
    () => ({
      selected: ctx.isSelected,
      disabled: ctx.isDisabled,
      invalid: ctx.isInvalid,
    }),
    [ctx.isSelected, ctx.isDisabled, ctx.isInvalid],
  );

  const renderElement = useRenderElement('button', componentProps, {
    state,
    ref: forwardedRef,
    props: [props, elementProps],
  });

  return renderElement();
});

const MemoizedInnerClockCell = React.memo(InnerClockCell);

const ClockCell = React.forwardRef(function ClockCell(
  props: ClockCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const rootContext = useClockRootContext();
  const listContext = useClockListContext();
  const { ref: listItemRef } = useCompositeListItem();
  const ref = useForkRef(forwardedRef, listItemRef);

  const isItemSelected = listContext.isItemSelected;
  const isSelected = React.useMemo(
    () => isItemSelected(props.value),
    [isItemSelected, props.value],
  );

  const isItemInvalid = rootContext.isItemInvalid;
  const isInvalid = React.useMemo(
    () => isItemInvalid(props.value, listContext.precision),
    [props.value, isItemInvalid, listContext.precision],
  );

  const isDisabled = React.useMemo(() => {
    if (rootContext.disabled) {
      return true;
    }

    return isInvalid;
  }, [rootContext.disabled, isInvalid]);

  const canItemBeTabbed = listContext.canItemBeTabbed;
  const isTabbable = React.useMemo(
    () => canItemBeTabbed(props.value),
    [canItemBeTabbed, props.value],
  );

  const selectItem = useEventCallback((item: PickerValidDate) => {
    if (rootContext.readOnly) {
      return;
    }

    rootContext.setValue(item, { section: listContext.section });
  });

  const ctx = React.useMemo<InnerClockCellContext>(
    () => ({
      isSelected,
      isDisabled,
      isInvalid,
      isTabbable,
      selectItem,
      format: props.format ?? listContext.defaultFormat,
    }),
    [
      isSelected,
      isDisabled,
      isInvalid,
      isTabbable,
      selectItem,
      props.format,
      listContext.defaultFormat,
    ],
  );

  return <MemoizedInnerClockCell ref={ref} {...props} ctx={ctx} />;
});

export namespace ClockCell {
  export interface State {
    /**
     * Whether the cell is selected.
     */
    selected: boolean;
    /**
     * Whether the cell is disabled.
     */
    disabled: boolean;
    /**
     * Whether the cell is invalid.
     */
    invalid: boolean;
  }

  export interface Props extends Omit<BaseUIComponentProps<'button', State>, 'value'> {
    /**
     * The value to select when this cell is clicked.
     */
    value: PickerValidDate;
    /**
     * The format used to display the cell.
     * @default Defined by the cell list component wrapping the cell.
     */
    format?: string;
  }
}

interface InnerClockCellProps extends ClockCell.Props {
  /**
   * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
   */
  ctx: InnerClockCellContext;
}

interface InnerClockCellContext {
  isSelected: boolean;
  isDisabled: boolean;
  isInvalid: boolean;
  isTabbable: boolean;
  selectItem: (value: PickerValidDate) => void;
  format: string;
}

export { ClockCell };
