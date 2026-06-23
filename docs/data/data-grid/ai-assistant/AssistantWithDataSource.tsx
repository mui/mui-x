import * as React from 'react';
import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon';
import {
  DataGridPremium,
  GridDataSource,
  GridGetRowsResponse,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
  unstable_gridDefaultPromptResolver as promptResolver,
  GridAiAssistantPanel,
  DataGridPremiumProps,
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

function BlueAiAssistantIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} color="primary">
      <path d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-5.12 10.88L12 17l-1.88-4.12L6 11l4.12-1.88L12 5l1.88 4.12L18 11z" />
    </SvgIcon>
  );
}

const aggregationFunctions = {
  sum: { columnTypes: ['number'] },
  avg: { columnTypes: ['number'] },
  min: { columnTypes: ['number', 'date', 'dateTime'] },
  max: { columnTypes: ['number', 'date', 'dateTime'] },
  size: {},
};

const pivotingColDef: DataGridPremiumProps['pivotingColDef'] = (
  originalColumnField,
  columnGroupPath,
) => ({
  field: columnGroupPath.concat(originalColumnField).join('>->'),
});

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
          pivotModel: JSON.stringify(params.pivotModel),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
          aggregateRow: getRowsResponse.aggregateRow,
          pivotColumns: getRowsResponse.pivotColumns,
        };
      },
      getGroupKey: (row) => row.group,
      getChildrenCount: (row) => row.descendantCount,
      getAggregatedValue: (row, field) => row[field],
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
          aiAssistantIcon: BlueAiAssistantIcon,
        }}
        onPrompt={processPrompt}
        aggregationFunctions={aggregationFunctions}
        onDataSourceError={console.error}
        pivotingColDef={pivotingColDef}
      />
    </div>
  );
}
