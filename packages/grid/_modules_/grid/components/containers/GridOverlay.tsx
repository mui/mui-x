import * as React from 'react';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { gridDensityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';
import { classnames } from '../../utils';
import { GridApiContext } from '../GridApiContext';

export type GridOverlayProps = React.HTMLAttributes<HTMLDivElement>;

export const GridOverlay = React.forwardRef<HTMLDivElement, GridOverlayProps>(function GridOverlay(
  props: GridOverlayProps,
  ref,
) {
  const { className, style, ...other } = props;
  const apiRef = React.useContext(GridApiContext);
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);

  return (
    <div
      ref={ref}
      className={classnames('MuiDataGrid-overlay', className)}
      style={{ top: headerHeight, ...style }}
      {...other}
    />
  );
});
