import * as React from 'react';
import {
  useGridApiContext,
  useGridEvent,
  GridRowParams,
  GridCellParams,
} from '@mui/x-data-grid-pro';

function TestEvents() {
  const apiRef = useGridApiContext();

  // @ts-expect-error Argument of type '(params: GridRowParams) => void' is not assignable to parameter of type 'GridEventListener<'cellClick'>'.
  useGridEvent(apiRef, 'cellClick', (params: GridRowParams) => {});

  // @ts-expect-error Argument of type '(params: GridRowParams) => void' is not assignable to parameter of type 'GridEventListener<'cellClick'>'.
  useGridEvent(apiRef, 'cellClick', (params: GridRowParams) => {});

  useGridEvent(
    apiRef,
    'cellClick',
    // @ts-expect-error Argument of type '(params: GridCellParams, event: React.KeyboardEvent<HTMLEvent>) => void' is not assignable to parameter of type 'GridEventListener<'cellClick'>'.
    (params: GridCellParams, event: React.KeyboardEvent<HTMLElement>) => {},
  );

  useGridEvent(
    apiRef,
    'cellClick',
    // @ts-expect-error Argument of type '(params: GridCellParams, event: React.KeyboardEvent<HTMLEvent>) => void' is not assignable to parameter of type 'GridEventListener<'cellClick'>'.
    (params: GridCellParams, event: React.KeyboardEvent<HTMLElement>) => {},
  );

  const handleCellClickWrongParams = (params: GridRowParams) => {};
  const handleCellClickWrongEvents = (
    params: GridCellParams,
    event: React.KeyboardEvent<HTMLElement>,
  ) => {};

  // @ts-expect-error Argument of type '(params: GridCellParams, event: React.KeyboardEvent<HTMLEvent>) => void' is not assignable to parameter of type 'GridEventListener<'cellClick'>'.
  useGridEvent(apiRef, 'cellClick', handleCellClickWrongParams);

  // @ts-expect-error Argument of type '(params: GridCellParams, event: React.KeyboardEvent<HTMLEvent>) => void' is not assignable to parameter of type 'GridEventListener<'cellClick'>'.
  useGridEvent(apiRef, 'cellClick', handleCellClickWrongParams);

  // @ts-expect-error Argument of type '(params: GridCellParams, event: React.KeyboardEvent<HTMLEvent>) => void' is not assignable to parameter of type 'GridEventListener<'cellClick'>'.
  useGridEvent(apiRef, 'cellClick', handleCellClickWrongEvents);

  // @ts-expect-error Argument of type '(params: GridCellParams, event: React.KeyboardEvent<HTMLEvent>) => void' is not assignable to parameter of type 'GridEventListener<'cellClick'>'.
  useGridEvent(apiRef, 'cellClick', handleCellClickWrongEvents);

  // @ts-expect-error  Argument of type '"cellTripleClick"' is not assignable to parameter of type '"resize" | "debouncedResize" | "unmount" | "cellModeChange" | "cellClick" | "cellDoubleClick" | "cellMouseDown" | "cellMouseUp" | "cellKeyDown" | "cellFocusIn" | ... 49 more'
  useGridEvent(apiRef, 'cellTripleClick', () => {});

  // should work with valid string event name
  useGridEvent(apiRef, 'cellClick', () => {});

  // should work with enum event name
  useGridEvent(apiRef, 'cellClick', () => {});

  return null;
}
