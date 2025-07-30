---
title: Ask Your Table - AI Assistant
---

# Ask Your Table - AI Assistant [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

Translate natural language into Data Grid views.

:::warning
To use this feature you must have a prompt processing backend.
MUI [offers this service](/x/react-data-grid/ai-assistant/#with-muis-service) as a part of a premium package add-on.
Email us at [sales@mui.com](mailto:sales@mui.com) for more information.
:::

The AI Assistant feature lets users interact with the Data Grid component using natural language.
Type a prompt like "sort by name", "show amounts larger than 1000", or even make more complex queries like "which customers brought the most revenue the past year" in the prompt input field and the Data Grid will update accordingly.
In [supported browsers](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#browser_compatibility), users can also prompt the assistant using their voice.

To enable this feature on the Data Grid, pass the `aiAssistant` prop and use the `GridAiAssistantPanel` component for `aiAssistantPanel` slot:

```tsx
import { DataGridPremium, GridAiAssistantPanel } from '@mui/x-data-grid-premium';
// ...
<DataGridPremium aiAssistant slots={{ aiAssistantPanel: GridAiAssistantPanel }} />;
```

## Improving accuracy with example values

To increase the accuracy of the language processing, provide example values for the available columns via one of the methods below.

### Provide custom examples

Use the `examples` property on items of the `columns` array to provide custom examples as context for prompt processing.
The `examples` property should contain an array of possible values for its respective column.

:::info
AI Assistant demos use limited [MUI's processing service](/x/react-data-grid/ai-assistant/#with-muis-service).
:::

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridAiAssistantPanel,
  unstable_gridDefaultPromptResolver as promptResolver,
} from '@mui/x-data-grid-premium';
import {
  randomBoolean,
  randomCompanyName,
  randomCountry,
  randomCreatedDate,
  randomEmail,
  randomInt,
  randomJobTitle,
  randomPhoneNumber,
  randomTraderName,
  useDemoData,
} from '@mui/x-data-grid-generator';

function createExamples(column: string) {
  switch (column) {
    case 'name':
      return Array.from({ length: 5 }, () => randomTraderName());
    case 'email':
      return Array.from({ length: 5 }, () => randomEmail());
    case 'position':
      return Array.from({ length: 5 }, () => randomJobTitle());
    case 'company':
      return Array.from({ length: 5 }, () => randomCompanyName());
    case 'salary':
      return Array.from({ length: 5 }, () => randomInt(30000, 80000));
    case 'phone':
      return Array.from({ length: 5 }, () => randomPhoneNumber());
    case 'country':
      return Array.from({ length: 5 }, () => randomCountry());
    case 'dateCreated':
      return Array.from({ length: 5 }, () => randomCreatedDate());
    case 'isAdmin':
      return Array.from({ length: 5 }, () => randomBoolean());
    default:
      return [];
  }
}

function processPrompt(prompt: string, context: string, conversationId?: string) {
  return promptResolver(
    'https://backend.mui.com/api/datagrid/prompt',
    prompt,
    context,
    conversationId,
  );
}

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

export default function AssistantWithExamples() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 1000,
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((column) => ({
        ...column,
        examples: createExamples(column.field),
      })),
    [data.columns],
  );

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        {...data}
        columns={columns}
        aiAssistantSuggestions={[
          { value: 'Sort by name' },
          { value: 'Show people from the EU' },
          { value: 'Sort by company name and employee name' },
          { value: 'Order companies by amount of people' },
        ]}
        aiAssistant
        onPrompt={processPrompt}
        showToolbar
        slots={{
          aiAssistantPanel: GridAiAssistantPanel,
        }}
      />
    </div>
  );
}

```

### Use row data for examples

Pass the `allowAiAssistantDataSampling` prop to use row data to generate examples.
This is useful if you're dealing with non-sensitive data and want to skip creating custom examples for each column.

Data is collected randomly at the cell level, which means that the examples for a given column might not come from the same rows.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridAiAssistantPanel,
  unstable_gridDefaultPromptResolver as promptResolver,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

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

function processPrompt(prompt: string, context: string, conversationId?: string) {
  return promptResolver(
    'https://backend.mui.com/api/datagrid/prompt',
    prompt,
    context,
    conversationId,
  );
}

export default function AssistantWithDataSampling() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 1000,
  });

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        {...data}
        aiAssistantSuggestions={[
          { value: 'Sort by name' },
          { value: 'Show people from the EU' },
          { value: 'Sort by company name and employee name' },
          { value: 'Order companies by amount of people' },
        ]}
        allowAiAssistantDataSampling
        aiAssistant
        onPrompt={processPrompt}
        showToolbar
        slots={{
          aiAssistantPanel: GridAiAssistantPanel,
        }}
      />
    </div>
  );
}

```

