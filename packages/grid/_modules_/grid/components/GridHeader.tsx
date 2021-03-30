import * as React from 'react';
import { GridApiContext } from './GridApiContext';

export const GridHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function GridHeader(props, ref) {
    const apiRef = React.useContext(GridApiContext);

    const PreferencesPanelComponent = apiRef?.current.components.PreferencesPanel;
    const PreferencesPanelElement = PreferencesPanelComponent && (
      <PreferencesPanelComponent {...apiRef?.current.componentsProps?.preferencesPanel} />
    );
    const ToolbarComponent = apiRef?.current.components.Toolbar;
    const ToolbarElement = ToolbarComponent && (
      <ToolbarComponent {...apiRef?.current.componentsProps?.toolbar} />
    );

    return (
      <div ref={ref} {...props}>
        {PreferencesPanelElement}
        {ToolbarElement}
      </div>
    );
  },
);
