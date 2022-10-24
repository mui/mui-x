import * as React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
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

    if (onClick && !condensed) {
      onClick(event);
    }
  };

  const unpinColumn = (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.unpinColumn(column!.field);

    if (onClick && !condensed) {
      onClick(event);
    }
  };

  if (!column) {
    return null;
  }

  const side = apiRef.current.isColumnPinned(column.field);

  if (condensed) {
    return (
      <Stack px={1.5}>
        <Typography color="text.secondary" fontSize="12px">
          Pin to
        </Typography>
        <Stack direction="row" justifyContent="space-between" minWidth={'248px'}>
          <Stack
            direction="row"
            sx={{
              '& .MuiButton-root': {
                fontSize: '16px',
                fontWeight: '400',
                color: 'common.black',
                '&.Mui-disabled': {
                  color: 'primary.main',
                  '& .MuiSvgIcon-root': {
                    color: 'primary.main',
                  },
                },
                '& .MuiSvgIcon-root': {
                  color: 'grey.700',
                },
              },
            }}
          >
            <Button
              onClick={pinColumn(GridPinnedPosition.left)}
              startIcon={<PushPinIcon />}
              disabled={side === GridPinnedPosition.left}
              sx={{
                '& .MuiSvgIcon-root': {
                  transform: 'rotate(30deg)',
                },
              }}
            >
              {apiRef.current.getLocaleText('pinToLeftCondensed')}
            </Button>
            <Button
              onClick={pinColumn(GridPinnedPosition.right)}
              startIcon={<PushPinIcon />}
              disabled={side === GridPinnedPosition.right}
              sx={{
                '& .MuiSvgIcon-root': {
                  transform: 'rotate(-30deg)',
                },
              }}
            >
              {apiRef.current.getLocaleText('pinToRightCondensed')}
            </Button>
          </Stack>
          <IconButton
            aria-label="unpin"
            onClick={unpinColumn}
            disabled={!side}
            sx={{ color: 'grey.700' }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
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
  onClick: PropTypes.func,
} as any;

export { GridColumnPinningMenuItems };
