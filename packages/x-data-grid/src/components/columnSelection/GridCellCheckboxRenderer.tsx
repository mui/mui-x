import * as React from 'react';
import PropTypes from 'prop-types';
import {
  unstable_composeClasses as composeClasses,
  unstable_useForkRef as useForkRef,
} from '@mui/utils';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { getCheckboxPropsSelector } from '../../hooks/features/rowSelection/utils';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import type { GridRowSelectionCheckboxParams } from '../../models/params/gridRowSelectionCheckboxParams';
import type { GridRenderCellParams } from '../../models/params/gridCellParams';

type OwnerState = { classes: DataGridProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['checkboxInput'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

interface TouchRippleActions {
  stop: (event: any, callback?: () => void) => void;
}

const GridCellCheckboxForwardRef = forwardRef<HTMLInputElement, GridRenderCellParams>(
  function GridCellCheckboxRenderer(props, ref) {
    const {
      field,
      id,
      formattedValue,
      row,
      rowNode,
      colDef,
      isEditable,
      cellMode,
      hasFocus,
      tabIndex,
      api,
      ...other
    } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const ownerState = { classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);
    const checkboxElement = React.useRef<HTMLElement>(null);

    const rippleRef = React.useRef<TouchRippleActions>(null);
    const handleRef = useForkRef(checkboxElement, ref);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const params: GridRowSelectionCheckboxParams = { value: event.target.checked, id };
      apiRef.current.publishEvent('rowSelectionCheckboxChange', params, event);
    };

    React.useLayoutEffect(() => {
      if (tabIndex === 0) {
        const element = apiRef.current.getCellElement(id, field);
        if (element) {
          element.tabIndex = -1;
        }
      }
    }, [apiRef, tabIndex, id, field]);

    React.useEffect(() => {
      if (hasFocus) {
        const input = checkboxElement.current?.querySelector('input');
        input?.focus({ preventScroll: true });
      } else if (rippleRef.current) {
        // Only available in @mui/material v5.4.1 or later
        rippleRef.current.stop({});
      }
    }, [hasFocus]);

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
      if (event.key === ' ') {
        // We call event.stopPropagation to avoid selecting the row and also scrolling to bottom
        // TODO: Remove and add a check inside useGridKeyboardNavigation
        event.stopPropagation();
      }
    }, []);

    const isSelectable = apiRef.current.isRowSelectable(id);

    const checkboxPropsSelector = getCheckboxPropsSelector(
      id,
      rootProps.rowSelectionPropagation?.parents ?? false,
    );
    const { isIndeterminate, isChecked } = useGridSelector(apiRef, checkboxPropsSelector);

    if (rowNode.type === 'footer' || rowNode.type === 'pinnedRow') {
      return null;
    }

    const label = apiRef.current.getLocaleText(
      isChecked && !isIndeterminate ? 'checkboxSelectionUnselectRow' : 'checkboxSelectionSelectRow',
    );

    return (
      <rootProps.slots.baseCheckbox
        tabIndex={tabIndex}
        checked={isChecked && !isIndeterminate}
        onChange={handleChange}
        className={classes.root}
        inputProps={{ 'aria-label': label }}
        onKeyDown={handleKeyDown}
        indeterminate={isIndeterminate}
        disabled={!isSelectable}
        touchRippleRef={rippleRef as any /* FIXME: typing error */}
        {...rootProps.slotProps?.baseCheckbox}
        {...other}
        ref={handleRef}
      />
    );
  },
);

GridCellCheckboxForwardRef.propTypes = {
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
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,
  /**
   * A ref allowing to set imperative focus.
   * It can be passed to the element that should receive focus.
   * @ignore - do not document.
   */
  focusElementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.shape({
        focus: PropTypes.func.isRequired,
      }),
    }),
  ]),
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

export { GridCellCheckboxForwardRef };

export const GridCellCheckboxRenderer = GridCellCheckboxForwardRef;
