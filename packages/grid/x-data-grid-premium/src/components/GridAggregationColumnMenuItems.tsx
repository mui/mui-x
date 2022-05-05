import * as React from 'react';
import { GridColDef, gridRowTreeDepthSelector, useGridSelector } from '@mui/x-data-grid-pro';
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
import { GridAggregationPosition } from '@mui/x-data-grid-premium';

interface GridAggregationColumnMenuItemsProps {
  column?: GridColDef;
}

export const GridAggregationColumnMenuItems = (props: GridAggregationColumnMenuItemsProps) => {
  const { column } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const aggregationModel = useGridSelector(apiRef, gridAggregationModelSelector);
  const rowTreeDepth = useGridSelector(apiRef, gridRowTreeDepthSelector);

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

  const aggregationPositions: GridAggregationPosition[] =
    rowTreeDepth > 1 ? ['inline', 'footer'] : ['footer'];

  const renderPosition = (position: GridAggregationPosition) => {
    if (!column) {
      return null;
    }

    const idPrefix = `mui-data-grid-column-menu-aggregation-${column.field}-${position}`;
    const label = aggregationPositions.length > 1 ? position : 'Aggregation';

    const handleAggregationItemChange = (event: SelectChangeEvent<string | undefined>) => {
      const newPositionValue = event.target.value || undefined;
      const currentModel = gridAggregationModelSelector(apiRef);

      const { [column.field]: columnItem, ...otherColumnItems } = currentModel;

      const newColumnItem = {
        footer: aggregationRules.footer?.aggregationFunctionName ?? null,
        inline: aggregationRules.inline?.aggregationFunctionName ?? null,
        [position]: newPositionValue,
      };

      apiRef.current.setAggregationModel({
        ...otherColumnItems,
        [column.field]: newColumnItem,
      });
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
      {aggregationPositions.length > 1 && <ListSubheader disableSticky>Aggregation</ListSubheader>}
      {aggregationPositions.map((aggregationPosition) => renderPosition(aggregationPosition))}
    </React.Fragment>
  );
};
