import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { mockPromptResolver, useMockServer } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = [
  'name',
  'email',
  'position',
  'company',
  'salary',
  'phone',
  'country',
  'dateCreated',
  'isAdmin',
];

const aggregationFunctions = {
  sum: { columnTypes: ['number'] },
  avg: { columnTypes: ['number'] },
  min: { columnTypes: ['number', 'date', 'dateTime'] },
  max: { columnTypes: ['number', 'date', 'dateTime'] },
  size: {},
};

export default function AssistantWithDataSource() {
  const apiRef = useGridApiRef();
  const { columns, initialState, fetchRows } = useMockServer(
    {
      dataSet: 'Employee',
      visibleFields: VISIBLE_FIELDS,
      maxColumns: 16,
      rowGrouping: true,
      rowLength: 10000,
    },
    { useCursorPagination: false },
  );

  const dataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          groupKeys: JSON.stringify(params.groupKeys),
          groupFields: JSON.stringify(params.groupFields),
          aggregationModel: JSON.stringify(params.aggregationModel),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
          aggregateRow: getRowsResponse.aggregateRow,
        };
      },
      getGroupKey: (row) => row.group,
      getChildrenCount: (row) => row.descendantCount,
      getAggregatedValue: (row, field) => row[`${field}Aggregate`],
    }),
    [fetchRows],
  );

  const initialStateUpdated = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      ...initialState,
      pagination: {
        paginationModel: { pageSize: 10, page: 0 },
        rowCount: 0,
      },
      aiAssistant: {
        suggestions: [
          'Sort by name',
          'Show people from the EU',
          // 'Sort by company name and employee name',
          // 'Order companies by amount of people',
        ],
      },
    },
  });

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        apiRef={apiRef}
        columns={columns}
        dataSource={dataSource}
        dataSourceCache={null}
        pagination
        initialState={initialStateUpdated}
        pageSizeOptions={[10, 20, 50]}
        showToolbar
        allowAiAssistantDataSampling
        enableAiAssistant
        onPrompt={mockPromptResolver}
        aggregationFunctions={aggregationFunctions}
        onDataSourceError={console.error}
      />
    </div>
  );
}
