import * as React from 'react';
import { GridPivotPanelHeader } from './GridPivotPanelHeader';
import { GridPivotPanelBody } from './GridPivotPanelBody';

function GridPivotPanel() {
  const [searchState, setSearchState] = React.useState<{
    value: string;
    enabled: boolean;
  }>({
    value: '',
    enabled: false,
  });

  return (
    <React.Fragment>
      <GridPivotPanelHeader searchState={searchState} onSearchStateChange={setSearchState} />
      <GridPivotPanelBody searchState={searchState} />
    </React.Fragment>
  );
}

export { GridPivotPanel };
