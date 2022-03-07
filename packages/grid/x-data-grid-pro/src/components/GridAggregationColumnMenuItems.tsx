import * as React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';

interface GridAggregationColumnMenuItemsProps {
  column?: GridColDef;
  onClick?: (event: React.MouseEvent<any>) => void;
}

export const GridAggregationColumnMenuItems = (props: GridAggregationColumnMenuItemsProps) => {
  const { column, onClick } = props;

  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  const availableAggregationFunctions = React.useMemo(() => {
    if (!column) {
      return [];
    }

    if (column.availableAggregationFunctions != null) {
      return column.availableAggregationFunctions;
    }

    return Object.keys(rootProps.aggregationFunctions).filter((name) =>
      rootProps.aggregationFunctions[name].types.includes(column.type!),
    );
  }, [column, rootProps.aggregationFunctions]);

  const setAggregation = (event: React.MouseEvent<HTMLElement>, aggFunc: string) => {
    apiRef.current.updateColumns([{ field: column!.field, currentAggregation: aggFunc }]);
    onClick?.(event);
  };

  return (
    <React.Fragment>
      {availableAggregationFunctions.map((aggFunc) => (
        <MenuItem key={aggFunc} onClick={(event) => setAggregation(event, aggFunc)}>
          Set agg {aggFunc}
        </MenuItem>
      ))}
    </React.Fragment>
  );
};
