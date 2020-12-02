import * as React from 'react';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { sizeHeaderHeightSelector } from '../../hooks/features/size/sizeSelector';
import { classnames } from '../../utils';
import { ApiContext } from '../api-context';
import { OptionsContext } from '../options-context';

type GridWindowProps = React.HTMLAttributes<HTMLDivElement>;

export const GridWindow = React.forwardRef<HTMLDivElement, GridWindowProps>(function GridWindow(
  props,
  ref,
) {
  const { className, ...other } = props;
  const { autoHeight } = React.useContext(OptionsContext);
  const apiRef = React.useContext(ApiContext);
  const headerHeight = useGridSelector(apiRef, sizeHeaderHeightSelector);
  return (
    <div
      ref={ref}
      className={classnames('MuiDataGrid-window', className)}
      {...other}
      style={{ top: headerHeight, overflowY: autoHeight ? 'hidden' : 'auto' }}
    />
  );
});
