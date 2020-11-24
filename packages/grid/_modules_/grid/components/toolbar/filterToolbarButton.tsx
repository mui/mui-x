import { IconButton } from '@material-ui/core';
import * as React from 'react';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { useIcons } from '../../hooks/utils/useIcons';
import { optionsSelector } from '../../hooks/utils/useOptionsProp';
import { ApiContext } from '../api-context';

export const FilterToolbarButton: React.FC<{}> = () => {
  const apiRef = React.useContext(ApiContext);
  const options = useGridSelector(apiRef, optionsSelector);

  const icons = useIcons();
  const filterIconElement = React.createElement(icons.ColumnFiltering!, {});
  // const columnsIconElement = React.createElement(icons.ColumnSelector!, {});
  const showFilter = React.useCallback(() => {
    apiRef!.current.showFilterPanel();
  }, [apiRef]);

  if (options.disableColumnFilter) {
    return null;
  }

  return (
    <IconButton onClick={showFilter} color="primary" aria-label="Show Filters">
      {filterIconElement}
    </IconButton>
  );
};
