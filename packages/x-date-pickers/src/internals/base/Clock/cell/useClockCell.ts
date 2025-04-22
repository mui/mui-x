import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useUtils } from '../../../hooks/useUtils';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeProps } from '../../base-utils/mergeProps';
import { PickerValidDate } from '../../../../models';

export function useClockCell(parameters: useClockCell.Parameters) {
  const { value, ctx } = parameters;
  const utils = useUtils();

  const onClick = useEventCallback(() => {
    ctx.selectItem(value);
  });

  const getCellProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeProps(externalProps, {
        role: 'option',
        // TODO: Add aria-disabled / aria-readonly
        'aria-selected': ctx.isSelected,
        children: utils.formatByString(value, ctx.format),
        disabled: ctx.isDisabled,
        tabIndex: ctx.isTabbable ? 0 : -1,
        onClick,
      });
    },
    [utils, value, onClick, ctx.format, ctx.isTabbable, ctx.isDisabled, ctx.isSelected],
  );

  return React.useMemo(() => ({ getCellProps }), [getCellProps]);
}

export namespace useClockCell {
  export interface Parameters {
    /**
     * The value to select when this cell is clicked.
     */
    value: PickerValidDate;
    /**
     * The format used to display the cell.
     * @default Defined by the cell list component wrapping the cell.
     */
    format?: string;
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
    selectItem: (value: PickerValidDate) => void;
    format: string;
  }
}
