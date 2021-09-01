import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { GridPreferencePanelsValue } from '../../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../../hooks/root/useGridApiContext';
import { GridFilterItemProps } from './GridFilterItemProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

export const GridColumnsMenuItem = (props: GridFilterItemProps) => {
  const { onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const showColumns = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      apiRef.current.showPreferences(GridPreferencePanelsValue.columns);
    },
    [apiRef, onClick],
  );

  if (rootProps.disableColumnSelector) {
    return null;
  }

  return (
    <MenuItem onClick={showColumns}>
      {apiRef.current.getLocaleText('columnMenuShowColumns')}
    </MenuItem>
  );
};
