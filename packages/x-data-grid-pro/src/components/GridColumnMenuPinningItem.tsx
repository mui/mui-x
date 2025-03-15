import * as React from 'react';
import { useRtl } from '@mui/system/RtlProvider';
import PropTypes from 'prop-types';
import { GridPinnedColumnPosition, GridColumnMenuItemProps } from '@mui/x-data-grid';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

function GridColumnMenuPinningItem(props: GridColumnMenuItemProps) {
  const { colDef, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const isRtl = useRtl();

  const pinColumn = React.useCallback(
    (side: GridPinnedColumnPosition) => (event: React.MouseEvent<HTMLElement>) => {
      apiRef.current.pinColumn(colDef.field, side);
      onClick(event);
    },
    [apiRef, colDef.field, onClick],
  );

  const unpinColumn = (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.unpinColumn(colDef.field);
    onClick(event);
  };
  const pinToLeftMenuItem = (
    <rootProps.slots.baseMenuItem
      onClick={pinColumn(GridPinnedColumnPosition.LEFT)}
      iconStart={<rootProps.slots.columnMenuPinLeftIcon fontSize="small" />}
    >
      {apiRef.current.getLocaleText('pinToLeft')}
    </rootProps.slots.baseMenuItem>
  );

  const pinToRightMenuItem = (
    <rootProps.slots.baseMenuItem
      onClick={pinColumn(GridPinnedColumnPosition.RIGHT)}
      iconStart={<rootProps.slots.columnMenuPinRightIcon fontSize="small" />}
    >
      {apiRef.current.getLocaleText('pinToRight')}
    </rootProps.slots.baseMenuItem>
  );

  if (!colDef) {
    return null;
  }

  const side = apiRef.current.isColumnPinned(colDef.field);

  if (side) {
    const otherSide =
      side === GridPinnedColumnPosition.RIGHT
        ? GridPinnedColumnPosition.LEFT
        : GridPinnedColumnPosition.RIGHT;
    const label = otherSide === GridPinnedColumnPosition.RIGHT ? 'pinToRight' : 'pinToLeft';
    const Icon =
      side === GridPinnedColumnPosition.RIGHT
        ? rootProps.slots.columnMenuPinLeftIcon
        : rootProps.slots.columnMenuPinRightIcon;
    return (
      <React.Fragment>
        <rootProps.slots.baseMenuItem
          onClick={pinColumn(otherSide)}
          iconStart={<Icon fontSize="small" />}
        >
          {apiRef.current.getLocaleText(label)}
        </rootProps.slots.baseMenuItem>
        <rootProps.slots.baseMenuItem onClick={unpinColumn} iconStart="">
          {apiRef.current.getLocaleText('unpin')}
        </rootProps.slots.baseMenuItem>
      </React.Fragment>
    );
  }

  if (isRtl) {
    return (
      <React.Fragment>
        {pinToRightMenuItem}
        {pinToLeftMenuItem}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {pinToLeftMenuItem}
      {pinToRightMenuItem}
    </React.Fragment>
  );
}

GridColumnMenuPinningItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuPinningItem };
