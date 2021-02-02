import * as React from 'react';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { densityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { useGridState } from '../../hooks/features/core/useGridState';
import { getCurryTotalHeight } from '../../utils/getTotalHeight';
import { classnames } from '../../utils';
import { ApiContext } from '../api-context';

export interface GridWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  size: { width: number; height: number };
}

export const GridWindow = React.forwardRef<HTMLDivElement, GridWindowProps>(function GridWindow(
  props,
  ref,
) {
  const { className, size, ...other } = props;
  const apiRef = React.useContext(ApiContext);
  const { autoHeight } = useGridSelector(apiRef, optionsSelector);
  const headerHeight = useGridSelector(apiRef, densityHeaderHeightSelector);
  const [gridState] = useGridState(apiRef!);

  return (
    <div
      style={{
        width: props.size.width,
        height: getCurryTotalHeight(gridState.options, gridState.containerSizes)(size),
      }}
    >
      <div
        ref={ref}
        className={classnames('MuiDataGrid-window', className)}
        {...other}
        style={{ top: headerHeight, overflowY: autoHeight ? 'hidden' : 'auto' }}
      />
    </div>
  );
});
