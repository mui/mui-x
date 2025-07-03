/* eslint-disable no-promise-executor-return */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-use-before-define */
'use client';

import * as React from 'react';
import { useGridSelector, DataGrid, useGridApiRef, GridApi } from '@mui/x-data-grid';

const testSelector = (apiRef: React.RefObject<GridApi>) => {
  return (apiRef.current.state as unknown as { test: number }).test;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function Cell({ apiRef }: { apiRef: any }) {
  const state = useGridSelector(apiRef, testSelector);

  React.useEffect(() => {
    console.log('mount');
    return () => {
      console.log('unmount');
    };
  }, []);

  return (
    <div style={{ width: 100, height: 100 }} data-testid="useGridSelectorTest">
      {state || 'undefined'}
    </div>
  );
}

export default function Test() {
  const apiRef = useGridApiRef();

  const [mounted, setMounted] = React.useState(0);

  React.useEffect(() => {
    setMounted((prev) => prev + 1);
  }, []);

  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          setMounted((prev) => prev + 1);
          await sleep(500);
          apiRef.current?.setState((prev) => ({
            ...prev,
            test: ((prev as unknown as { test: number }).test || 0) + 1,
          }));
        }}
      >
        Toggle
      </button>
      {apiRef.current?.state && mounted && mounted % 2 === 0 && (
        <Cell apiRef={apiRef} key="field" />
      )}
      <div style={{ width: 200, height: 200 }}>
        <DataGrid apiRef={apiRef} rows={ROWS} columns={COLUMNS} />
      </div>
      {apiRef.current?.state && mounted && mounted % 2 !== 0 && (
        <Cell apiRef={apiRef} key="field" />
      )}
    </div>
  );
}

const ROWS: any[] = [];
const COLUMNS: any[] = [];
