import * as React from 'react';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridPreferencesPanel } from './panel/GridPreferencesPanel';

export function GridHeader() {
  const rootProps = useGridRootProps();

  return (
    <React.Fragment>
      <GridPreferencesPanel />
      {rootProps.slots.toolbar && <rootProps.slots.toolbar {...rootProps.slotProps?.toolbar} />}
    </React.Fragment>
  );
}
