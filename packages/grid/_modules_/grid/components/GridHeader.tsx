import * as React from 'react';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

export const GridHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function GridHeader(props, ref) {
    const rootProps = useGridRootProps();

    const ToolbarComponent = rootProps.components.Toolbar;
    const ToolbarElement = ToolbarComponent && (
      <ToolbarComponent {...rootProps.componentsProps?.toolbar} />
    );

    return (
      <div ref={ref} {...props}>
        <rootProps.components.PreferencesPanel {...rootProps.componentsProps?.preferencesPanel} />
        {ToolbarElement}
      </div>
    );
  },
);
