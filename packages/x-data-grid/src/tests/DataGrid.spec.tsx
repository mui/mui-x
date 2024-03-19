import * as React from 'react';
import { DataGrid, useGridApiRef, GridCellParams, GridRowParams } from '@mui/x-data-grid';

function PropTest() {
  const apiRef = useGridApiRef();
  return (
    <div>
      <DataGrid rows={[]} columns={[]} />
      <DataGrid rows={[]} columns={[]} pagination />
      {/* @ts-expect-error Type 'false' is not assignable to type 'true | undefined' */}
      <DataGrid pagination={false} />
      {/* @ts-expect-error Type 'GridApiRef' is not assignable to type 'undefined' */}
      <DataGrid apiRef={apiRef} />
      <DataGrid
        rows={[]}
        columns={[]}
        localeText={{
          MuiTablePagination: {
            labelRowsPerPage: 'ofo',
          },
        }}
      />
      <DataGrid
        rows={[]}
        columns={[]}
        localeText={{
          MuiTablePagination: {
            /* @ts-expect-error Object literal may only specify known properties, but 'labelRowsPerPagee' does not exist in type */
            labelRowsPerPagee: 'foo',
          },
        }}
      />
    </div>
  );
}

function SxTest() {
  <DataGrid rows={[]} columns={[]} sx={{ color: 'primary.main' }} />;
}

function CellEditingProps() {
  <DataGrid
    rows={[]}
    columns={[]}
    onCellEditStart={(params: GridCellParams) => {}}
    onCellEditStop={(params: GridCellParams) => {}}
  />;
}

function RowEditingProps() {
  <DataGrid
    rows={[]}
    columns={[]}
    onRowEditStart={(params: GridRowParams) => {}}
    onRowEditStop={(params: GridRowParams) => {}}
  />;
}

function RowPropTest() {
  return (
    <div>
      {/* @ts-expect-error */}
      <DataGrid<{ firstName: string }> rows={[{ firstName: 2 }]} columns={[]} />;
      {/* @ts-expect-error */}
      <DataGrid<{ firstName: string }> rows={[{}]} columns={[]} />;
      <DataGrid<{ firstName: string }> rows={[{ firstName: 'John' }]} columns={[]} />;
      <DataGrid rows={[{ firstName: 'John' }]} columns={[]} />;
    </div>
  );
}

function ColumnPropTest() {
  return (
    <div>
      {/* Wrong column with explicit generic on DataGrid */}
      <DataGrid<{ firstName: string }>
        rows={[]}
        columns={[
          {
            field: 'firstName',
            // @ts-expect-error
            valueGetter: (value, row) => row.lastName,
            // @ts-expect-error
            valueParser: (value, row) => row!.lastName,
            valueSetter: (value, row) => {
              // @ts-expect-error
              const lastName = row.lastName;
              return {} as any;
            },
            // @ts-expect-error
            renderCell: (params) => params.row.lastName,
          },
        ]}
      />
      {/* Valid column with explicit generic on DataGrid */}
      <DataGrid<{ firstName: string }>
        rows={[]}
        columns={[
          {
            field: 'firstName',
            valueGetter: (value, row) => row.firstName,
            valueParser: (value, row) => row!.firstName,
            valueSetter: (value, row) => {
              const firstName = row.firstName;
              return {} as any;
            },
            renderCell: (params) => params.row.firstName,
          },
        ]}
      />
      {/* Wrong column without explicit generic on DataGrid */}
      <DataGrid
        rows={[{ firstName: 'John' }]}
        columns={[
          {
            field: 'firstName',
            // @ts-expect-error
            valueGetter: (value, row) => row.lastName,
            // @ts-expect-error
            valueParser: (value, row) => row!.lastName,
            valueSetter: (value, row) => {
              // @ts-expect-error
              const lastName = row.lastName;
              return {} as any;
            },
            // @ts-expect-error
            renderCell: (params) => params.row.lastName,
          },
        ]}
      />
      {/* Valid column without explicit generic on DataGrid */}
      <DataGrid
        rows={[{ firstName: 'John' }]}
        columns={[
          {
            field: 'firstName',
            valueGetter: (value, row) => row.firstName,
            valueParser: (value, row) => row!.firstName,
            valueSetter: (value, row) => {
              const firstName = row.firstName;
              return {} as any;
            },
            renderCell: (params) => params.row.firstName,
          },
        ]}
      />
    </div>
  );
}

function SingleSelectColDef() {
  return (
    <div>
      <DataGrid<{ country: string }>
        rows={[]}
        columns={[
          {
            field: 'country',
            type: 'string',
            // @ts-expect-error
            valueOptions: ['United Kingdom', 'Spain', 'Brazil'],
          },
          {
            field: 'country',
            type: 'singleSelect',
            valueOptions: ['United Kingdom', 'Spain', 'Brazil'],
          },
          {
            field: 'country',
            type: 'singleSelect',
            valueOptions: [
              { value: 'UK', label: 'United Kingdom' },
              { value: 'ES', label: 'Spain' },
              { value: 'BR', label: 'Brazil' },
            ],
          },
          {
            field: 'country',
            type: 'singleSelect',
            getOptionValue: (value: any) => value.code,
            getOptionLabel: (value: any) => value.label,
            valueOptions: [
              { code: 'UK', name: 'United Kingdom' },
              { code: 'ES', name: 'Spain' },
              { code: 'BR', name: 'Brazil' },
            ],
          },
        ]}
      />
    </div>
  );
}

