import * as React from 'react';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { gridDensityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { useGridState } from '../../hooks/features/core/useGridState';
import { getTotalHeight } from '../../utils/getTotalHeight';
import { classnames } from '../../utils';
import { GridApiContext } from '../GridApiContext';

export interface GridWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  size: { width: number; height: number };
}

export const GridWindow = React.forwardRef<HTMLDivElement, GridWindowProps>(function GridWindow(
  props,
  ref,
) {
  const { className, size, ...other } = props;
  const apiRef = React.useContext(GridApiContext);
  const { autoHeight } = useGridSelector(apiRef, optionsSelector);
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);
  const [gridState] = useGridState(apiRef!);

  React.useEffect(() => {
    // refs are run before effect. Waiting for an effect guarentees that
    // windowRef is resolved first.
    // Once windowRef is resolved, we can update the size of the container.
    apiRef!.current.resize();
  }, [apiRef]);

  return (
    <div
      style={{
        width: size.width,
        height: getTotalHeight(gridState.options, gridState.containerSizes, size.height),
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
