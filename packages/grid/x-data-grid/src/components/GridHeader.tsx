import * as React from 'react';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

export const GridHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function GridHeader(props, ref) {
    const rootProps = useGridRootProps();

    return (
      <div ref={ref} {...props}>
        <rootProps.slots.PreferencesPanel {...rootProps.slotsProps?.preferencesPanel} />
        {rootProps.slots.Toolbar && <rootProps.slots.Toolbar {...rootProps.slotsProps?.toolbar} />}
      </div>
    );
  },
);
