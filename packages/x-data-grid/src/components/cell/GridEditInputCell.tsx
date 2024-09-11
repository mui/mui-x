import * as React from 'react';
import {
  unstable_composeClasses as composeClasses,
  unstable_useEnhancedEffect as useEnhancedEffect,
} from '@mui/utils';
import { styled } from '@mui/material/styles';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import { GridRenderEditCellParams } from '../../models/params/gridCellParams';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['editInputCell'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridEditInputCellRoot = styled(InputBase, {
  name: 'MuiDataGrid',
  slot: 'EditInputCell',
  overridesResolver: (props, styles) => styles.editInputCell,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  ...theme.typography.body2,
  padding: '1px 0',
  '& input': {
    padding: '0 16px',
    height: '100%',
  },
}));

export interface GridEditInputCellProps
  extends GridRenderEditCellParams,
    Omit<InputBaseProps, 'id' | 'value' | 'tabIndex' | 'ref'> {
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
}

const GridEditInputCell = React.forwardRef<HTMLInputElement, GridEditInputCellProps>(
  (props, ref) => {
    const rootProps = useGridRootProps();

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
      ...other
    } = props;

    const apiRef = useGridApiContext();
    const inputRef = React.useRef<HTMLInputElement>();
    const [valueState, setValueState] = React.useState(value);
    const classes = useUtilityClasses(rootProps);

    const handleChange = React.useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;

        if (onValueChange) {
          await onValueChange(event, newValue);
        }

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
        ref={ref}
        inputRef={inputRef}
        className={classes.root}
        ownerState={rootProps}
        fullWidth
        type={colDef.type === 'number' ? colDef.type : 'text'}
        value={valueState ?? ''}
        onChange={handleChange}
        endAdornment={
          isProcessingProps ? (
            <rootProps.slots.loadIcon fontSize="small" color="action" />
          ) : undefined
        }
        {...other}
      />
    );
  },
);

export { GridEditInputCell };

export const renderEditInputCell = (params: GridEditInputCellProps) => (
  <GridEditInputCell {...params} />
);