function ApiRefPrivateMethods() {
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    // @ts-expect-error Property 'updateControlState' does not exist on type 'GridApiCommunity'
    apiRef.current.updateControlState;
    // @ts-expect-error Property 'registerControlState' does not exist on type 'GridApiCommunity'
    apiRef.current.registerControlState;
    // @ts-expect-error Property 'caches' does not exist on type 'GridApiCommunity'
    apiRef.current.caches;
    // @ts-expect-error Property 'eventManager' does not exist on type 'GridApiCommunity'
    apiRef.current.eventManager;
    // @ts-expect-error Property 'registerPipeProcessor' does not exist on type 'GridApiCommunity'
    apiRef.current.registerPipeProcessor;
    // @ts-expect-error Property 'registerPipeApplier' does not exist on type 'GridApiCommunity'
    apiRef.current.registerPipeApplier;
    // @ts-expect-error Property 'requestPipeProcessorsApplication' does not exist on type 'GridApiCommunity'
    apiRef.current.requestPipeProcessorsApplication;
    // @ts-expect-error Property 'registerStrategyProcessor' does not exist on type 'GridApiCommunity'
    apiRef.current.registerStrategyProcessor;
    // @ts-expect-error Property 'setStrategyAvailability' does not exist on type 'GridApiCommunity'
    apiRef.current.setStrategyAvailability;
    // @ts-expect-error Property 'getActiveStrategy' does not exist on type 'GridApiCommunity'
    apiRef.current.getActiveStrategy;
    // @ts-expect-error Property 'applyStrategyProcessor' does not exist on type 'GridApiCommunity'
    apiRef.current.applyStrategyProcessor;
    // @ts-expect-error Property 'storeDetailPanelHeight' does not exist on type 'GridApiCommunity'
    apiRef.current.storeDetailPanelHeight;
    // @ts-expect-error Property 'detailPanelHasAutoHeight' does not exist on type 'GridApiCommunity'
    apiRef.current.detailPanelHasAutoHeight;
    // @ts-expect-error Property 'calculateColSpan' does not exist on type 'GridApiCommunity'
    apiRef.current.calculateColSpan;
    // @ts-expect-error Property 'rowHasAutoHeight' does not exist on type 'GridApiCommunity'
    apiRef.current.rowHasAutoHeight;
    // @ts-expect-error Property 'getLastMeasuredRowIndex' does not exist on type 'GridApiCommunity'
    apiRef.current.getLastMeasuredRowIndex;
    // @ts-expect-error Property 'getViewportPageSize' does not exist on type 'GridApiCommunity'
    apiRef.current.getViewportPageSize;
    // @ts-expect-error Property 'setCellEditingEditCellValue' does not exist on type 'GridApiCommunity'
    apiRef.current.setCellEditingEditCellValue;
    // @ts-expect-error Property 'getRowWithUpdatedValuesFromCellEditing' does not exist on type 'GridApiCommunity'
    apiRef.current.getRowWithUpdatedValuesFromCellEditing;
    // @ts-expect-error Property 'setRowEditingEditCellValue' does not exist on type 'GridApiCommunity'
    apiRef.current.setRowEditingEditCellValue;
    // @ts-expect-error Property 'getRowWithUpdatedValuesFromRowEditing' does not exist on type 'GridApiCommunity'
    apiRef.current.getRowWithUpdatedValuesFromRowEditing;
    // @ts-expect-error Property 'runPendingEditCellValueMutation' does not exist on type 'GridApiCommunity'
    apiRef.current.runPendingEditCellValueMutation;
    // @ts-expect-error Property 'getLogger' does not exist on type 'GridApiCommunity'
    apiRef.current.getLogger;
    // @ts-expect-error Property 'moveFocusToRelativeCell' does not exist on type 'GridApiCommunity'
    apiRef.current.moveFocusToRelativeCell;
    // @ts-expect-error Property 'setColumnGroupHeaderFocus' does not exist on type 'GridApiCommunity'
    apiRef.current.setColumnGroupHeaderFocus;
    // @ts-expect-error Property 'getColumnGroupHeaderFocus' does not exist on type 'GridApiCommunity'
    apiRef.current.getColumnGroupHeaderFocus;
    // @ts-expect-error Property 'setColumnIndex' does not exist on type 'GridApiCommunity'
    apiRef.current.setColumnIndex;
    // @ts-expect-error Property 'setRowIndex' does not exist on type 'GridApiCommunity'
    apiRef.current.setRowIndex;
    // @ts-expect-error Property 'setRowChildrenExpansion' does not exist on type 'GridApiCommunity'
    apiRef.current.setRowChildrenExpansion;
    // @ts-expect-error Property 'getRowGroupChildren' does not exist on type 'GridApiCommunity'
    apiRef.current.getRowGroupChildren;
  });

  return null;
}

function ApiRefPublicMethods() {
  const apiRef = useGridApiRef();

  apiRef.current.unstable_applyPipeProcessors('exportMenu', [], {});
}

function ApiRefProMethods() {
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    // available only in Pro and Premium
    // @ts-expect-error Property 'selectRows' does not exist on type 'GridApiCommunity'
    apiRef.current.selectRows([]);
    // @ts-expect-error Property 'selectRowRange' does not exist on type 'GridApiCommunity'
    apiRef.current.selectRowRange({ startId: 0, endId: 1 });
  });

  return null;
}
