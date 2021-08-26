import * as React from 'react';
import { useForkRef } from '@material-ui/core/utils';
import { GridEvents } from '../../constants/eventsConstants';
import { GridCellParams } from '../../models/params/gridCellParams';
import { isNavigationKey, isSpaceKey } from '../../utils/keyboardUtils';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridClasses } from '../../gridClasses';

export const GridCellCheckboxForwardRef = React.forwardRef<HTMLInputElement, GridCellParams>(
  function GridCellCheckboxRenderer(props, ref) {
    const { field, id, value, tabIndex, hasFocus } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const checkboxElement = React.useRef<HTMLInputElement | null>(null);

    const handleRef = useForkRef(checkboxElement, ref);
    const element = apiRef.current.getCellElement(id, field);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      apiRef.current.selectRow(id, event.target.checked, true);
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

    const CheckboxComponent = apiRef?.current.components.Checkbox!;

    const isSelectable =
      !rootProps.isRowSelectable || rootProps.isRowSelectable(apiRef.current.getRowParams(id));

    return (
      <CheckboxComponent
        ref={handleRef}
        tabIndex={tabIndex}
        checked={!!value}
        onChange={handleChange}
        onClick={handleClick}
        className={gridClasses.checkboxInput}
        color="primary"
        inputProps={{ 'aria-label': 'Select Row checkbox' }}
        onKeyDown={handleKeyDown}
        disabled={!isSelectable}
        {...apiRef?.current.componentsProps?.checkbox}
      />
    );
  },
);

export const GridCellCheckboxRenderer = React.memo(GridCellCheckboxForwardRef);
