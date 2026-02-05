import * as React from 'react';
import { useRtl } from '@mui/system/RtlProvider';
import PropTypes from 'prop-types';
import { GridPinnedColumnPosition, type GridColumnMenuItemProps } from '@mui/x-data-grid';
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

  // Handle toggle pattern with columnMenuPinIcon
  const handleTogglePin = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const side = apiRef.current.isColumnPinned(colDef.field);
      if (!side) {
        // Unpinned -> Pin Left
        pinColumn(GridPinnedColumnPosition.LEFT)(event);
      } else if (side === GridPinnedColumnPosition.LEFT) {
        // Pin Left -> Pin Right
        pinColumn(GridPinnedColumnPosition.RIGHT)(event);
      } else {
        // Pin Right -> Unpin
        unpinColumn(event);
      }
    },
    [apiRef, colDef.field, pinColumn, unpinColumn],
  );

  if (!colDef) {
    return null;
  }

  const side = apiRef.current.isColumnPinned(colDef.field);

  // Use new toggle pattern if columnMenuPinIcon is provided
  if (rootProps.slots.columnMenuPinIcon) {
    let label: string;
    if (!side) {
      label = 'pinToLeft';
    } else if (side === GridPinnedColumnPosition.LEFT) {
      label = 'pinToRight';
    } else {
      label = 'unpin';
    }

    return (
      <rootProps.slots.baseMenuItem
        onClick={handleTogglePin}
        iconStart={<rootProps.slots.columnMenuPinIcon fontSize="small" />}
      >
        {apiRef.current.getLocaleText(label)}
      </rootProps.slots.baseMenuItem>
    );
  }

  // Fallback to old behavior for backward compatibility
  const pinToLeftMenuItem = (
    <rootProps.slots.baseMenuItem
      onClick={pinColumn(GridPinnedColumnPosition.LEFT)}
      iconStart={
        <(rootProps.slots.columnMenuPinLeftIcon ?? rootProps.slots.columnMenuPinIcon)
          fontSize="small"
        />
      }
    >
      {apiRef.current.getLocaleText('pinToLeft')}
    </rootProps.slots.baseMenuItem>
  );

  const pinToRightMenuItem = (
    <rootProps.slots.baseMenuItem
      onClick={pinColumn(GridPinnedColumnPosition.RIGHT)}
      iconStart={
        <(rootProps.slots.columnMenuPinRightIcon ?? rootProps.slots.columnMenuPinIcon)
          fontSize="small"
        />
      }
    >
      {apiRef.current.getLocaleText('pinToRight')}
    </rootProps.slots.baseMenuItem>
  );

  if (side) {
    const otherSide =
      side === GridPinnedColumnPosition.RIGHT
        ? GridPinnedColumnPosition.LEFT
        : GridPinnedColumnPosition.RIGHT;
    const label = otherSide === GridPinnedColumnPosition.RIGHT ? 'pinToRight' : 'pinToLeft';
    const Icon =
      side === GridPinnedColumnPosition.RIGHT
        ? rootProps.slots.columnMenuPinLeftIcon ?? rootProps.slots.columnMenuPinIcon
        : rootProps.slots.columnMenuPinRightIcon ?? rootProps.slots.columnMenuPinIcon;
    return (
      <React.Fragment>
        <rootProps.slots.baseMenuItem
          onClick={pinColumn(otherSide)}
          iconStart={<Icon fontSize="small" />}
        >
          {apiRef.current.getLocaleText(label)}
        </rootProps.slots.baseMenuItem>
        <rootProps.slots.baseMenuItem onClick={unpinColumn} iconStart={<span />}>
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
