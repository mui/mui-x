import * as React from 'react';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { gridDensityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';
import { classnames } from '../../utils';
import { GridApiContext } from '../GridApiContext';

type GridOverlayProps = React.HTMLAttributes<HTMLDivElement>;

export function GridOverlay(props: GridOverlayProps) {
  const { className, style, ...other } = props;
  const apiRef = React.useContext(GridApiContext);
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);
  return (
    <div
      className={classnames('MuiDataGrid-overlay', className)}
      style={{ top: headerHeight, ...style }}
      {...other}
    />
  );
}
