import * as React from 'react';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import type { GridColDef, GridInitialState } from '@mui/x-data-grid-premium';
import Button from '@mui/material/Button';
import { ErrorBoundary } from './ErrorBoundary';

interface RowType {
  id: number;
  questionIds: number[];
}

export default function SecureInitialState() {
  const apiRef = useGridApiRef();
  const gridStateKey = 'testDataGridState';

  const [initialGridState, setInitialGridState] = React.useState<GridInitialState>();

  const saveSnapshot = React.useCallback(() => {
    if (apiRef?.current?.exportState && localStorage) {
      const currentState = apiRef.current.exportState();
      localStorage.setItem(gridStateKey, JSON.stringify(currentState));
    }
  }, [apiRef]);

  const errorFallback = React.useCallback(
    (error: Error, { resetError }: { resetError: () => void }) => (
      <div
        role="alert"
        style={{
          padding: 16,
          height: '100%',
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fafafa',
          borderRadius: 4,
          border: '1px dashed #d0d0d0',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
        <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>Oops! Grid Under Construction</h3>
        <p style={{ color: '#666', margin: '0 0 16px 0', textAlign: 'center' }}>
          Looks like our data hit a roadblock. Let's get things back on track!
        </p>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxWidth: '600px',
            maxHeight: '200px',
            overflow: 'auto',
            padding: '8px 12px',
            backgroundColor: '#fff',
            borderRadius: 4,
            fontSize: '0.875rem',
            margin: '16px 0',
            border: '1px solid #e3e3e3',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
            fontFamily: 'monospace',
          }}
        >
          {String(error.message || 'An error occurred')}
          {error.stack && `\n\nStack trace:\n${error.stack.split('\n').slice(0, 10).join('\n')}${error.stack.split('\n').length > 10 ? '\n...' : ''}`}
        </pre>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setInitialGridState({});
            localStorage.removeItem(gridStateKey);
            resetError();
          }}
          style={{ textTransform: 'none' }}
        >
          🔧 Rebuild Grid State
        </Button>
      </div>
    ),
    [],
  );

  React.useLayoutEffect(() => {
    const stateFromLocalStorage = localStorage?.getItem(gridStateKey);
    setInitialGridState(
      stateFromLocalStorage ? JSON.parse(stateFromLocalStorage) : {},
    );

    // handle refresh and navigating away/refreshing
    window.addEventListener('beforeunload', saveSnapshot);

    return () => {
      // in case of an SPA remove the event-listener
      window.removeEventListener('beforeunload', saveSnapshot);
      saveSnapshot();
    };
  }, [saveSnapshot]);

  const questions = [{ fieldId: 1, fieldName: 'Do you like pizza?' }];

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'name',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'questionIds',
      headerName: 'questions',
      minWidth: 150,
      flex: 1,
      valueGetter: (_, row: RowType) => {
        console.log('row', row);
        // Extract fieldNames from all questions based on the questionIds in the row
        const questionNames = questions
          .filter((question) => row.questionIds.includes(question.fieldId))
          .map((question) => question.fieldName)
          .join(', ');
        return questionNames ?? '';
      },
      groupable: false,
    },
  ];

  const rows = [{ id: 1, name: 'Group 1', questionIds: [] }];

  if (!initialGridState) {
    return null;
  }

  return (
    <div className="App" style={{ height: 400, width: '100%' }}>
      <ErrorBoundary
        fallback={errorFallback}
        onError={(error) => {
          console.error('onError', error);
        }}
      >
        <DataGridPremium
          apiRef={apiRef}
          initialState={initialGridState}
          columns={columns}
          rows={rows}
          getRowId={(row) => row.id}
          sx={{ height: '100%' }}
        />
      </ErrorBoundary>
    </div>
  );
}
