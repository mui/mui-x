import * as React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import PushPinIcon from '@mui/icons-material/PushPin';
import { GridColDef } from '@mui/x-data-grid';
import { GridPinnedPosition } from '../hooks/features/columnPinning';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';

interface GridColumnPinningMenuItemsProps {
  column?: GridColDef;
  onClick?: (event: React.MouseEvent<any>) => void;
  condensed?: boolean;
}

const GridColumnPinningMenuItems = (props: GridColumnPinningMenuItemsProps) => {
  const { column, onClick, condensed } = props;
  const apiRef = useGridApiContext();

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

  if (condensed) {
    return (
      <Stack px={1.5} py={1}>
        <Typography color="text.secondary" fontSize="12px">
          Pin to
        </Typography>
        <Stack
          direction="row"
          sx={{
            '& .MuiButton-root': {
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
            },
          }}
        >
          <Button
            onClick={
              side === GridPinnedPosition.left ? unpinColumn : pinColumn(GridPinnedPosition.left)
            }
            startIcon={<PushPinIcon />}
            sx={{
              color: side === GridPinnedPosition.left ? 'primary.main' : 'common.black',
              '& .MuiSvgIcon-root': {
                transform: 'rotate(30deg)',
                color: side === GridPinnedPosition.left ? 'primary.main' : 'grey.700',
              },
            }}
          >
            {apiRef.current.getLocaleText('pinToLeftCondensed')}
          </Button>
          <Button
            onClick={
              side === GridPinnedPosition.right ? unpinColumn : pinColumn(GridPinnedPosition.right)
            }
            startIcon={<PushPinIcon />}
            sx={{
              color: side === GridPinnedPosition.right ? 'primary.main' : 'common.black',
              '& .MuiSvgIcon-root': {
                transform: 'rotate(-30deg)',
                color: side === GridPinnedPosition.right ? 'primary.main' : 'grey.700',
              },
            }}
          >
            {apiRef.current.getLocaleText('pinToRightCondensed')}
          </Button>
        </Stack>
      </Stack>
    );
  }

  if (side) {
    const otherSide =
      side === GridPinnedPosition.right ? GridPinnedPosition.left : GridPinnedPosition.right;
    const label = otherSide === GridPinnedPosition.right ? 'pinToRight' : 'pinToLeft';

    return (
      <React.Fragment>
        <MenuItem onClick={pinColumn(otherSide)}>{apiRef.current.getLocaleText(label)}</MenuItem>
        <MenuItem onClick={unpinColumn}>{apiRef.current.getLocaleText('unpin')}</MenuItem>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <MenuItem onClick={pinColumn(GridPinnedPosition.left)}>
        {apiRef.current.getLocaleText('pinToLeft')}
      </MenuItem>
      <MenuItem onClick={pinColumn(GridPinnedPosition.right)}>
        {apiRef.current.getLocaleText('pinToRight')}
      </MenuItem>
    </React.Fragment>
  );
};

GridColumnPinningMenuItems.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  column: PropTypes.object,
  condensed: PropTypes.bool,
  onClick: PropTypes.func,
} as any;

export { GridColumnPinningMenuItems };
