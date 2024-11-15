import * as React from 'react';
import { GridDensityMenuRootContext } from './GridDensityMenuRootContext';
import { gridDensitySelector } from '../../../hooks/features/density/densitySelector';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';

export interface GridDensityMenuRootProps {
  children: React.ReactNode;
}

function GridDensityMenuRoot(props: GridDensityMenuRootProps) {
  const { children } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);
  const apiRef = useGridApiContext();
  const density = useGridSelector(apiRef, gridDensitySelector);

  const contextValue = React.useMemo(
    () => ({ triggerRef, open, onOpenChange: setOpen, value: density }),
    [triggerRef, open, setOpen, density],
  );

  return (
    <GridDensityMenuRootContext.Provider value={contextValue}>
      {children}
    </GridDensityMenuRootContext.Provider>
  );
}

export { GridDensityMenuRoot };
