import * as React from "react";
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
  const gridStateKey = "testDataGridState";

  const [initialGridState, setInitialGridState] = React.useState<GridInitialState>();

  const saveSnapshot = React.useCallback(() => {
    if (apiRef?.current?.exportState && localStorage) {
      const currentState = apiRef.current.exportState();
      localStorage.setItem(gridStateKey, JSON.stringify(currentState));
    }
  }, [apiRef]);

  React.useLayoutEffect(() => {
    const stateFromLocalStorage = localStorage?.getItem(gridStateKey);
    setInitialGridState(
      stateFromLocalStorage ? JSON.parse(stateFromLocalStorage) : {}
    );

    // handle refresh and navigating away/refreshing
    window.addEventListener("beforeunload", saveSnapshot);

    return () => {
      // in case of an SPA remove the event-listener
      window.removeEventListener("beforeunload", saveSnapshot);
      saveSnapshot();
    };
  }, [saveSnapshot]);

  const questions = [{ fieldId: 1, fieldName: "Do you like pizza?" }];

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "name",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "questionIds",
      headerName: "questions",
      minWidth: 150,
      flex: 1,
      valueGetter: (_, row: RowType) => {
        console.log("row", row);
        // Extract fieldNames from all questions based on the questionIds in the row
        const questionNames = questions
          .filter((question) => row.questionIds.includes(question.fieldId))
          .map((question) => question.fieldName)
          .join(", ");
        return questionNames ?? "";
      },
      groupable: false,
    },
  ];

  const rows = [{ id: 1, name: "Group 1", questionIds: [] }];

  if (!initialGridState) {
    return null;
  }

  return (
    <div className="App">
      <ErrorBoundary
        fallback={(error, { resetError }) => (
          <div role="alert" style={{ padding: 16 }}>
            <h3>Something went wrong</h3>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {String(error.stack || error.message)}
            </pre>
            <Button
              onClick={() => {
                setInitialGridState({});
                localStorage.removeItem(gridStateKey);
                resetError();
              }}
            >
              Reset grid state
            </Button>
          </div>
        )}
        onError={(error) => {
          console.error("onError", error);
        }}
      >
        <DataGridPremium
          apiRef={apiRef}
          initialState={initialGridState}
          columns={columns}
          rows={rows}
          getRowId={(row) => row.id}
        />
      </ErrorBoundary>
    </div>
  );
}
