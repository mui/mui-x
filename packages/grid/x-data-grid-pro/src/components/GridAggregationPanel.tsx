import * as React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import {
  GridPanelContent,
  GridPanelWrapper,
  useGridSelector,
  GridColDef,
  gridVisibleColumnDefinitionsSelector,
} from '@mui/x-data-grid';
import { getAvailableAggregationFunctions } from '../hooks/features/aggregation/gridAggregationUtils';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridAggregationModel } from '../hooks/features/aggregation/gridAggregationInterfaces';
import { gridAggregationModelSelector } from '../hooks/features/aggregation/gridAggregationSelectors';

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
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const aggregationModel = useGridSelector(apiRef, gridAggregationModelSelector);

  const aggregableColumns = React.useMemo(
    () =>
      visibleColumns
        .map((column) => ({
          definition: column,
          availableAggregationFunctions: getAvailableAggregationFunctions({
            aggregationFunctions: rootProps.aggregationFunctions,
            column,
          }),
        }))
        .filter((column) => column.availableAggregationFunctions.length > 1),
    [visibleColumns, rootProps.aggregationFunctions],
  );

  const handleChange = (colDef: GridColDef) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    const functionName = event.target.value || undefined;
    const currentModel = gridAggregationModelSelector(apiRef);
    let newModel: GridAggregationModel;
    if (functionName === undefined) {
      const { [colDef.field]: itemToRemove, ...rest } = currentModel;
      newModel = rest;
    } else {
      newModel = {
        ...currentModel,
        [colDef.field]: { ...currentModel[colDef.field], functionName },
      };
    }

    apiRef.current.setAggregationModel(newModel);
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
                  'aria-label': 'TODO',
                }}
                value={aggregationModel[column.definition.field]?.functionName ?? ''}
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
