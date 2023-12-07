import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  AutocompleteProps,
  AutocompleteRenderGetTagProps,
  AutocompleteRenderInputParams,
  createFilterOptions,
} from '@mui/material/Autocomplete';
import { GridRenderEditCellParams } from '../../models/params/gridCellParams';
import { isEscapeKey } from '../../utils/keyboardUtils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridEditModes } from '../../models/gridEditRowModel';
import { GridMultipleSelectColDef, ValueOptions } from '../../models/colDef/gridColDef';
import {
  getValuesFromValueOptions,
  isMultipleSelectColDef,
} from '../panel/filterPanel/filterPanelUtils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

export interface GridEditMultipleSelectCellProps
  extends GridRenderEditCellParams,
    Omit<
      AutocompleteProps<ValueOptions, true, false, true>,
      | 'options'
      | 'renderInput'
      | 'onChange'
      | 'value'
      | 'id'
      | 'filterOptions'
      | 'isOptionEqualToValue'
      | 'multiple'
      | 'color'
      | 'getOptionLabel'
      | 'tabIndex'
    >,
    Pick<GridMultipleSelectColDef, 'getOptionLabel' | 'getOptionValue'> {
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

const filter = createFilterOptions<any>();

function GridEditMultipleSelectCell(props: GridEditMultipleSelectCellProps) {
  const rootProps = useGridRootProps();
  const {
    id,
    value: valueProp,
    formattedValue,
    api,
    focusElementRef,
    color,
    error,
    helperText,
    size,
    variant = 'standard',
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
    onValueChange,
    initialOpen = rootProps.editMode === GridEditModes.Cell,
    getOptionLabel: getOptionLabelProp,
    getOptionValue: getOptionValueProp,
    ...other
  } = props;
  const TextFieldProps = {
    color,
    error,
    helperText,
    size,
    variant,
  };

  const apiRef = useGridApiContext();
  const ref = React.useRef<any>();
  const inputRef = React.useRef<any>();
  const [open, setOpen] = React.useState(initialOpen);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>();

  useEnhancedEffect(() => {
    if (hasFocus) {
      inputRef.current?.focus();
    }
  }, [hasFocus]);

  let resolvedColumn: GridMultipleSelectColDef | null = null;
  if (isMultipleSelectColDef(colDef)) {
    resolvedColumn = colDef;
  }

  const handleRef = React.useCallback((el: HTMLElement | null) => {
    setAnchorEl(el);
  }, []);

  const getOptionValue = getOptionValueProp || resolvedColumn?.getOptionValue!;
  const getOptionLabel = getOptionLabelProp || resolvedColumn?.getOptionLabel!;

  const isOptionEqualToValue = React.useCallback(
    (option: ValueOptions, value: ValueOptions) => getOptionValue(option) === getOptionValue(value),
    [getOptionValue],
  );

  const resolvedValueOptions = React.useMemo(() => {
    if (!resolvedColumn?.valueOptions) {
      return [];
    }

    if (typeof resolvedColumn.valueOptions === 'function') {
      return resolvedColumn.valueOptions({ id, row, field });
    }

    return resolvedColumn.valueOptions;
  }, [resolvedColumn, id, row, field]);

  const resolvedFormattedValueOptions = React.useMemo(() => {
    return resolvedValueOptions?.map(getOptionValue);
  }, [resolvedValueOptions, getOptionValue]);

  // The value is computed from the item.value and used directly
  // If it was done by a useEffect/useState, the Autocomplete could receive incoherent value and options
  const filteredValues = React.useMemo(() => {
    if (!Array.isArray(valueProp)) {
      return [];
    }
    if (resolvedValueOptions !== undefined) {
      const itemValueIndexes = valueProp.map((element) => {
        // Gets the index matching between values and valueOptions
        return resolvedFormattedValueOptions?.findIndex(
          (formattedOption) => formattedOption === element,
        );
      });

      return itemValueIndexes
        .filter((index) => index >= 0)
        .map((index: number) => resolvedValueOptions[index]);
    }
    return valueProp;
  }, [valueProp, resolvedValueOptions, resolvedFormattedValueOptions]);

  const handleChange = React.useCallback<
    NonNullable<AutocompleteProps<ValueOptions, true, false, true>['onChange']>
  >(
    async (event, value: ValueOptions | ValueOptions[] | null) => {
      if (!resolvedValueOptions) {
        return;
      }

      if (value == null) {
        return;
      }

      if (!Array.isArray(value)) {
        return;
      }

      const formattedTargetValue = getValuesFromValueOptions(
        value.map(getOptionValue),
        resolvedValueOptions,
        getOptionValue,
      );

      if (onValueChange) {
        await onValueChange(event.nativeEvent as SelectChangeEvent, formattedTargetValue);
      }

      await apiRef.current.setEditCellValue({ id, field, value: formattedTargetValue }, event);
    },
    [resolvedValueOptions, getOptionValue, apiRef, id, field, onValueChange],
  );

  if (!isMultipleSelectColDef(colDef)) {
    return null;
  }

  if (!resolvedValueOptions) {
    return null;
  }

  const handleClose = (event: React.SyntheticEvent, reason: string) => {
    setOpen(false);

    if (rootProps.editMode === GridEditModes.Row) {
      return;
    }
    if (reason === 'backdropClick' || (isKeyboardEvent(event) && isEscapeKey(event.key))) {
      apiRef.current.stopCellEditMode({ id, field, ignoreModifications: true });
    }
  };

  const handleOpen = (event: React.SyntheticEvent) => {
    if (isKeyboardEvent(event) && event.key === 'Enter') {
      return;
    }
    setOpen(true);
  };

  return (
    <div style={{ position: 'relative', alignSelf: 'flex-start' }}>
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
          <Paper
            elevation={1}
            sx={{
              p: 1,
              minWidth: colDef.computedWidth,
              maxWidth: colDef.computedWidth,
            }}
          >
            <rootProps.slots.baseMultipleSelect
              multiple
              ref={ref}
              options={resolvedValueOptions}
              isOptionEqualToValue={isOptionEqualToValue}
              filterOptions={filter}
              value={filteredValues}
              onChange={handleChange}
              getOptionLabel={getOptionLabel}
              renderTags={(value: ValueOptions[], getTagProps: AutocompleteRenderGetTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    size="small"
                    label={getOptionLabel(option)}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params: AutocompleteRenderInputParams) => (
                <rootProps.slots.baseTextField
                  {...params}
                  InputLabelProps={{
                    ...params.InputLabelProps,
                    shrink: true,
                  }}
                  inputRef={focusElementRef}
                  type="multipleSelect"
                  {...TextFieldProps}
                  {...rootProps.slotProps?.baseTextField}
                />
              )}
              size="small"
              fullWidth
              open={open}
              onOpen={handleOpen}
              onClose={handleClose}
              disableCloseOnSelect
              {...other}
              {...rootProps.slotProps?.baseMultipleSelect}
            />
          </Paper>
        </Popper>
      )}
    </div>
  );
}

GridEditMultipleSelectCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
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
   * Used to determine the label displayed for a given value option.
   * @param {ValueOptions} value The current value option.
   * @returns {string} The text to be displayed.
   */
  getOptionLabel: PropTypes.func,
  /**
   * Used to determine the value used for a value option.
   * @param {ValueOptions} value The current value option.
   * @returns {string} The value to be used.
   */
  getOptionValue: PropTypes.func,
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

export { GridEditMultipleSelectCell };

export const renderEditMultipleSelectCell = (params: GridEditMultipleSelectCellProps) => (
  <GridEditMultipleSelectCell {...params} />
);
