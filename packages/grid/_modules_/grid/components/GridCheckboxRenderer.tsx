import * as React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { visibleSortedGridRowIdsSelector } from '../hooks/features/filter/gridFilterSelector';
import {
  gridTabIndexCellSelector,
  gridTabIndexColumnHeaderSelector,
} from '../hooks/features/focus/gridFocusStateSelector';
import { gridRowCountSelector } from '../hooks/features/rows/gridRowsSelector';
import { selectedGridRowsCountSelector } from '../hooks/features/selection/gridSelectionSelector';
import { GridColumnHeaderParams } from '../models/params/gridColumnHeaderParams';
import { GridCellParams } from '../models/params/gridCellParams';
import { isSpaceKey } from '../utils/keyboardUtils';
import { GridApiContext } from './GridApiContext';

export const GridHeaderCheckbox = (props: GridColumnHeaderParams) => {
  const apiRef = React.useContext(GridApiContext);
  const visibleRowIds = useGridSelector(apiRef, visibleSortedGridRowIdsSelector);
  const tabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderSelector);

  const totalSelectedRows = useGridSelector(apiRef, selectedGridRowsCountSelector);
  const totalRows = useGridSelector(apiRef, gridRowCountSelector);

  const [isIndeterminate, setisIndeterminate] = React.useState(
    totalSelectedRows > 0 && totalSelectedRows !== totalRows,
  );
  const [isChecked, setChecked] = React.useState(
    totalSelectedRows === totalRows || isIndeterminate,
  );

  React.useEffect(() => {
    const isNewIndeterminate = totalSelectedRows > 0 && totalSelectedRows !== totalRows;
    const isNewChecked = (totalRows > 0 && totalSelectedRows === totalRows) || isIndeterminate;
    setChecked(isNewChecked);
    setisIndeterminate(isNewIndeterminate);
  }, [isIndeterminate, totalRows, totalSelectedRows]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setChecked(checked);
    apiRef!.current.selectRows(visibleRowIds, checked);
  };

  const tabIndex = tabIndexState !== null && tabIndexState.colIndex === props.colIndex ? 0 : -1;
  React.useLayoutEffect(() => {
    if (tabIndex === 0 && props.element) {
      props.element!.tabIndex = -1;
    }
  }, [props.element, tabIndex]);

  return (
    <Checkbox
      indeterminate={isIndeterminate}
      checked={isChecked}
      onChange={handleChange}
      className="MuiDataGrid-checkboxInput"
      color="primary"
      inputProps={{ 'aria-label': 'Select All Rows checkbox' }}
      tabIndex={tabIndex}
    />
  );
};

export const GridCellCheckboxRenderer = React.memo((props: GridCellParams) => {
  const { getValue, field, id } = props;
  const apiRef = React.useContext(GridApiContext);
  const tabIndexState = useGridSelector(apiRef, gridTabIndexCellSelector);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    apiRef!.current.selectRow(id, checked, true);
  };
  const tabIndex =
    tabIndexState !== null &&
    tabIndexState.rowIndex === props.rowIndex &&
    tabIndexState.colIndex === props.colIndex
      ? 0
      : -1;

  React.useLayoutEffect(() => {
    if (tabIndex === 0 && props.element) {
      props.element!.tabIndex = -1;
    }
  }, [props.element, tabIndex]);

  const handleKeyDown = React.useCallback((event) => {
    if (isSpaceKey(event.key)) {
      event.stopPropagation();
    }
  }, []);

  return (
    <Checkbox
      tabIndex={tabIndex}
      checked={!!getValue(field)}
      onChange={handleChange}
      className="MuiDataGrid-checkboxInput"
      color="primary"
      inputProps={{ 'aria-label': 'Select Row checkbox' }}
      onKeyDown={handleKeyDown}
    />
  );
});