### Using server-side data

The example below shows how to combine the AI Assistant with [server-side data](/x/react-data-grid/server-side-data/).

```tsx
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

```

## Processing service integration

Natural language prompts must be processed by a service to understand what kinds of state changes must be applied to the Data Grid to match the user's request.
You can use MUI's processing service or build your own.

### With MUI's service

The Data Grid provides all the necessary elements for integration with MUI's service.

1. Contact [sales@mui.com](mailto:sales@mui.com) to get an API key for our processing service.

   :::warning
   Avoid exposing the API key to the client by using a proxy server that receives prompt processing requests, adds the `x-api-key` header, and passes the request on to MUI's service.

   This is an example of a [Fastify proxy](https://www.npmjs.com/package/@fastify/http-proxy) for the prompt requests.

   ```ts
   fastify.register(proxy, {
     upstream: 'https://backend.mui.com',
     prefix: '/api/my-custom-path',
     rewritePrefix: '/api/v1/datagrid/prompt',
     replyOptions: {
       rewriteRequestHeaders: (_, headers) => ({
         ...headers,
         'x-api-key': process.env.MUI_DATAGRID_API_KEY,
       }),
     },
   });
   ```

   :::

2. Enable the AI Assistant feature by adding the `aiAssistant` prop.
   This adds a new button to the Toolbar that controlls the Assistant Panel open state.
3. Provide `<GridAiAssistantPanel />` as a component for the `aiAssistantPanel` slot.
   Slot is by default `null` to prevent bundling of the panel and its child components in the projects that are not using the AI Assistant feature.
4. Provide the `onPrompt()` callback to pass the user's prompts to the service.
   The service's response is used internally by the Data Grid to make the necessary state updates.

   :::success
   You can implement `onPrompt()` with `unstable_gridDefaultPromptResolver()`.
   This adds the necessary headers and stringifies the body in the correct format for you.

   It also makes it possible to provide additional context for better processing results, as shown below:

   ```ts
   const PROMPT_RESOLVER_PROXY_BASE_URL =
     process.env.NODE_ENV === 'development'
       ? 'http://localhost:3000'
       : 'https://api.my-proxy.com';

   function processPrompt(query: string, context: string, conversationId?: string) {
     const additionalContext = `The rows represent: List of employees with their company, position and start date`;

     return unstable_gridDefaultPromptResolver(
       `${PROMPT_RESOLVER_PROXY_BASE_URL}/api/my-custom-path`,
       query,
       context,
       conversationId,
       additionalContext,
     );
   }
   ```

   :::

5. Provide data examples in either of the following ways:
   - Fill the `examples` prop in the `columns` array – this is recommended if you want to avoid exposing the row data to the AI Assistant.
   - Provide access to the row data with `allowAiAssistantDataSampling` prop – since this uses real data, it may lead to better processing results.

### With a custom service

The Data Grid exposes elements of the AI Assistant feature so you can build your own prompt processing service:

- The [`aiAssistant` API](/x/api/data-grid/grid-api/#grid-api-prop-aiAssistant) for processing the prompt results and updating state
- The `unstable_gridDefaultPromptResolver()` method for passing the prompt and context with the necessary headers to the processing service

Integrate these elements with your custom components and methods to suit your specific use case.

You can use a fully custom solution and apply the processing result using other Grid APIs such as [`setFilterModel()`](/x/api/data-grid/grid-api/#grid-api-prop-setFilterModel) or [`setSortModel()`](/x/api/data-grid/grid-api/#grid-api-prop-setSortModel) without the need to structure it as a `PromptResponse`.

To replace `unstable_gridDefaultPromptResolver()` with your own solution, send a POST request to MUI's API.

The body of the request requires `query` and `context` parameters.
`conversationId` and `additionalContext` are optional.
To keep the previous messages in the context you should pass the `conversationId` from the previous response.

The API response type is `Result<PromptResponse>`.

```ts
type Result<T> = { ok: false; message: string } | { ok: true; data: T };
```

Your resolver should return `Promise<PromptResponse>`.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
