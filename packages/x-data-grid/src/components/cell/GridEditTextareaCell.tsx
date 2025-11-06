'use client';
import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { styled } from '@mui/material/styles';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { GridRenderEditCellParams } from '../../models/params/gridCellParams';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['editTextareaCell'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridEditTextareaCellRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'EditTextareaCell',
})<{ ownerState: OwnerState }>({
  position: 'relative',
  alignSelf: 'flex-start',
});

export interface GridEditTextareaCellProps extends GridRenderEditCellParams {
  debounceMs?: number;
  /**
   * Callback called when the value is changed by the user.
   * @param {React.ChangeEvent<HTMLTextAreaElement>} event The event source of the callback.
   * @param {string} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
   * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
   */
  onValueChange?: (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    newValue: string,
  ) => Promise<void> | void;
}

const GridEditTextareaCell = forwardRef<HTMLDivElement, GridEditTextareaCellProps>((props, ref) => {
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
  const [valueState, setValueState] = React.useState(value);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [inputRef, setInputRef] = React.useState<HTMLTextAreaElement | null>(null);
  const classes = useUtilityClasses(rootProps);

  const handleRef = React.useCallback((el: HTMLElement | null) => {
    setAnchorEl(el);
  }, []);

  const handleChange = React.useCallback<NonNullable<InputBaseProps['onChange']>>(
    async (event) => {
      const newValue = (event.target as HTMLTextAreaElement).value;

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
        await onValueChange(event as React.ChangeEvent<HTMLTextAreaElement>, newValue);
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
    if (hasFocus && inputRef) {
      inputRef.focus();
    }
  }, [hasFocus, inputRef]);

  return (
    <GridEditTextareaCellRoot className={classes.root} ownerState={rootProps} ref={ref}>
      <div
        ref={handleRef}
        style={{
          height: 1,
          width: colDef.computedWidth,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      {anchorEl && (
        <Popper open anchorEl={anchorEl} placement="bottom-start">
          <Paper elevation={1} sx={{ p: 1, minWidth: colDef.computedWidth }}>
            <InputBase
              multiline
              rows={4}
              value={valueState ?? ''}
              sx={{ textarea: { resize: 'both' }, width: '100%' }}
              onChange={handleChange}
              inputRef={(el) => setInputRef(el)}
              endAdornment={
                isProcessingProps ? (
                  <rootProps.slots.loadIcon fontSize="small" color="action" />
                ) : undefined
              }
              {...other}
            />
          </Paper>
        </Popper>
      )}
    </GridEditTextareaCellRoot>
  );
});

export { GridEditTextareaCell };

export const renderEditTextareaCell = (params: GridEditTextareaCellProps) => (
  <GridEditTextareaCell {...params} />
);
