import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../../../hooks/utils/useGridSelector';
import {
  gridFilterModelSelector,
  gridFilterActiveItemsLookupSelector,
} from '../../../../hooks/features/filter/gridFilterSelector';
import { GridColumnMenuItemProps } from '../GridColumnMenuItemProps';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';

const StyledStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(0.5, 1.5, 0.5, 1.5),
  flexDirection: 'row',
  justifyContent: 'space-between',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(16),
  fontWeight: theme.typography.fontWeightRegular,
  textTransform: 'none',
}));

function GridColumnMenuFilterItem(props: GridColumnMenuItemProps) {
  const { colDef, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const filterColumnLookup = useGridSelector(apiRef, gridFilterActiveItemsLookupSelector);

  const filtersForCurrentColumn = React.useMemo(
    () => filterColumnLookup[colDef.field] ?? [],
    [colDef.field, filterColumnLookup],
  );

  const showFilter = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      apiRef.current.showFilterPanel(colDef.field);
    },
    [apiRef, colDef.field, onClick],
  );

  const clearFilters = React.useCallback(() => {
    if (filtersForCurrentColumn.length) {
      apiRef.current.upsertFilterItems(
        filterModel.items.filter((item) => item.field !== colDef?.field),
      );
    }
  }, [apiRef, colDef?.field, filterModel.items, filtersForCurrentColumn]);

  if (rootProps.disableColumnFilter || !colDef?.filterable) {
    return null;
  }

  return (
    <StyledStack>
      <StyledButton
        onClick={showFilter}
        startIcon={<rootProps.components.ColumnMenuFilterIcon />}
        color={filtersForCurrentColumn.length ? 'primary' : 'inherit'}
        aria-label={apiRef.current.getLocaleText('columnMenuFilter') as string}
      >
        {apiRef.current.getLocaleText('columnMenuFilter')}
      </StyledButton>
      {filtersForCurrentColumn.length ? (
        <IconButton aria-label="clear filter" onClick={clearFilters}>
          <rootProps.components.ColumnMenuClearIcon />
        </IconButton>
      ) : null}
    </StyledStack>
  );
}

GridColumnMenuFilterItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuFilterItem };
