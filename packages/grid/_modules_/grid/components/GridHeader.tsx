import * as React from 'react';

import { ApiContext } from './api-context';
import { useBaseComponentProps } from '../hooks/features/useBaseComponentProps';

export function GridHeader() {
  const apiRef = React.useContext(ApiContext);
  const baseProps = useBaseComponentProps(apiRef);

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
    <React.Fragment>
      {PreferencesPanelElement}
      {ToolbarElement}
    </React.Fragment>
  );
}
