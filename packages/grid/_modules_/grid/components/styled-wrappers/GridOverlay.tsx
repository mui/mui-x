import * as React from 'react';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { sizeHeaderHeightSelector } from '../../hooks/features/size/sizeSelector';
import { classnames } from '../../utils';
import { ApiContext } from '../api-context';

type GridOverlayProps = React.HTMLAttributes<HTMLDivElement>;

export function GridOverlay(props: GridOverlayProps) {
  const { className, style, ...other } = props;
  const apiRef = React.useContext(ApiContext);
  const headerHeight = useGridSelector(apiRef, sizeHeaderHeightSelector);
  return (
    <div
      className={classnames('MuiDataGrid-overlay', className)}
      style={{ top: headerHeight, ...style }}
      {...other}
    />
  );
}
