import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { useGridSelector } from '../../../hooks/features/core/useGridSelector';
import { PreferencePanelsValue } from '../../../hooks/features/preferencesPanel/preferencesPanelValue';
import { optionsSelector } from '../../../hooks/utils/useOptionsProp';
import { ApiContext } from '../../api-context';
import { FilterItemProps } from './FilterItemProps';

export const ColumnsMenuItem: React.FC<FilterItemProps> = ({ onClick }) => {
  const apiRef = React.useContext(ApiContext);
  const options = useGridSelector(apiRef, optionsSelector);

  const showColumns = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      apiRef!.current.showPreferences(PreferencePanelsValue.columns);
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
