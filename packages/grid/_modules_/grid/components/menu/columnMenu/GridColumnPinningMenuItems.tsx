import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridColDef } from '../../../models/colDef/gridColDef';

interface GridColumnPinningMenuItemsProps {
  column?: GridColDef;
  onClick?: (event: React.MouseEvent<any>) => void;
}

const GridColumnPinningMenuItems = (props: GridColumnPinningMenuItemsProps) => {
  const { column, onClick } = props;
  const apiRef = useGridApiContext();

  const pinColumn = React.useCallback(
    (side: 'left' | 'right') => (event: React.MouseEvent<HTMLElement>) => {
      apiRef.current.pinColumn(column!.field, side);

      if (onClick) {
        onClick(event);
      }
    },
    [apiRef, column, onClick],
  );

  const unpinColumn = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      apiRef.current.unpinColumn(column!.field);

      if (onClick) {
        onClick(event);
      }
    },
    [apiRef, column, onClick],
  );

  if (!column) {
    return null;
  }

  const side = apiRef.current.isColumnPinned(column.field);

  if (side) {
    const otherSide = side === 'right' ? 'left' : 'right';
    const label = otherSide === 'right' ? 'pinToRight' : 'pinToLeft';

    return (
      <React.Fragment>
        <MenuItem onClick={pinColumn(otherSide)}>{apiRef.current.getLocaleText(label)}</MenuItem>
        <MenuItem onClick={unpinColumn}>{apiRef.current.getLocaleText('unpin')}</MenuItem>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <MenuItem onClick={pinColumn('left')}>{apiRef.current.getLocaleText('pinToLeft')}</MenuItem>
      <MenuItem onClick={pinColumn('right')}>{apiRef.current.getLocaleText('pinToRight')}</MenuItem>
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
