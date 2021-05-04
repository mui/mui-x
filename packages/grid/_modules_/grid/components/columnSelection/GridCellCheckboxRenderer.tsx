import * as React from 'react';
import { GRID_CELL_NAVIGATION_KEYDOWN } from '../../constants/eventsConstants';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { gridTabIndexCellSelector } from '../../hooks/features/focus/gridFocusStateSelector';
import { GridCellParams } from '../../models/params/gridCellParams';
import { isNavigationKey, isSpaceKey } from '../../utils/keyboardUtils';
import { GridApiContext } from '../GridApiContext';

const GridCellCheckboxForwardRef = React.forwardRef<HTMLInputElement, GridCellParams>(
  function GridCellCheckboxRenderer(props, ref) {
    const { getValue, field, id, rowIndex, colIndex, element } = props;
    const apiRef = React.useContext(GridApiContext);
    const tabIndexState = useGridSelector(apiRef, gridTabIndexCellSelector);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      apiRef!.current.selectRow(id, checked, true);
    };
    const tabIndex =
      tabIndexState !== null &&
      tabIndexState.rowIndex === rowIndex &&
      tabIndexState.colIndex === colIndex
        ? 0
        : -1;

    React.useLayoutEffect(() => {
      if (tabIndex === 0 && element) {
        element!.tabIndex = -1;
      }
    }, [element, tabIndex]);

    const handleKeyDown = React.useCallback(
      (event) => {
        if (isSpaceKey(event.key)) {
          event.stopPropagation();
        }
        if (isNavigationKey(event.key) && !event.shiftKey) {
          apiRef!.current.publishEvent(GRID_CELL_NAVIGATION_KEYDOWN, props, event);
        }
      },
      [apiRef, props],
    );

    const CheckboxComponent = apiRef?.current.components.Checkbox!;

    return (
      <CheckboxComponent
        ref={ref}
        tabIndex={tabIndex}
        checked={!!getValue(field)}
        onChange={handleChange}
        className="MuiDataGrid-checkboxInput"
        color="primary"
        inputProps={{ 'aria-label': 'Select Row checkbox' }}
        onKeyDown={handleKeyDown}
        {...apiRef?.current.componentsProps?.checkbox}
      />
    );
  },
);

export const GridCellCheckboxRenderer = React.memo(GridCellCheckboxForwardRef);
