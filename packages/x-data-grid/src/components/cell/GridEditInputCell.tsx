'use client';
import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { styled } from '@mui/material/styles';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { NotRendered } from '../../utils/assert';
import { GridSlotProps } from '../../models/gridSlotsComponent';
import { vars } from '../../constants/cssVariables';
import { GridRenderEditCellParams } from '../../models/params/gridCellParams';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

type OwnerState = Pick<DataGridProcessedProps, 'classes'>;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['editInputCell'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridEditInputCellRoot = styled(NotRendered<GridSlotProps['baseInput']>, {
  name: 'MuiDataGrid',
  slot: 'EditInputCell',
})({
  font: vars.typography.font.body,
  padding: '1px 0',
  '& input': {
    padding: '0 16px',
    height: '100%',
  },
});

export interface GridEditInputCellProps extends GridRenderEditCellParams {
  debounceMs?: number;
  /**
   * Callback called when the value is changed by the user.
   * @param {React.ChangeEvent<HTMLInputElement>} event The event source of the callback.
   * @param {Date | null} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
   * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
   */
  onValueChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    newValue: string,
  ) => Promise<void> | void;
  slotProps?: {
    root?: Partial<GridSlotProps['baseInput']>;
  };
}

const GridEditInputCell = forwardRef<HTMLInputElement, GridEditInputCellProps>((props, ref) => {
  const { slots, classes: rootPropsClasses } = useGridRootProps();

  const {
    id,
    value,
    formattedValue,
    api,
    field,
    row,
    rowNode,
    colDef,
    cellMode,
    isEditable,
    tabIndex,
    hasFocus,
    isValidating,
    debounceMs = 200,
    isProcessingProps,
    onValueChange,
    slotProps,
    ...other
  } = props;

  const apiRef = useGridApiContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [valueState, setValueState] = React.useState(value);
  const classes = useUtilityClasses({ classes: rootPropsClasses });

  const handleChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;

      const column = apiRef.current.getColumn(field);

      let parsedValue = newValue;
      if (column.valueParser) {
        parsedValue = column.valueParser(newValue, apiRef.current.getRow(id), column, apiRef);
      }

      setValueState(parsedValue);
      apiRef.current.setEditCellValue(
        { id, field, value: parsedValue, debounceMs, unstable_skipValueParser: true },
        event,
      );

      if (onValueChange) {
        await onValueChange(event, newValue);
      }
    },
    [apiRef, debounceMs, field, id, onValueChange],
  );

  const meta = apiRef.current.unstable_getEditCellMeta(id, field);

  React.useEffect(() => {
    if (meta?.changeReason !== 'debouncedSetEditCellValue') {
      setValueState(value);
    }
  }, [meta, value]);

  useEnhancedEffect(() => {
    if (hasFocus) {
      inputRef.current!.focus();
    }
  }, [hasFocus]);

  return (
    <GridEditInputCellRoot
      as={slots.baseInput}
      inputRef={inputRef}
      className={classes.root}
      fullWidth
      type={colDef.type === 'number' ? colDef.type : 'text'}
      value={valueState ?? ''}
      onChange={handleChange}
      endAdornment={
        isProcessingProps ? <slots.loadIcon fontSize="small" color="action" /> : undefined
      }
      {...other}
      {...slotProps?.root}
      ref={ref}
    />
  );
});

export { GridEditInputCell };

export const renderEditInputCell = (params: GridEditInputCellProps) => (
  <GridEditInputCell {...params} />
);
