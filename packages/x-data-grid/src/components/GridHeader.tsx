import * as React from 'react';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridPreferencesPanel } from './panel/GridPreferencesPanel';

export function GridHeader() {
  const rootProps = useGridRootProps();

  const filterButtonRef = React.useRef<HTMLButtonElement>(null);
  const columnsButtonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <React.Fragment>
      <GridPreferencesPanel filterButtonRef={filterButtonRef} columnsButtonRef={columnsButtonRef} />
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
