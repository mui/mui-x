import * as React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import {
  gridColumnDefinitionsSelector,
  GridPanelContent,
  GridPanelWrapper,
  useGridApiContext,
  useGridSelector,
  GridColDef,
} from '@mui/x-data-grid';
import { getAvailableAggregationFunctions } from '../hooks/features/aggregation/gridAggregationUtils';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

const GridAggregationPanelRoot = styled('div')({
  padding: '8px 0px 8px 8px',
});

const GridAggregationPanelRowRoot = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '4px 8px 4px 8px',
});

export const GridAggregationPanel = () => {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const columns = useGridSelector(apiRef, gridColumnDefinitionsSelector);

  const aggregableColumns = React.useMemo(
    () =>
      columns
        .map((column) => ({
          definition: column,
          availableAggregationFunctions: getAvailableAggregationFunctions({
            aggregationFunctions: rootProps.aggregationFunctions,
            column,
          }),
        }))
        .filter((column) => column.availableAggregationFunctions.length > 1),
    [columns],
  );

  const handleChange = (colDef: GridColDef) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    apiRef.current.updateColumns([
      { field: colDef.field, currentAggregation: event.target.value || undefined },
    ]);
  };

  return (
    <GridPanelWrapper>
      <GridPanelContent>
        <GridAggregationPanelRoot>
          {aggregableColumns.map((column) => (
            <GridAggregationPanelRowRoot key={column.definition.field}>
              <Typography>{column.definition.headerName ?? column.definition.field}</Typography>
              <rootProps.components.BaseSelect
                inputProps={{
                  'aria-label': apiRef.current.getLocaleText('filterPanelLinkOperator'),
                }}
                value={column.definition.currentAggregation ?? ''}
                onChange={handleChange(column.definition)}
                native
                size="small"
                {...rootProps.componentsProps?.baseSelect}
              >
                {column.availableAggregationFunctions.map((aggFunc) => (
                  <option key={aggFunc} value={aggFunc}>
                    {aggFunc}
                  </option>
                ))}
                <option value="">...</option>
              </rootProps.components.BaseSelect>
            </GridAggregationPanelRowRoot>
          ))}
        </GridAggregationPanelRoot>
      </GridPanelContent>
    </GridPanelWrapper>
  );
};
