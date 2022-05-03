import * as React from 'react';
import { GridColDef, useGridSelector } from '@mui/x-data-grid-pro';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import {
  getAvailableAggregationFunctions,
  getColumnAggregationRules,
} from '../hooks/features/aggregation/gridAggregationUtils';
import { gridAggregationModelSelector } from '../hooks/features/aggregation/gridAggregationSelectors';
import { GridAggregationModel } from '../hooks/features/aggregation/gridAggregationInterfaces';

interface GridAggregationColumnMenuItemsProps {
  column?: GridColDef;
}

export const GridAggregationColumnMenuItems = (props: GridAggregationColumnMenuItemsProps) => {
  const { column } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const aggregationModel = useGridSelector(apiRef, gridAggregationModelSelector);

  const availableAggregationFunctions = column
    ? getAvailableAggregationFunctions({
        aggregationFunctions: rootProps.aggregationFunctions,
        column,
      })
    : [];

  const aggregationRules = column
    ? getColumnAggregationRules({
        columnItem: aggregationModel[column.field],
        column,
        aggregationFunctions: rootProps.aggregationFunctions,
      })
    : {};

  const renderPosition = (position: 'inline' | 'footer') => {
    if (!column) {
      return null;
    }

    const idPrefix = `mui-data-grid-column-menu-aggregation-${column.field}-${position}`;
    const label = position;

    const handleAggregationItemChange = (event: SelectChangeEvent<string | undefined>) => {
      const item = event.target.value || undefined;
      const currentModel = gridAggregationModelSelector(apiRef);
      let newModel: GridAggregationModel;
      if (item === undefined) {
        const {
          [column.field]: { [position]: functionToRemove, ...restColumn },
          ...rest
        } = currentModel;
        newModel = { ...rest, [column.field]: restColumn };
      } else {
        newModel = {
          ...currentModel,
          [column.field]: {
            ...currentModel[column.field],
            [position]: item,
          },
        };
      }

      apiRef.current.setAggregationModel(newModel);
      apiRef.current.hideColumnMenu();
    };

    return (
      <MenuItem>
        <FormControl fullWidth>
          <InputLabel id={`${idPrefix}-label`}>{label}</InputLabel>
          <Select
            labelId={`${idPrefix}-label`}
            id={`${idPrefix}-input`}
            size="small"
            value={aggregationRules[position]?.aggregationFunctionName ?? ''}
            label={label}
            onChange={handleAggregationItemChange}
            onBlur={(e) => e.stopPropagation()}
          >
            {availableAggregationFunctions.map((aggFunc) => (
              <MenuItem key={aggFunc} value={aggFunc}>
                {aggFunc}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </MenuItem>
    );
  };

  return (
    <React.Fragment>
      <ListSubheader>Aggregation</ListSubheader>
      {renderPosition('inline')}
      {renderPosition('footer')}
    </React.Fragment>
  );
};
