import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { GridFilterItemProps } from './GridFilterItemProps';
import { useGridApiContext } from '../../../hooks/root/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

export const HideGridColMenuItem = (props: GridFilterItemProps) => {
  const { column, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const timeoutRef = React.useRef<any>();

  const toggleColumn = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      // time for the transition
      timeoutRef.current = setTimeout(() => {
        apiRef.current.setColumnVisibility(column?.field, false);
      }, 100);
    },
    [apiRef, column?.field, onClick],
  );
  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  if (rootProps.disableColumnSelector) {
    return null;
  }

  return (
    <MenuItem onClick={toggleColumn}>
      {apiRef.current.getLocaleText('columnMenuHideColumn')}
    </MenuItem>
  );
};
