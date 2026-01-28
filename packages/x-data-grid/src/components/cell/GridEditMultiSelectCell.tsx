'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import type { AutocompleteProps } from '../../models/gridBaseSlots';
import { GridCellEditStopReasons } from '../../models/params/gridEditCellParams';
import { GridRenderEditCellParams } from '../../models/params/gridCellParams';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridEditModes } from '../../models/gridEditRowModel';
import { getValueOptions, isMultiSelectColDef } from '../panel/filterPanel/filterPanelUtils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import type { ValueOptions } from '../../models/colDef/gridColDef';

export interface GridEditMultiSelectCellProps extends GridRenderEditCellParams {
  /**
   * Callback called when the value is changed by the user.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {any[]} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
   * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
   */
  onValueChange?: (event: React.SyntheticEvent, newValue: any[]) => Promise<void> | void;
  /**
   * If true, the select opens by default.
   */
  initialOpen?: boolean;
}

function GridEditMultiSelectCell(props: GridEditMultiSelectCellProps) {
  const rootProps = useGridRootProps();
  const {
    id,
    value: valueProp,
    formattedValue,
    api,
    field,
    row,
    rowNode,
    colDef,
    cellMode,
    isEditable,
    tabIndex,
    className,
    hasFocus,
    isValidating,
    isProcessingProps,
    error,
    onValueChange,
    initialOpen = rootProps.editMode === GridEditModes.Cell,
    slotProps,
    ...other
  } = props;

  const apiRef = useGridApiContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(initialOpen);

  useEnhancedEffect(() => {
    if (hasFocus) {
      inputRef.current?.focus();
    }
  }, [hasFocus]);

  if (!isMultiSelectColDef(colDef)) {
    return null;
  }

  const valueOptions = getValueOptions(colDef, { id, row });
  if (!valueOptions) {
    return null;
  }

  const getOptionValue = colDef.getOptionValue!;
  const getOptionLabel = colDef.getOptionLabel!;

  const currentValue = Array.isArray(valueProp) ? valueProp : [];

  // Convert values to options for Autocomplete
  const selectedOptions = currentValue
    .map((val: any) => valueOptions.find((option) => getOptionValue(option) === val))
    .filter((option): option is ValueOptions => option !== undefined);

  const isOptionEqualToValue = React.useCallback(
    (option: ValueOptions, val: ValueOptions) => getOptionValue(option) === getOptionValue(val),
    [getOptionValue],
  );

  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: ValueOptions[],
    reason: string,
  ) => {
    const newValues = newValue.map((option) => getOptionValue(option));

    if (onValueChange) {
      await onValueChange(event, newValues);
    }

    await apiRef.current.setEditCellValue({ id, field, value: newValues }, event);
  };

  const handleClose = (event: React.SyntheticEvent, reason: string) => {
    if (rootProps.editMode === GridEditModes.Row) {
      setOpen(false);
      return;
    }

    if (reason === 'escape') {
      const params = apiRef.current.getCellParams(id, field);
      apiRef.current.publishEvent('cellEditStop', {
        ...params,
        reason: GridCellEditStopReasons.escapeKeyDown,
      });
    } else if (reason === 'blur') {
      const params = apiRef.current.getCellParams(id, field);
      apiRef.current.publishEvent('cellEditStop', {
        ...params,
        reason: GridCellEditStopReasons.cellFocusOut,
      });
    }
    setOpen(false);
  };

  const handleOpen = (event: React.SyntheticEvent) => {
    setOpen(true);
  };

  const BaseAutocomplete = rootProps.slots.baseAutocomplete as React.JSXElementConstructor<
    AutocompleteProps<ValueOptions, true, false, false>
  >;

  return (
    <BaseAutocomplete
      multiple
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      options={valueOptions}
      value={selectedOptions}
      onChange={handleChange}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      disableCloseOnSelect
      openOnFocus
      autoHighlight
      slotProps={{
        textField: {
          inputRef,
          fullWidth: true,
        },
      }}
      {...other}
      {...slotProps?.root}
    />
  );
}

GridEditMultiSelectCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * GridApi that let you manipulate the grid.
   */
  api: PropTypes.object.isRequired,
  /**
   * The mode of the cell.
   */
  cellMode: PropTypes.oneOf(['edit', 'view']).isRequired,
  changeReason: PropTypes.oneOf(['debouncedSetEditCellValue', 'setEditCellValue']),
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,
  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: PropTypes.any,
  /**
   * If true, the cell is the active element.
   */
  hasFocus: PropTypes.bool.isRequired,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * If true, the select opens by default.
   */
  initialOpen: PropTypes.bool,
  /**
   * If true, the cell is editable.
   */
  isEditable: PropTypes.bool,
  isProcessingProps: PropTypes.bool,
  isValidating: PropTypes.bool,
  /**
   * Callback called when the value is changed by the user.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {any[]} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
   * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
   */
  onValueChange: PropTypes.func,
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: PropTypes.any.isRequired,
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: PropTypes.object.isRequired,
  /**
   * the tabIndex value.
   */
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: PropTypes.any,
} as any;

export { GridEditMultiSelectCell };

export const renderEditMultiSelectCell = (params: GridEditMultiSelectCellProps) => (
  <GridEditMultiSelectCell {...params} />
);
