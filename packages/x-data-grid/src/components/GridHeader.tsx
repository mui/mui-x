import * as React from 'react';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridPreferencesPanel } from './panel/GridPreferencesPanel';

export function GridHeader() {
  const { slots, slotProps, showToolbar } = useGridRootProps();

  return (
    <React.Fragment>
      <GridPreferencesPanel />
      {showToolbar && (
        <slots.toolbar
          // Fixes error augmentation issue https://github.com/mui/mui-x/pull/15255#issuecomment-2454721612
          {...(slotProps?.toolbar as any)}
        />
      )}
    </React.Fragment>
  );
}
