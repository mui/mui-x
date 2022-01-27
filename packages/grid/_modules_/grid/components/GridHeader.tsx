import * as React from 'react';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

export const GridHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function GridHeader(props, ref) {
    const rootProps = useGridRootProps();

    console.log(rootProps);

    return (
      <div ref={ref} {...props}>
        TTT
        {/*<rootProps.components.PreferencesPanel {...rootProps.componentsProps?.preferencesPanel} />*/}
        {/*{rootProps.components.Toolbar && (*/}
        {/*  <rootProps.components.Toolbar {...rootProps.componentsProps?.toolbar} />*/}
        {/*)}*/}
      </div>
    );
  },
);
