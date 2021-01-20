import * as React from 'react';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { densityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';
import { classnames } from '../../utils';
import { ApiContext } from '../api-context';

type GridOverlayProps = React.HTMLAttributes<HTMLDivElement>;

export function GridOverlay(props: GridOverlayProps) {
  const { className, style, ...other } = props;
  const apiRef = React.useContext(ApiContext);
  const headerHeight = useGridSelector(apiRef, densityHeaderHeightSelector);
  return (
    <div
      className={classnames('MuiDataGrid-overlay', className)}
      style={{ top: headerHeight, ...style }}
      {...other}
    />
  );
}
