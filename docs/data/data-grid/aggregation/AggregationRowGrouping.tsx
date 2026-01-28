import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function AggregationRowGrouping() {
  const apiRef = useGridApiRef();

  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: ['country', 'name', 'salary', 'isAdmin'],
    rowLength: 10000,
  });

  console.log(data);

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      ...data.initialState,
      rowGrouping: {
        model: ['country'],
      },
      aggregation: {
        model: {
          salary: 'sum',
          isAdmin: 'sizeTrue',
        },
      },
    },
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        apiRef={apiRef}
        {...data}
        disableRowSelectionOnClick
        initialState={initialState}
        pagination
      />
    </div>
  );
}
