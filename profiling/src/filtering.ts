import * as React from 'react';
import { GridLogicOperator } from '@mui/x-data-grid';
import { GridPrivateApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';
import { buildAggregatedFilterApplier } from '@mui/x-data-grid/hooks/features/filter/gridFilterUtils';
import { useDataGridProProps } from '@mui/x-data-grid-pro/DataGridPro/useDataGridProProps';
import { useDataGridProComponent } from '@mui/x-data-grid-pro/DataGridPro/useDataGridProComponent';
import { useDemoDataSync } from '@mui/x-data-grid-generator';

const { data } = useDemoDataSync({
  dataSet: 'Employee',
  rowLength: 100_000,
});

const inputProps = {
  ...data,
};

const inputApiRef: React.MutableRefObject<GridPrivateApiPro> = {
  current: { instanceId: { id: 1 } } as any,
};

const props = useDataGridProProps(inputProps);
const apiRef = useDataGridProComponent(inputApiRef, props);

const filterModel = {
  // items: [
  //   {
  //     field: 'name',
  //     operator: 'contains' as const,
  //     id: 86627,
  //     value: 'am',
  //   },
  // ],
  items: [],
  logicOperator: 'and' as GridLogicOperator,
  quickFilterValues: ['amm'],
  quickFilterLogicOperator: 'and' as GridLogicOperator,
};

const isRowMatchingFilters = buildAggregatedFilterApplier(undefined, filterModel, apiRef);

FILTERING_MARKER();

function FILTERING_MARKER() {
  const times = [] as number[];

  for (let i = 0; i < 20; i++) {
    console.log('---- Cycle ----');
    const start = Date.now();

    const result = apiRef.current.applyStrategyProcessor('filtering', {
      isRowMatchingFilters,
      filterModel: filterModel,
    });

    const end = Date.now();
    const elapsed = end - start;
    times.push(elapsed);

    console.log('  Input', props.rows.length);
    console.log('  Result', result.filteredRowsLookup.size);
    console.log('  Elapsed (ms)', elapsed);
  }

  console.log('');
  console.log('---- Stats ----');
  console.log('  Average', times.reduce((a, c) => a + c, 0) / (times.length || 1));
}
