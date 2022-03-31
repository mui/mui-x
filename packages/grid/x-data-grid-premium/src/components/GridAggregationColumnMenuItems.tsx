import * as React from 'react';
import { GridPreferencePanelsValue } from '@mui/x-data-grid-pro';
import MenuItem from '@mui/material/MenuItem';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';

interface GridAggregationColumnMenuItemsProps {
  onClick?: (event: React.MouseEvent<any>) => void;
}

export const GridAggregationColumnMenuItems = (props: GridAggregationColumnMenuItemsProps) => {
  const { onClick } = props;
  const apiRef = useGridApiContext();

  const showAggregation = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event);
      apiRef.current.showPreferences(GridPreferencePanelsValue.aggregation);
    },
    [apiRef, onClick],
  );

  return <MenuItem onClick={showAggregation}>Aggregate</MenuItem>;
};
