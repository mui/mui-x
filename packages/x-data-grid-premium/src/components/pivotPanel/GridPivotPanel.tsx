import * as React from 'react';
import { GridPivotPanelHeader } from './GridPivotPanelHeader';
import { GridPivotPanelBody } from './GridPivotPanelBody';

function GridPivotPanel() {
  const [searchValue, setSearchValue] = React.useState<string>('');
  return (
    <React.Fragment>
      <GridPivotPanelHeader searchValue={searchValue} onSearchValueChange={setSearchValue} />
      <GridPivotPanelBody searchValue={searchValue} />
    </React.Fragment>
  );
}

export { GridPivotPanel };
