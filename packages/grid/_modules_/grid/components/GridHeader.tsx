import * as React from 'react';
import { GridApiContext } from './GridApiContext';
import { useGridBaseComponentProps } from '../hooks/features/useGridBaseComponentProps';
import { useGridStripBaseComponentsProps } from '../hooks/utils/useGridStripBaseComponentsProps';

export const GridHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function GridHeader(props, ref) {
    const strippedProps = useGridStripBaseComponentsProps(props);
    const apiRef = React.useContext(GridApiContext);
    const baseProps = useGridBaseComponentProps(apiRef);

    const PreferencesPanelComponent = apiRef?.current.components.PreferencesPanel;
    const PreferencesPanelElement = PreferencesPanelComponent && (
      <PreferencesPanelComponent
        {...baseProps}
        {...apiRef?.current.componentsProps?.preferencesPanel}
      />
    );
    const ToolbarComponent = apiRef?.current.components.Toolbar;
    const ToolbarElement = ToolbarComponent && (
      <ToolbarComponent {...baseProps} {...apiRef?.current.componentsProps?.toolbar} />
    );

    return (
      <div ref={ref} {...strippedProps}>
        {PreferencesPanelElement}
        {ToolbarElement}
      </div>
    );
  },
);
