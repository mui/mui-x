import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { GridApiContext } from '../../GridApiContext';
import { GridFilterItemProps } from './GridFilterItemProps';
import { useGridSelector } from '../../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../../hooks/utils/optionsSelector';

export const HideGridColMenuItem = (props: GridFilterItemProps) => {
  const { column, onClick } = props;
  const apiRef = React.useContext(GridApiContext);
  const options = useGridSelector(apiRef, optionsSelector);
  const timeoutRef = React.useRef<any>();

  const toggleColumn = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      // time for the transition
      timeoutRef.current = setTimeout(() => {
        apiRef!.current.setColumnVisibility(column?.field, false);
      }, 100);
    },
    [apiRef, column?.field, onClick],
  );
  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  if (options.disableColumnSelector) {
    return null;
  }

  return (
    <MenuItem onClick={toggleColumn}>
      {apiRef!.current.getLocaleText('columnMenuHideColumn')}
    </MenuItem>
  );
};
