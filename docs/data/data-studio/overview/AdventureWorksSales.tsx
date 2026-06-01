import * as React from 'react';
import { useRouter } from 'next/router';
import Alert from '@mui/material/Alert';
import GlobalStyles from '@mui/material/GlobalStyles';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  extendTheme,
} from '@mui/material/styles';
import type { GridColDef } from '@mui/x-data-grid-premium';
import {
  DataStudio,
  createDataStudioDataSourcesFromAPI,
  createNextRouterRoutingAdapter,
  type DataStudioDataSource,
  type DataStudioSheet,
} from '@mui/x-data-studio';
import {
  type ContextRef,
  createStudioCopilotAdapter,
  STUDIO_COPILOT_PLUGINS,
} from 'docs/data/data-studio/overview/studioCopilotBackend';

const demoTheme = extendTheme();

type AdventureWorksRow = Record<string, string | number>;

const usdCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
const percent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatUsd = (value: unknown) =>
  typeof value === 'number' ? usdCurrency.format(value) : '';
const formatPercent = (value: unknown) =>
  typeof value === 'number' ? percent.format(value) : '';

// Per-dataSource map of fields that should render formatted in the grid. The
// server stores raw numbers; this is the "user formats it" half of the
// contract.
const COLUMN_FORMATTERS: Record<
  string,
  Record<string, (value: unknown) => string>
> = {
  product: {
    standard_cost: formatUsd,
    list_price: formatUsd,
  },
  sales: {
    unit_price: formatUsd,
    extended_amount: formatUsd,
    product_standard_cost: formatUsd,
    total_product_cost: formatUsd,
    sales_amount: formatUsd,
    unit_price_discount_pct: formatPercent,
  },
};

function decorateColumns(
  dataSourceId: string,
  columns: readonly GridColDef[],
): GridColDef[] {
  const formatters = COLUMN_FORMATTERS[dataSourceId];
  if (!formatters) {
    return columns as GridColDef[];
  }
  return columns.map((column) => {
    if (!(column.field in formatters)) {
      return column;
    }
    return { ...column, valueFormatter: formatters[column.field] };
  });
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.cause instanceof Error ? error.cause.message : error.message;
  }
  return String(error);
}

export default function AdventureWorksSales() {
  const router = useRouter();
  const routing = React.useMemo(
    () => createNextRouterRoutingAdapter({ router }),
    [router],
  );
  const [dataSources, setDataSources] = React.useState<
    DataStudioDataSource<AdventureWorksRow>[]
  >([]);
  const [schemaError, setSchemaError] = React.useState<string | null>(null);
  const [dataSourceError, setDataSourceError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Track the Studio surface so the Copilot backend can be handed an accurate
  // `studioContext` (active dataSource/view + the user's views).
  const [views, setViews] = React.useState<DataStudioSheet[]>([]);
  const [activeDataSourceId, setActiveDataSourceId] = React.useState<string | null>(
    null,
  );
  const [activeSheetId, setActiveSheetId] = React.useState<string | null>(null);
  const ctxRef = React.useRef<ContextRef>({
    views,
    activeDataSourceId,
    activeSheetId,
    dataSources,
  });
  ctxRef.current = { views, activeDataSourceId, activeSheetId, dataSources };

  const copilotChatAdapter = React.useMemo(
    () =>
      createStudioCopilotAdapter({ ctxRef, storageKey: 'adventure-works-copilot' }),
    [],
  );

  const handleDataSourceError = React.useCallback<
    NonNullable<DataStudioDataSource<AdventureWorksRow>['onDataSourceError']>
  >((nextError) => {
    setDataSourceError(getErrorMessage(nextError));
  }, []);

  React.useEffect(() => {
    let active = true;
    createDataStudioDataSourcesFromAPI<AdventureWorksRow>({
      schemaUrl: '/data-studio/adventure-works/schema',
    }).then(
      (nextDataSources) => {
        if (!active) {
          return;
        }
        setDataSources(
          nextDataSources.map((dataSource) => ({
            ...dataSource,
            columns: decorateColumns(dataSource.id, dataSource.columns),
            onDataSourceError: handleDataSourceError,
          })),
        );
        setSchemaError(null);
        setLoading(false);
      },
      (nextError: Error) => {
        if (active) {
          setSchemaError(nextError.message);
          setLoading(false);
        }
      },
    );
    return () => {
      active = false;
    };
  }, [handleDataSourceError]);

  return (
    <CssVarsProvider theme={demoTheme} defaultMode="system">
      <GlobalStyles
        styles={{
          html: { height: '100%' },
          body: { margin: 0, minHeight: '100%', overflow: 'hidden' },
          '#__next': { minHeight: '100%' },
        }}
      />
      {schemaError === null ? (
        <React.Fragment>
          {dataSourceError === null ? null : (
            <Alert
              severity="error"
              onClose={() => setDataSourceError(null)}
              sx={{
                position: 'fixed',
                top: 16,
                right: 16,
                zIndex: 1300,
                maxWidth: 560,
              }}
            >
              {dataSourceError}
            </Alert>
          )}
          <DataStudio
            plan="premium"
            dataSources={dataSources}
            loading={loading}
            layout="sidebar"
            routing={routing}
            copilotChatAdapter={copilotChatAdapter}
            copilotPlugins={STUDIO_COPILOT_PLUGINS}
            onSheetsChange={setViews}
            onActiveDataSourceChange={setActiveDataSourceId}
            onActiveSheetChange={setActiveSheetId}
            sx={{
              height: '100dvh',
              bgcolor: 'background.paper',
              '& .MuiDataGrid-root': { border: 0 },
              '& .MuiDataGrid-cell': { alignContent: 'center' },
            }}
            slotProps={{
              dataGrid: { density: 'compact' },
            }}
          />
        </React.Fragment>
      ) : (
        <Alert severity="error" sx={{ m: 2 }}>
          {schemaError}
        </Alert>
      )}
    </CssVarsProvider>
  );
}
