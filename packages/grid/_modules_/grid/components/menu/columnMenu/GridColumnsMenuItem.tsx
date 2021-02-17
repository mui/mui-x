import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { useGridSelector } from '../../../hooks/features/core/useGridSelector';
import { GridPreferencePanelsValue } from '../../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { optionsSelector } from '../../../hooks/utils/optionsSelector';
import { GridApiContext } from '../../GridApiContext';
import { FilterItemProps } from './FilterItemProps';

export const GridColumnsMenuItem: React.FC<FilterItemProps> = ({ onClick }) => {
  const apiRef = React.useContext(GridApiContext);
  const options = useGridSelector(apiRef, optionsSelector);

  const showColumns = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      apiRef!.current.showPreferences(GridPreferencePanelsValue.columns);
    },
    [apiRef, onClick],
  );

  if (options.disableColumnSelector) {
    return null;
  }

  return (
    <MenuItem onClick={showColumns}>
      {apiRef!.current.getLocaleText('columnMenuShowColumns')}
    </MenuItem>
  );
};
