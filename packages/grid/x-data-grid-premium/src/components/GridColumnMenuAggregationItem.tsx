import * as React from 'react';
import PropTypes from 'prop-types';
import { GridColumnMenuItemProps, useGridSelector } from '@mui/x-data-grid-pro';
import MUIMenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InputLabel from '@mui/material/InputLabel';
import { unstable_useId as useId } from '@mui/utils';
import type { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import {
  canColumnHaveAggregationFunction,
  getAggregationFunctionLabel,
  getAvailableAggregationFunctions,
} from '../hooks/features/aggregation/gridAggregationUtils';
import { gridAggregationModelSelector } from '../hooks/features/aggregation/gridAggregationSelectors';
import { GridAggregationModel } from '../hooks/features/aggregation/gridAggregationInterfaces';

const MenuItem = styled(MUIMenuItem)(() => ({
  '&:hover': {
    backgroundColor: 'transparent',
  },
  '& .MuiFormControl-root': {
    minWidth: 150,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  '& button': {
    padding: 2,
    marginLeft: 4,
  },
}));

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

  const handleAggregationItemChange = (event: SelectChangeEvent<string | undefined>) => {
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
    <MenuItem disableRipple>
      <ListItemIcon>
        <rootProps.slots.columnMenuAggregationIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        <rootProps.slots.baseFormControl size="small" fullWidth>
          <InputLabel id={`${id}-label`}>{label}</InputLabel>
          <rootProps.slots.baseSelect
            aria-labelledby={`${id}-label`}
            labelId={`${id}-label`}
            value={selectedAggregationRule}
            label={label}
            color="primary"
            onChange={handleAggregationItemChange}
            onBlur={(e: FocusEvent) => e.stopPropagation()}
            fullWidth
          >
            {availableAggregationFunctions.map((aggFunc) => (
              <rootProps.slots.baseSelectOption key={aggFunc} value={aggFunc}>
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
          {selectedAggregationRule ? (
            <rootProps.slots.baseIconButton onClick={handleAggregationItemChange}>
              <rootProps.slots.columnMenuClearIcon fontSize="small" color="action" />
            </rootProps.slots.baseIconButton>
          ) : null}
        </rootProps.slots.baseFormControl>
      </ListItemText>
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
