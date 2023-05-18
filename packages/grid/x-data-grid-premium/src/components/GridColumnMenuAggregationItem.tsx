import * as React from 'react';
import PropTypes from 'prop-types';
import { GridColumnMenuItemProps, useGridSelector } from '@mui/x-data-grid-pro';
import MenuItem from '@mui/material/MenuItem';
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

  const handleAggregationItemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newAggregationItem = event.target?.value || undefined;
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
    // TODO: when baseMenuItem slot is used, the Joy select inside is not working
    <MenuItem disableRipple>
      <rootProps.slots.baseListItemIcon {...rootProps.slotProps?.baseListItemIcon}>
        <rootProps.slots.columnMenuAggregationIcon fontSize="small" />
      </rootProps.slots.baseListItemIcon>
      <rootProps.slots.baseListItemText {...rootProps.slotProps?.baseListItemText}>
        <rootProps.slots.baseFormControl
          size="small"
          fullWidth
          sx={{ minWidth: 150, width: '100%' }}
          {...rootProps.slotProps?.baseFormControl}
        >
          <rootProps.slots.baseInputLabel
            id={`${id}-label`}
            {...rootProps.slotProps?.baseInputLabel}
          >
            {label}
          </rootProps.slots.baseInputLabel>
          <rootProps.slots.baseSelect
            labelId={`${id}-label`}
            id={`${id}-input`}
            value={selectedAggregationRule}
            label={label}
            color="primary"
            onChange={handleAggregationItemChange}
            onBlur={(event: React.FocusEvent) => event.stopPropagation()}
            fullWidth
            {...rootProps.slotProps?.baseSelect}
          >
            <rootProps.slots.baseSelectOption value="" {...rootProps.slotProps?.baseSelectOption}>
              ...
            </rootProps.slots.baseSelectOption>
            {availableAggregationFunctions.map((aggFunc) => (
              <rootProps.slots.baseSelectOption
                key={aggFunc}
                value={aggFunc}
                {...rootProps.slotProps?.baseSelectOption}
              >
                {getAggregationFunctionLabel({
                  apiRef,
                  aggregationRule: {
                    aggregationFunctionName: aggFunc,
                    aggregationFunction: rootProps.aggregationFunctions[aggFunc],
                  },
                })}
              </rootProps.slots.baseSelectOption>
            ))}
          </rootProps.slots.baseSelect>
        </rootProps.slots.baseFormControl>
      </rootProps.slots.baseListItemText>
    </MenuItem>
  );
}

GridColumnMenuAggregationItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuAggregationItem };
