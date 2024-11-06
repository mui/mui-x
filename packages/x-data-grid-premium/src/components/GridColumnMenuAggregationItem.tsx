import * as React from 'react';
import PropTypes from 'prop-types';
import { GridColumnMenuItemProps, useGridSelector } from '@mui/x-data-grid-pro';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { unstable_useId as useId } from '@mui/utils';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import {
  canColumnHaveAggregationFunction,
  getAggregationFunctionLabel,
  getAvailableAggregationFunctions,
} from '../hooks/features/aggregation/gridAggregationUtils';
import { gridAggregationModelSelector } from '../hooks/features/aggregation/gridAggregationSelectors';
import { GridAggregationModel } from '../hooks/features/aggregation/gridAggregationInterfaces';

function GridColumnMenuAggregationItem(props: GridColumnMenuItemProps) {
  const { colDef } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const id = useId();
  const aggregationModel = useGridSelector(apiRef, gridAggregationModelSelector);

  const availableAggregationFunctions = React.useMemo(
    () =>
      getAvailableAggregationFunctions({
        aggregationFunctions: rootProps.aggregationFunctions,
        colDef,
      }),
    [colDef, rootProps.aggregationFunctions],
  );

  const selectedAggregationRule = React.useMemo(() => {
    if (!colDef || !aggregationModel[colDef.field]) {
      return '';
    }

    const aggregationFunctionName = aggregationModel[colDef.field];
    if (
      canColumnHaveAggregationFunction({
        colDef,
        aggregationFunctionName,
        aggregationFunction: rootProps.aggregationFunctions[aggregationFunctionName],
      })
    ) {
      return aggregationFunctionName;
    }

    return '';
  }, [rootProps.aggregationFunctions, aggregationModel, colDef]);

  const handleAggregationItemChange = (event: Event) => {
    const newAggregationItem = (event.target as HTMLSelectElement | null)?.value || undefined;
    const currentModel = gridAggregationModelSelector(apiRef);
    const { [colDef.field]: columnItem, ...otherColumnItems } = currentModel;
    const newModel: GridAggregationModel =
      newAggregationItem == null
        ? otherColumnItems
        : { ...otherColumnItems, [colDef?.field]: newAggregationItem };

    apiRef.current.setAggregationModel(newModel);
    apiRef.current.hideColumnMenu();
  };

  const label = apiRef.current.getLocaleText('aggregationMenuItemHeader');

  return (
    <rootProps.slots.baseMenuItem disableRipple>
      <ListItemIcon>
        <rootProps.slots.columnMenuAggregationIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        <FormControl size="small" fullWidth sx={{ minWidth: 150 }}>
          <InputLabel id={`${id}-label`}>{label}</InputLabel>
          <rootProps.slots.baseSelect
            labelId={`${id}-label`}
            id={`${id}-input`}
            value={selectedAggregationRule}
            label={label}
            color="primary"
            onChange={handleAggregationItemChange as any}
            onBlur={(event) => event.stopPropagation()}
            fullWidth
          >
            <rootProps.slots.baseMenuItem value="">...</rootProps.slots.baseMenuItem>
            {availableAggregationFunctions.map((aggFunc) => (
              <rootProps.slots.baseMenuItem key={aggFunc} value={aggFunc}>
                {getAggregationFunctionLabel({
                  apiRef,
                  aggregationRule: {
                    aggregationFunctionName: aggFunc,
                    aggregationFunction: rootProps.aggregationFunctions[aggFunc],
                  },
                })}
              </rootProps.slots.baseMenuItem>
            ))}
          </rootProps.slots.baseSelect>
        </FormControl>
      </ListItemText>
    </rootProps.slots.baseMenuItem>
  );
}

GridColumnMenuAggregationItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuAggregationItem };
