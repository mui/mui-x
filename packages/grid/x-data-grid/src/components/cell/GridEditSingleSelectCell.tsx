import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material/utils';
import { SelectProps, SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {
  GridRenderEditCellParams,
  GridValueFormatterParams,
} from '../../models/params/gridCellParams';
import { isEscapeKey } from '../../utils/keyboardUtils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridEditModes } from '../../models/gridEditRowModel';
import { ValueOptions } from '../../models/colDef/gridColDef';
import { getValueFromValueOptions } from '../panel/filterPanel/filterPanelUtils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

const renderSingleSelectOptions = (option: ValueOptions, OptionComponent: React.ElementType) => {
  const isOptionTypeObject = typeof option === 'object';

  const key = isOptionTypeObject ? option.value : option;
  const value = isOptionTypeObject ? option.value : option;
  const content = isOptionTypeObject ? option.label : option;

  return (
    <OptionComponent key={key} value={value}>
      {content}
    </OptionComponent>
  );
};

export interface GridEditSingleSelectCellProps
  extends GridRenderEditCellParams,
    Omit<SelectProps, 'id' | 'tabIndex' | 'value'> {
  /**
   * Callback called when the value is changed by the user.
   * @param {SelectChangeEvent<any>} event The event source of the callback.
   * @param {any} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
   * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
   */
  onValueChange?: (event: SelectChangeEvent<any>, newValue: any) => Promise<void> | void;
  /**
   * If true, the select opens by default.
   */
  initialOpen?: boolean;
}

function isKeyboardEvent(event: any): event is React.KeyboardEvent {
  return !!event.key;
}

function GridEditSingleSelectCell(props: GridEditSingleSelectCellProps) {
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
    className,
    getValue,
    hasFocus,
    isValidating,
    isProcessingProps,
    error,
    onValueChange,
    initialOpen = rootProps.editMode === GridEditModes.Cell,
    ...other
  } = props;

  const apiRef = useGridApiContext();
  const ref = React.useRef<any>();
  const inputRef = React.useRef<any>();
  const [open, setOpen] = React.useState(initialOpen);

  const baseSelectProps = rootProps.componentsProps?.baseSelect || {};
  const isSelectNative = baseSelectProps.native ?? false;

  let valueOptionsFormatted: Array<ValueOptions>;
  if (typeof colDef.valueOptions === 'function') {
    valueOptionsFormatted = colDef.valueOptions!({ id, row, field });
  } else {
    valueOptionsFormatted = colDef.valueOptions!;
  }

  if (colDef.valueFormatter) {
    valueOptionsFormatted = valueOptionsFormatted.map((option) => {
      if (typeof option === 'object') {
        return option;
      }

      const params: GridValueFormatterParams = { field, api, value: option };
      return {
        value: option,
        label: String(colDef.valueFormatter!(params)),
      };
    });
  }

  const handleChange: SelectProps['onChange'] = async (event) => {
    setOpen(false);
    const target = event.target as HTMLInputElement;
    // NativeSelect casts the value to a string.
    const formattedTargetValue = getValueFromValueOptions(target.value, valueOptionsFormatted);

    if (onValueChange) {
      await onValueChange(event, formattedTargetValue);
    }

    const isValid = await apiRef.current.setEditCellValue(
      { id, field, value: formattedTargetValue },
      event,
    );

    if (rootProps.experimentalFeatures?.newEditingApi) {
      return;
    }

    // We use isValid === false because the default return is undefined which evaluates to true with !isValid
    if (rootProps.editMode === GridEditModes.Row || isValid === false) {
      return;
    }

    const canCommit = await Promise.resolve(apiRef.current.commitCellChange({ id, field }, event));
    if (canCommit) {
      apiRef.current.setCellMode(id, field, 'view');

      if ((event as any).key) {
        // TODO v6: remove once we stop ignoring events fired from portals
        const params = apiRef.current.getCellParams(id, field);
        apiRef.current.publishEvent(
          'cellNavigationKeyDown',
          params,
          event as any as React.KeyboardEvent<HTMLElement>,
        );
      }
    }
  };

  const handleClose = (event: React.KeyboardEvent, reason: string) => {
    if (rootProps.editMode === GridEditModes.Row) {
      setOpen(false);
      return;
    }
    if (reason === 'backdropClick' || isEscapeKey(event.key)) {
      if (rootProps.experimentalFeatures?.newEditingApi) {
        apiRef.current.stopCellEditMode({ id, field, ignoreModifications: true });
      } else {
        apiRef.current.setCellMode(id, field, 'view');
      }
    }
  };

  const handleOpen: SelectProps['onOpen'] = (event) => {
    if (isKeyboardEvent(event) && event.key === 'Enter') {
      return;
    }
    setOpen(true);
  };

  useEnhancedEffect(() => {
    if (hasFocus) {
      inputRef.current.focus();
    }
  }, [hasFocus]);

  return (
    <rootProps.components.BaseSelect
      ref={ref}
      inputRef={inputRef}
      value={value}
      onChange={handleChange}
      open={open}
      onOpen={handleOpen}
      MenuProps={{
        onClose: handleClose,
      }}
      error={error}
      native={isSelectNative}
      fullWidth
      {...other}
      {...rootProps.componentsProps?.baseSelect}
    >
      {valueOptionsFormatted.map((valueOptions) =>
        renderSingleSelectOptions(valueOptions, isSelectNative ? 'option' : MenuItem),
      )}
    </rootProps.components.BaseSelect>
  );
}

GridEditSingleSelectCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * GridApi that let you manipulate the grid.
   * @deprecated Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` (only available in `@mui/x-data-grid-pro`)
   */
  api: PropTypes.any.isRequired,
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
   * Get the cell value of a row and field.
   * @param {GridRowId} id The row id.
   * @param {string} field The field.
   * @returns {any} The cell value.
   * @deprecated Use `params.row` to directly access the fields you want instead.
   */
  getValue: PropTypes.func.isRequired,
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
   * @param {SelectChangeEvent<any>} event The event source of the callback.
   * @param {any} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
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

export { GridEditSingleSelectCell };

export const renderEditSingleSelectCell = (params: GridEditSingleSelectCellProps) => (
  <GridEditSingleSelectCell {...params} />
);
