import * as React from 'react';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridPreferencesPanel } from './panel/GridPreferencesPanel';
import { GridPreferencePanelsValue } from '../hooks';

export function GridHeader() {
  const rootProps = useGridRootProps();

  return (
    <React.Fragment>
      <GridPreferencesPanel type={GridPreferencePanelsValue.filters} />

      <GridPreferencesPanel type={GridPreferencePanelsValue.columns} />

      {rootProps.slots.toolbar && <rootProps.slots.toolbar {...rootProps.slotProps?.toolbar} />}
    </React.Fragment>
  );
}
