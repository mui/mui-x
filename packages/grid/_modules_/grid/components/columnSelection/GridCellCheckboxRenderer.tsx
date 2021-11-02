import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { useForkRef } from '@mui/material/utils';
import { GridEvents } from '../../constants/eventsConstants';
import { GridCellParams } from '../../models/params/gridCellParams';
import { isNavigationKey, isSpaceKey } from '../../utils/keyboardUtils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../gridClasses';
import { GridComponentProps } from '../../GridComponentProps';
import { GridRowSelectionCheckboxParams } from '../../models/params/gridRowSelectionCheckboxParams';

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['checkboxInput'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridCellCheckboxForwardRef = React.forwardRef<HTMLInputElement, GridCellParams>(
  function GridCellCheckboxRenderer(props, ref) {
    const { field, id, value, tabIndex, hasFocus } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const ownerState = { classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);
    const checkboxElement = React.useRef<HTMLInputElement | null>(null);

    const handleRef = useForkRef(checkboxElement, ref);
    const element = apiRef.current.getCellElement(id, field);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const params: GridRowSelectionCheckboxParams = { value: event.target.checked, id };
      apiRef.current.publishEvent(GridEvents.rowSelectionCheckboxChange, params, event);
    };

    const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
      event.stopPropagation();
    };

    React.useLayoutEffect(() => {
      if (tabIndex === 0 && element) {
        element!.tabIndex = -1;
      }
    }, [element, tabIndex]);

    React.useLayoutEffect(() => {
      if (hasFocus && checkboxElement.current) {
        const input = checkboxElement.current.querySelector('input')!;
        input!.focus();
      }
    }, [hasFocus]);

    const handleKeyDown = React.useCallback(
      (event) => {
        if (isSpaceKey(event.key)) {
          event.stopPropagation();
        }
        if (isNavigationKey(event.key) && !event.shiftKey) {
          apiRef.current.publishEvent(GridEvents.cellNavigationKeyDown, props, event);
        }
      },
      [apiRef, props],
    );

    const isSelectable =
      !rootProps.isRowSelectable || rootProps.isRowSelectable(apiRef.current.getRowParams(id));

    return (
      <rootProps.components.Checkbox
        ref={handleRef}
        tabIndex={tabIndex}
        checked={!!value}
        onChange={handleChange}
        onClick={handleClick}
        className={classes.root}
        color="primary"
        inputProps={{ 'aria-label': 'Select Row checkbox' }}
        onKeyDown={handleKeyDown}
        disabled={!isSelectable}
        {...rootProps.componentsProps?.checkbox}
      />
    );
  },
);

GridCellCheckboxForwardRef.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The mode of the cell.
   */
  cellMode: PropTypes.oneOf(['edit', 'view']).isRequired,
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The column field of the cell that triggered the event
   */
  field: PropTypes.string.isRequired,
  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: PropTypes.any.isRequired,
  /**
   * Get the cell value of a row and field.
   * @param {GridRowId} id The row id.
   * @param {string} field The field.
   * @returns {GridCellValue} The cell value.
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
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: PropTypes.any.isRequired,
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    ),
    depth: PropTypes.number.isRequired,
    expanded: PropTypes.bool,
    groupingValue: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    isAutoGenerated: PropTypes.bool,
    parent: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  /**
   * the tabIndex value.
   */
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  /**
   * The cell value, but if the column has valueGetter, use getValue.
   */
  value: PropTypes.any.isRequired,
} as any;

export { GridCellCheckboxForwardRef };

export const GridCellCheckboxRenderer = React.memo(GridCellCheckboxForwardRef);
