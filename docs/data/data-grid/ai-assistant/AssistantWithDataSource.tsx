import * as React from 'react';
import {
  DataGridPremium,
  GridDataSource,
  GridGetRowsResponse,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
  unstable_gridDefaultPromptResolver as promptResolver,
  GridAiAssistantPanel,
} from '@mui/x-data-grid-premium';
import { useMockServer } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = [
  'id',
  'avatar',
  'name',
  'website',
  'rating',
  'email',
  'phone',
  'username',
  'position',
  'company',
  'salary',
  'country',
  'city',
  'lastUpdated',
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

function processPrompt(prompt: string, context: string, conversationId?: string) {
  return promptResolver(
    'https://backend.mui.com/api/datagrid/prompt',
    prompt,
    context,
    conversationId,
  );
}

export default function AssistantWithDataSource() {
  const apiRef = useGridApiRef();
  const { columns, initialState, fetchRows } = useMockServer<GridGetRowsResponse>(
    {
      dataSet: 'Employee',
      visibleFields: VISIBLE_FIELDS,
      maxColumns: 16,
      rowGrouping: true,
      rowLength: 1000,
    },
    { useCursorPagination: false },
  );

  const dataSource: GridDataSource = React.useMemo(
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
        aiAssistantSuggestions={[
          { value: 'Sort by name' },
          { value: 'Show people from the EU' },
          { value: 'Sort by company name and employee name' },
          { value: 'Order companies by amount of people' },
        ]}
        aiAssistant
        slots={{
          aiAssistantPanel: GridAiAssistantPanel,
        }}
        onPrompt={processPrompt}
        aggregationFunctions={aggregationFunctions}
        onDataSourceError={console.error}
        disablePivoting
      />
    </div>
  );
}
