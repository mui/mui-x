import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material/utils';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import { GridRenderEditCellParams } from '../../models/params/gridCellParams';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

type OwnerState = { classes: DataGridProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['editInputCell'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export interface GridEditDateCellProps
  extends GridRenderEditCellParams,
    Omit<InputBaseProps, 'id' | 'value' | 'tabIndex'> {
  /**
   * Callback called when the value is changed by the user.
   * @param {React.ChangeEvent<HTMLInputElement>} event The event source of the callback.
   * @param {Date | null} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
   * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
   */
  onValueChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    newValue: Date | null,
  ) => Promise<void> | void;
}

function GridEditDateCell(props: GridEditDateCellProps) {
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
    hasFocus,
    getValue,
    inputProps,
    isValidating,
    isProcessingProps,
    onValueChange,
    ...other
  } = props;

  const isDateTime = colDef.type === 'dateTime';
  const inputRef = React.useRef<HTMLInputElement>();

  const valueTransformed = React.useMemo(() => {
    let parsedDate: Date | null;

    if (valueProp == null) {
      parsedDate = null;
    } else if (valueProp instanceof Date) {
      parsedDate = valueProp;
    } else {
      parsedDate = new Date((valueProp ?? '').toString());
    }

    let formattedDate: string;
    if (parsedDate == null || Number.isNaN(parsedDate.getTime())) {
      formattedDate = '';
    } else {
      const localDate = new Date(parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60 * 1000);
      formattedDate = localDate.toISOString().substr(0, isDateTime ? 16 : 10);
    }

    return {
      parsed: parsedDate,
      formatted: formattedDate,
    };
  }, [valueProp, isDateTime]);

  const [valueState, setValueState] = React.useState(valueTransformed);
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const handleChange = React.useCallback(
    async (event) => {
      const newFormattedDate = event.target.value;
      let newParsedDate: Date | null;

      if (newFormattedDate === '') {
        newParsedDate = null;
      } else {
        const [date, time] = newFormattedDate.split('T');
        const [year, month, day] = date.split('-');
        newParsedDate = new Date();
        newParsedDate.setFullYear(year, Number(month) - 1, day);
        newParsedDate.setHours(0, 0, 0, 0);
        if (time) {
          const [hours, minutes] = time.split(':');
          newParsedDate.setHours(Number(hours), Number(minutes), 0, 0);
        }
      }

      if (onValueChange) {
        await onValueChange(event, newParsedDate);
      }

      setValueState({ parsed: newParsedDate, formatted: newFormattedDate });
      api.setEditCellValue({ id, field, value: newParsedDate }, event);
    },
    [api, field, id, onValueChange],
  );

  React.useEffect(() => {
    setValueState((state) => {
      if (
        valueTransformed.parsed !== state.parsed &&
        valueTransformed.parsed?.getTime() !== state.parsed?.getTime()
      ) {
        return valueTransformed;
      }
      return state;
    });
  }, [valueTransformed]);

  useEnhancedEffect(() => {
    if (hasFocus) {
      inputRef.current!.focus();
    }
  }, [hasFocus]);

  return (
    <InputBase
      inputRef={inputRef}
      fullWidth
      className={classes.root}
      type={isDateTime ? 'datetime-local' : 'date'}
      inputProps={{
        max: isDateTime ? '9999-12-31T23:59' : '9999-12-31',
        ...inputProps,
      }}
      value={valueState.formatted}
      onChange={handleChange}
      {...other}
    />
  );
}

GridEditDateCell.propTypes = {
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
   * Callback called when the value is changed by the user.
   * @param {React.ChangeEvent<HTMLInputElement>} event The event source of the callback.
   * @param {Date | null} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
   * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
   */
  onValueChange: PropTypes.func,
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: PropTypes.object.isRequired,
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: PropTypes.object.isRequired,
  /**
   * the tabIndex value.
   */
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  /**
   * The cell value, but if the column has valueGetter, use getValue.
   */
  value: PropTypes.any,
} as any;

export { GridEditDateCell };

export const renderEditDateCell = (params: GridRenderEditCellParams) => (
  <GridEditDateCell {...params} />
);
