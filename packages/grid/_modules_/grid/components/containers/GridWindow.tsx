import * as React from 'react';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { densityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';
import { optionsSelector } from '../../hooks/utils/useOptionsProp';
import { classnames } from '../../utils';
import { ApiContext } from '../api-context';

type GridWindowProps = React.HTMLAttributes<HTMLDivElement>;

export const GridWindow = React.forwardRef<HTMLDivElement, GridWindowProps>(function GridWindow(
  props,
  ref,
) {
  const { className, ...other } = props;
  const apiRef = React.useContext(ApiContext);
  const { autoHeight } = useGridSelector(apiRef, optionsSelector);
  const headerHeight = useGridSelector(apiRef, densityHeaderHeightSelector);
  return (
    <div
      ref={ref}
      className={classnames('MuiDataGrid-window', className)}
      {...other}
      style={{ top: headerHeight, overflowY: autoHeight ? 'hidden' : 'auto' }}
    />
  );
});
