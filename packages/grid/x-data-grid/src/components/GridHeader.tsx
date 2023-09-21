import * as React from 'react';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

export function GridHeader() {
  const rootProps = useGridRootProps();

  if (rootProps.hideHeader) {
    return null;
  }

  return (
    <React.Fragment>
      <rootProps.slots.preferencesPanel {...rootProps.slotProps?.preferencesPanel} />
      {rootProps.slots.toolbar && <rootProps.slots.toolbar {...rootProps.slotProps?.toolbar} />}
    </React.Fragment>
  );
}
