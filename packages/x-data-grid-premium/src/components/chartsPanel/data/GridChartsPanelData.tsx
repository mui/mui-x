import * as React from 'react';
import { GridChartsPanelDataBody } from './GridChartsPanelDataBody';
import { GridChartsPanelDataHeader } from './GridChartsPanelDataHeader';

function GridChartsPanelData() {
  const [searchValue, setSearchValue] = React.useState<string>('');

  return (
    <>
      <GridChartsPanelDataHeader searchValue={searchValue} onSearchValueChange={setSearchValue} />
      <GridChartsPanelDataBody searchValue={searchValue} />
    </>
  );
}

export { GridChartsPanelData };
