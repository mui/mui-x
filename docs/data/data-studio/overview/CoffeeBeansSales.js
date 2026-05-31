import * as React from 'react';
import { useRouter } from 'next/router';
import Alert from '@mui/material/Alert';
import GlobalStyles from '@mui/material/GlobalStyles';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  extendTheme,
} from '@mui/material/styles';

import {
  DataStudio,
  createDataStudioDataSourcesFromAPI,
  createNextRouterRoutingAdapter,
} from '@mui/x-data-studio';

const demoTheme = extendTheme();

const usdCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const formatUsd = (value) =>
  typeof value === 'number' ? usdCurrency.format(value) : '';

// Per-dataSource map of fields that should render formatted in the grid. The
// server stores raw numbers; this is the "user formats it" half of the
// contract.
const COLUMN_FORMATTERS = {
  products: {
    'Unit Price': formatUsd,
    'Price per 100g': formatUsd,
    Profit: formatUsd,
  },
  orders: {
    'Unit Price': formatUsd,
    Sales: formatUsd,
  },
};

function decorateColumns(dataSourceId, columns) {
  const formatters = COLUMN_FORMATTERS[dataSourceId];
  if (!formatters) {
    return columns;
  }
  return columns.map((column) => {
    if (!(column.field in formatters)) {
      return column;
    }
    return { ...column, valueFormatter: formatters[column.field] };
  });
}

function getErrorMessage(error) {
  if (error instanceof Error) {
    return error.cause instanceof Error ? error.cause.message : error.message;
  }
  return String(error);
}

export default function CoffeeBeansSales() {
  const router = useRouter();
  const routing = React.useMemo(
    () => createNextRouterRoutingAdapter({ router }),
    [router],
  );
  const [dataSources, setDataSources] = React.useState([]);
  const [schemaError, setSchemaError] = React.useState(null);
  const [dataSourceError, setDataSourceError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const handleDataSourceError = React.useCallback((nextError) => {
    setDataSourceError(getErrorMessage(nextError));
  }, []);

  React.useEffect(() => {
    let active = true;
    createDataStudioDataSourcesFromAPI({
      schemaUrl: '/data-studio/coffee-beans/schema',
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
      (nextError) => {
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
            routing={routing}
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
