import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import {
  DataGridPremium,
  GridAiAssistantPanel,
  unstable_gridDefaultPromptResolver as promptResolver,
  GridChartsPanel,
  GridChartsIntegrationContextProvider,
  GridChartsRendererProxy,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import {
  ChartsRenderer,
  configurationOptions,
  ChartsRendererProps,
} from '@mui/x-charts-premium/ChartsRenderer';

function processPrompt(prompt: string, context: string, conversationId?: string) {
  return promptResolver(
    'https://backend.mui.com/api/datagrid/prompt',
    prompt,
    context,
    conversationId,
  );
}

export default function AssistantWithCharts() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10000,
  });

  const apiRef = useGridApiRef();

  const initialState = {
    ...data.initialState,
    pagination: {
      ...data.initialState?.pagination,
      paginationModel: {
        pageSize: 25,
      },
    },
    chartsIntegration: {
      charts: {
        main: {
          chartType: 'column',
        },
      },
    },
  };

  return (
    <GridChartsIntegrationContextProvider>
      <div style={{ gap: 32, width: '100%' }}>
        <div style={{ height: 450 }}>
          <DataGridPremium
            {...data}
            apiRef={apiRef}
            initialState={initialState}
            pagination
            aiAssistantSuggestions={[
              { value: 'How many commodities are in each status' },
              { value: 'Give me an avarage unit price per commodity' },
              { value: 'Which trader made the most revenue' },
            ]}
            allowAiAssistantDataSampling
            aiAssistant
            onPrompt={processPrompt}
            showToolbar
            slots={{
              aiAssistantPanel: GridAiAssistantPanel,
              chartsPanel: GridChartsPanel,
            }}
            chartsIntegration
            slotProps={{
              chartsPanel: {
                schema: configurationOptions,
              },
            }}
            experimentalFeatures={{
              charts: true,
            }}
          />
        </div>
        <GridChartsRendererProxy id="main" renderer={CustomRenderer} />
      </div>
    </GridChartsIntegrationContextProvider>
  );
}

function CustomRenderer(props: ChartsRendererProps) {
  // Do not render anything if the dimensions or values are empty
  if (props.dimensions.length === 0 || props.values.length === 0) {
    return null;
  }

  return <ChartsRenderer {...props} />;
}
