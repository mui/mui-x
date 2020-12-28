import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { ApiContext } from '../../api-context';
import { FilterItemProps } from './FilterItemProps';

export const HideColMenuItem: React.FC<FilterItemProps> = ({ column, onClick }) => {
  const apiRef = React.useContext(ApiContext);
  const timeoutRef = React.useRef<any>();

  const toggleColumn = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      // time for the transition
      timeoutRef.current = setTimeout(() => {
        apiRef!.current.toggleColumn(column?.field, true);
      }, 10);
    },
    [apiRef, column?.field, onClick],
  );
  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  if (!column) {
    return null;
  }

  return (
    <MenuItem onClick={toggleColumn}>
      {apiRef!.current.getLocaleText('columnMenuHideColumn')}
    </MenuItem>
  );
};
