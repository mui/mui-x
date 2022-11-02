import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import { GridPreferencePanelsValue } from '../../../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { GridItemProps } from '../GridItemProps';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';

const GridColumnsMenuSimpleItem = (props: GridItemProps) => {
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

export { GridColumnsMenuSimpleItem };
