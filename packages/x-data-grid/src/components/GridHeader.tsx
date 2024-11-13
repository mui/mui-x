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

      {rootProps.slots.toolbar && (
        <rootProps.slots.toolbar
          // Fixes error augmentation issue https://github.com/mui/mui-x/pull/15255#issuecomment-2454721612
          {...(rootProps.slotProps?.toolbar as any)}
        />
      )}
    </React.Fragment>
  );
}
