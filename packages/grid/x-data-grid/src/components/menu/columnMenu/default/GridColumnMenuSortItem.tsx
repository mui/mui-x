import * as React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useGridSelector } from '../../../../hooks/utils/useGridSelector';
import { gridSortModelSelector } from '../../../../hooks/features/sorting/gridSortingSelector';
import { GridSortDirection } from '../../../../models/gridSortModel';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';
import { GridColumnMenuItemProps } from '../GridColumnMenuItemProps';

const StyledButton = styled(Button)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(16),
  fontWeight: theme.typography.fontWeightRegular,
}));

function GridColumnMenuSortItem(props: GridColumnMenuItemProps) {
  const { colDef } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);

  const sortDirection = React.useMemo(() => {
    if (!colDef) {
      return null;
    }
    const sortItem = sortModel.find((item) => item.field === colDef.field);
    return sortItem?.sort;
  }, [colDef, sortModel]);

  const onSortMenuItemClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const direction = event.currentTarget.getAttribute('data-value') || null;
      apiRef.current.sortColumn(
        colDef!,
        (direction === sortDirection ? null : direction) as GridSortDirection,
      );
    },
    [apiRef, colDef, sortDirection],
  );

  if (!colDef || !colDef.sortable) {
    return null;
  }

  return (
    <React.Fragment>
      <Typography color="text.secondary" fontSize="12px">
        Sort by
      </Typography>
      <Stack direction="row">
        <StyledButton
          onClick={onSortMenuItemClick}
          data-value="asc"
          startIcon={<rootProps.components.ColumnMenuSortAscendingIcon />}
          color={sortDirection === 'asc' ? 'primary' : 'inherit'}
        >
          {apiRef.current.getLocaleText('columnMenuSortAscAbbrev')}
        </StyledButton>
        <StyledButton
          onClick={onSortMenuItemClick}
          data-value="desc"
          startIcon={<rootProps.components.ColumnMenuSortDescendingIcon />}
          color={sortDirection === 'desc' ? 'primary' : 'inherit'}
        >
          {apiRef.current.getLocaleText('columnMenuSortDescAbbrev')}
        </StyledButton>
      </Stack>
    </React.Fragment>
  );
}

GridColumnMenuSortItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuSortItem };
