'use client';

import * as React from 'react';
import { GridChartsPanelDataBody } from './GridChartsPanelDataBody';
import { GridChartsPanelDataHeader } from './GridChartsPanelDataHeader';

export type SectionLimitLookup = Map<'dimensions' | 'values', number>;

function GridChartsPanelData() {
  const [searchValue, setSearchValue] = React.useState<string>('');

  return (
    <React.Fragment>
      <GridChartsPanelDataHeader searchValue={searchValue} onSearchValueChange={setSearchValue} />
      <GridChartsPanelDataBody searchValue={searchValue} />
    </React.Fragment>
  );
}

export { GridChartsPanelData };
