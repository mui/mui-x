import Checkbox from '@material-ui/core/Checkbox';
import * as React from 'react';
import {
  GRID_CELL_NAVIGATION_KEYDOWN,
} from '../../constants/eventsConstants';
import { GridCellParams } from '../../models/params/gridCellParams';
import { isNavigationKey, isSpaceKey } from '../../utils/keyboardUtils';
import { GridApiContext } from '../GridApiContext';

export const GridCellCheckboxRenderer = (props: GridCellParams) => {
  const {field, id, value, tabIndex, hasFocus} = props;
  const apiRef = React.useContext(GridApiContext);
  const checkboxElement = React.useRef<HTMLButtonElement | null>(null);
  const element = props.api.getCellElement(id, field);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    apiRef!.current.selectRow(id, checked, true);
  };

  React.useLayoutEffect(() => {
    if (tabIndex === 0 && element) {
      element!.tabIndex = -1;
    }
  }, [element, tabIndex]);

  React.useLayoutEffect(() => {
    if(hasFocus) {
      const input = checkboxElement.current!.querySelector('input')!;
      input!.focus();
    }
  }, [hasFocus]);

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

  return (
    <Checkbox
      ref={checkboxElement}
      tabIndex={tabIndex}
      checked={!!value}
      onChange={handleChange}
      className="MuiDataGrid-checkboxInput"
      color="primary"
      inputProps={{'aria-label': 'Select Row checkbox'}}
      onKeyDown={handleKeyDown}
    />
  );
};
