import * as React from 'react';
import { PreferencesPanel } from './panel/PreferencesPanel';
import { GridToolbar } from './toolbar/GridToolbar';

export function GridHeader() {
  return (
    <React.Fragment>
      <PreferencesPanel />
      <GridToolbar />
    </React.Fragment>
  );
}
