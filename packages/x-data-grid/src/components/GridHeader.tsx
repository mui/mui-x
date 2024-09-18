import * as React from 'react';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridPreferencesPanel } from './panel/GridPreferencesPanel';
import { GridPreferencePanelsValue } from '../hooks';

export function GridHeader() {
  const rootProps = useGridRootProps();

  const filterButtonRef = React.useRef<HTMLButtonElement>(null);
  const columnsButtonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <React.Fragment>
      <GridPreferencesPanel
        type={GridPreferencePanelsValue.filters}
        anchorEl={filterButtonRef.current}
      />

      <GridPreferencesPanel
        type={GridPreferencePanelsValue.columns}
        anchorEl={columnsButtonRef.current}
      />

      {rootProps.slots.toolbar && (
        <rootProps.slots.toolbar
          filterButtonRef={filterButtonRef}
          columnsButtonRef={columnsButtonRef}
          {...rootProps.slotProps?.toolbar}
        />
      )}
    </React.Fragment>
  );
}
