import * as React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { GridColDef } from '@mui/x-data-grid';
import { styled } from '@mui/material';
import { GridPinnedPosition } from '../hooks/features/columnPinning';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

interface GridColumnPinningMenuItemsProps {
  column?: GridColDef;
  onClick?: (event: React.MouseEvent<any>) => void;
}

const StyledStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1, 1.5, 1, 1.5),
}));

const StyledButton = styled(Button)(() => ({
  fontSize: '16px',
  fontWeight: '400',
  textTransform: 'none',
}));

const GridColumnPinningMenuItems = (props: GridColumnPinningMenuItemsProps) => {
  const { column, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const pinColumn = (side: GridPinnedPosition) => (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.pinColumn(column!.field, side);

    if (onClick) {
      onClick(event);
    }
  };

  const unpinColumn = (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.unpinColumn(column!.field);

    if (onClick) {
      onClick(event);
    }
  };

  if (!column) {
    return null;
  }

  const side = apiRef.current.isColumnPinned(column.field);

  return (
    <StyledStack>
      <Typography color="text.secondary" fontSize="12px">
        Pin to
      </Typography>
      <Stack direction="row">
        <StyledButton
          onClick={
            side === GridPinnedPosition.left ? unpinColumn : pinColumn(GridPinnedPosition.left)
          }
          startIcon={<rootProps.components.ColumnMenuPinLeftIcon />}
          color={side === GridPinnedPosition.left ? 'primary' : 'inherit'}
        >
          {apiRef.current.getLocaleText('pinToLeftDefault')}
        </StyledButton>
        <StyledButton
          onClick={
            side === GridPinnedPosition.right ? unpinColumn : pinColumn(GridPinnedPosition.right)
          }
          startIcon={<rootProps.components.ColumnMenuPinRightIcon />}
          color={side === GridPinnedPosition.right ? 'primary' : 'inherit'}
        >
          {apiRef.current.getLocaleText('pinToRightDefault')}
        </StyledButton>
      </Stack>
    </StyledStack>
  );
};

GridColumnPinningMenuItems.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  column: PropTypes.object,
  onClick: PropTypes.func,
} as any;

export { GridColumnPinningMenuItems };
