import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { GridItemProps } from '../GridItemProps';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';

const GridFilterMenuSimpleItem = (props: GridFilterItemProps) => {
  const { column, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const showFilter = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      apiRef.current.showFilterPanel(column?.field);
    },
    [apiRef, column?.field, onClick],
  );

  if (rootProps.disableColumnFilter || !column?.filterable) {
    return null;
  }

  return (
    <MenuItem onClick={showFilter}>{apiRef.current.getLocaleText('columnMenuFilter')}</MenuItem>
  );
};

export { GridFilterMenuSimpleItem };
