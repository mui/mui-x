import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material/utils';
import { SelectProps } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {
  GridRenderEditCellParams,
  GridValueFormatterParams,
} from '../../models/params/gridCellParams';
import { isEscapeKey } from '../../utils/keyboardUtils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridEditModes } from '../../models/gridEditRowModel';
import { GridColDef, ValueOptions } from '../../models/colDef/gridColDef';
import { getValueFromValueOptions } from '../panel/filterPanel/filterPanelUtils';

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

function GridEditSingleSelectCell(props: GridRenderEditCellParams & Omit<SelectProps, 'id'>) {
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
    ...other
  } = props;

  const ref = React.useRef<any>();
  const inputRef = React.useRef<any>();
  const rootProps = useGridRootProps();
  const [open, setOpen] = React.useState(rootProps.editMode === 'cell');

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

  const handleChange = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    setOpen(false);
    const target = event.target as HTMLInputElement;
    // NativeSelect casts the value to a string.
    const formattedTargetValue = getValueFromValueOptions(target.value, valueOptionsFormatted);
    const isValid = await api.setEditCellValue({ id, field, value: formattedTargetValue }, event);

    if (rootProps.experimentalFeatures?.newEditingApi) {
      return;
    }

    // We use isValid === false because the default return is undefined which evaluates to true with !isValid
    if (rootProps.editMode === GridEditModes.Row || isValid === false) {
      return;
    }

    const canCommit = await Promise.resolve(api.commitCellChange({ id, field }, event));
    if (canCommit) {
      api.setCellMode(id, field, 'view');

      if (event.key) {
        // TODO v6: remove once we stop ignoring events fired from portals
        const params = api.getCellParams(id, field);
        api.publishEvent('cellNavigationKeyDown', params, event);
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
        api.stopCellEditMode({ id, field, ignoreModifications: true });
      } else {
        api.setCellMode(id, field, 'view');
      }
    }
  };

  const handleOpen = () => {
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
   * If true, the cell is editable.
   */
  isEditable: PropTypes.bool,
  isProcessingProps: PropTypes.bool,
  isValidating: PropTypes.bool,
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: PropTypes.object.isRequired,
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: PropTypes.object.isRequired,
} as any;

export { GridEditSingleSelectCell };
export const renderEditSingleSelectCell: GridColDef['renderEditCell'] = (params) => (
  <GridEditSingleSelectCell {...params} />
);
