import * as React from 'react';
import {
  GRID_COLUMN_HEADER_NAVIGATION_KEYDOWN,
  GRID_SELECTION_CHANGED,
} from '../../constants/eventsConstants';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { visibleSortedGridRowIdsSelector } from '../../hooks/features/filter/gridFilterSelector';
import { gridTabIndexColumnHeaderSelector } from '../../hooks/features/focus/gridFocusStateSelector';
import { gridRowCountSelector } from '../../hooks/features/rows/gridRowsSelector';
import { selectedGridRowsCountSelector } from '../../hooks/features/selection/gridSelectionSelector';
import { GridColumnHeaderParams } from '../../models/params/gridColumnHeaderParams';
import { isNavigationKey, isSpaceKey } from '../../utils/keyboardUtils';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';

export const GridHeaderCheckbox = React.forwardRef<HTMLInputElement, GridColumnHeaderParams>(
  function GridHeaderCheckbox(props, ref) {
    const [, forceUpdate] = React.useState(false);
    const apiRef = useGridApiContext();
    const visibleRowIds = useGridSelector(apiRef, visibleSortedGridRowIdsSelector);
    const tabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderSelector);

    const totalSelectedRows = useGridSelector(apiRef, selectedGridRowsCountSelector);
    const totalRows = useGridSelector(apiRef, gridRowCountSelector);

    const [isIndeterminate, setIsIndeterminate] = React.useState(
      totalSelectedRows > 0 && totalSelectedRows !== totalRows,
    );
    const [isChecked, setChecked] = React.useState(
      totalSelectedRows === totalRows || isIndeterminate,
    );

    React.useEffect(() => {
      const isNewIndeterminate = totalSelectedRows > 0 && totalSelectedRows !== totalRows;
      const isNewChecked = (totalRows > 0 && totalSelectedRows === totalRows) || isIndeterminate;
      setChecked(isNewChecked);
      setIsIndeterminate(isNewIndeterminate);
    }, [isIndeterminate, totalRows, totalSelectedRows]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      setChecked(checked);
      apiRef!.current.selectRows(visibleRowIds, checked, !event.target.indeterminate);
    };

    const tabIndex = tabIndexState !== null && tabIndexState.field === props.field ? 0 : -1;
    React.useLayoutEffect(() => {
      const element = apiRef!.current.getColumnHeaderElement(props.field);
      if (tabIndex === 0 && element) {
        element!.tabIndex = -1;
      }
    }, [tabIndex, apiRef, props.field]);

    const handleKeyDown = React.useCallback(
      (event) => {
        if (isSpaceKey(event.key)) {
          event.stopPropagation();
        }
        if (isNavigationKey(event.key) && !event.shiftKey) {
          apiRef!.current.publishEvent(GRID_COLUMN_HEADER_NAVIGATION_KEYDOWN, props, event);
        }
      },
      [apiRef, props],
    );

    const handleSelectionChange = React.useCallback(() => {
      forceUpdate((p) => !p);
    }, []);

    React.useEffect(() => {
      return apiRef?.current.subscribeEvent(GRID_SELECTION_CHANGED, handleSelectionChange);
    }, [apiRef, handleSelectionChange]);

    const CheckboxComponent = apiRef?.current.components.Checkbox!;

    return (
      <CheckboxComponent
        ref={ref}
        indeterminate={isIndeterminate}
        checked={isChecked}
        onChange={handleChange}
        className="MuiDataGrid-checkboxInput"
        color="primary"
        inputProps={{ 'aria-label': 'Select All Rows checkbox' }}
        tabIndex={tabIndex}
        onKeyDown={handleKeyDown}
        {...apiRef?.current.componentsProps?.checkbox}
      />
    );
  },
);
