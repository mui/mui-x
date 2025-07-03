'use client';

import * as React from 'react';
import { GridChartsPanelDataBody } from './GridChartsPanelDataBody';
import { GridChartsPanelDataHeader } from './GridChartsPanelDataHeader';
import { GridChartsIntegrationSection } from '../../../hooks/features/chartsIntegration/gridChartsIntegrationInterfaces';

export type SectionLimitLookup = Map<GridChartsIntegrationSection, number>;

export interface GridChartsPanelDataProps {
  sectionLimitLookup: SectionLimitLookup;
}

function GridChartsPanelData(props: GridChartsPanelDataProps) {
  const { sectionLimitLookup } = props;
  const [searchValue, setSearchValue] = React.useState<string>('');

  return (
    <React.Fragment>
      <GridChartsPanelDataHeader searchValue={searchValue} onSearchValueChange={setSearchValue} />
      <GridChartsPanelDataBody searchValue={searchValue} sectionLimitLookup={sectionLimitLookup} />
    </React.Fragment>
  );
}

export { GridChartsPanelData };
