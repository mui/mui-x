import * as React from 'react';
import { GridColDef, useGridSelector } from '@mui/x-data-grid-pro';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { unstable_useId as useId } from '@mui/material/utils';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import {
  getAvailableAggregationFunctions,
  getColumnAggregationRules,
} from '../hooks/features/aggregation/gridAggregationUtils';
import { gridAggregationModelSelector } from '../hooks/features/aggregation/gridAggregationSelectors';
import { GridAggregationPosition } from '../hooks/features/aggregation/gridAggregationInterfaces';

interface GridAggregationColumnMenuItemsProps {
  column: GridColDef;
  position: GridAggregationPosition;
  label: string;
}

export const GridAggregationColumnMenuItem = (props: GridAggregationColumnMenuItemsProps) => {
  const { column, position, label } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const id = useId();
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
        <InputLabel id={`${id}-label`}>{label}</InputLabel>
        <Select
          labelId={`${id}-label`}
          id={`${id}-input`}
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
          <MenuItem value="">...</MenuItem>
        </Select>
      </FormControl>
    </MenuItem>
  );
};
