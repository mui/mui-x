import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon';
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

function BlueAiAssistantIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} color="primary">
      <path d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-5.12 10.88L12 17l-1.88-4.12L6 11l4.12-1.88L12 5l1.88 4.12L18 11z" />
    </SvgIcon>
  );
}

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
    multiSelect: true,
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
              {
                value:
                  'Visualize the unit price averages per status for each commodity',
              },
              {
                value:
                  'Show the total revenue trends per maturity quarter for each commodity',
              },
            ]}
            allowAiAssistantDataSampling
            aiAssistant
            onPrompt={processPrompt}
            showToolbar
            slots={{
              aiAssistantPanel: GridAiAssistantPanel,
              aiAssistantIcon: BlueAiAssistantIcon,
              chartsPanel: GridChartsPanel,
            }}
            chartsIntegration
            slotProps={{
              chartsPanel: {
                schema: configurationOptions,
              },
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
