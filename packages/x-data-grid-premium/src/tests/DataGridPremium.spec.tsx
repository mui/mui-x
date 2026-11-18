import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import type {
  GridApiPremium,
  GridComputedColDefOverrides,
  GridComputedColumnDefinition,
} from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';
import type { Expect, Equal } from 'test/utils/typeUtils';

function ColumnPropTest() {
  return (
    <div>
      {/* Wrong column with explicit generic on DataGrid */}
      <DataGridPremium<{ firstName: string }>
        rows={[]}
        columns={[
          {
            field: 'firstName',
            // @ts-expect-error The inferred row model has firstName, but no lastName property.
            groupingValueGetter: (value, row) => row.lastName,
          },
        ]}
      />
      {/* Valid column with explicit generic on DataGrid */}
      <DataGridPremium<{ firstName: string }>
        rows={[]}
        columns={[
          {
            field: 'firstName',
            groupingValueGetter: (value, row) => row.firstName,
          },
        ]}
      />
      {/* Wrong column without explicit generic on DataGrid */}
      <DataGridPremium
        rows={[{ firstName: 'John' }]}
        columns={[
          {
            field: 'firstName',
            // @ts-expect-error The explicitly typed row model has firstName, but no lastName property.
            groupingValueGetter: (value, row) => row.lastName,
          },
        ]}
      />
      {/* Valid column without explicit generic on DataGrid */}
      <DataGridPremium
        rows={[{ firstName: 'John' }]}
        columns={[
          {
            field: 'firstName',
            groupingValueGetter: (value, row) => row.firstName,
          },
        ]}
      />
    </div>
  );
}

function ApiRefPrivateMethods() {
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    // @ts-expect-error Property 'updateControlState' does not exist on type 'GridApiPremium'
    apiRef.current.updateControlState;
    // @ts-expect-error Property 'registerControlState' does not exist on type 'GridApiPremium'
    apiRef.current.registerControlState;
    // @ts-expect-error Property 'caches' does not exist on type 'GridApiPremium'
    apiRef.current.caches;
    // @ts-expect-error Property 'eventManager' does not exist on type 'GridApiPremium'
    apiRef.current.eventManager;
    // @ts-expect-error Property 'registerPipeProcessor' does not exist on type 'GridApiPremium'
    apiRef.current.registerPipeProcessor;
    // @ts-expect-error Property 'registerPipeApplier' does not exist on type 'GridApiPremium'
    apiRef.current.registerPipeApplier;
    // @ts-expect-error Property 'requestPipeProcessorsApplication' does not exist on type 'GridApiPremium'
    apiRef.current.requestPipeProcessorsApplication;
    // @ts-expect-error Property 'registerStrategyProcessor' does not exist on type 'GridApiPremium'
    apiRef.current.registerStrategyProcessor;
    // @ts-expect-error Property 'setStrategyAvailability' does not exist on type 'GridApiPremium'
    apiRef.current.setStrategyAvailability;
    // @ts-expect-error Property 'getActiveStrategy' does not exist on type 'GridApiPremium'
    apiRef.current.getActiveStrategy;
    // @ts-expect-error Property 'applyStrategyProcessor' does not exist on type 'GridApiPremium'
    apiRef.current.applyStrategyProcessor;
    // @ts-expect-error Property 'storeDetailPanelHeight' does not exist on type 'GridApiPremium'
    apiRef.current.storeDetailPanelHeight;
    // @ts-expect-error Property 'calculateColSpan' does not exist on type 'GridApiPremium'
    apiRef.current.calculateColSpan;
    // @ts-expect-error Property 'rowHasAutoHeight' does not exist on type 'GridApiPremium'
    apiRef.current.rowHasAutoHeight;
    // @ts-expect-error Property 'getLastMeasuredRowIndex' does not exist on type 'GridApiPremium'
    apiRef.current.getLastMeasuredRowIndex;
    // @ts-expect-error Property 'getViewportPageSize' does not exist on type 'GridApiPremium'
    apiRef.current.getViewportPageSize;
    // @ts-expect-error Property 'setCellEditingEditCellValue' does not exist on type 'GridApiPremium'
    apiRef.current.setCellEditingEditCellValue;
    // @ts-expect-error Property 'getRowWithUpdatedValuesFromCellEditing' does not exist on type 'GridApiPremium'
    apiRef.current.getRowWithUpdatedValuesFromCellEditing;
    // @ts-expect-error Property 'setRowEditingEditCellValue' does not exist on type 'GridApiPremium'
    apiRef.current.setRowEditingEditCellValue;
    // @ts-expect-error Property 'getRowWithUpdatedValuesFromRowEditing' does not exist on type 'GridApiPremium'
    apiRef.current.getRowWithUpdatedValuesFromRowEditing;
    // @ts-expect-error Property 'runPendingEditCellValueMutation' does not exist on type 'GridApiPremium'
    apiRef.current.runPendingEditCellValueMutation;
    // @ts-expect-error Property 'getLogger' does not exist on type 'GridApiPremium'
    apiRef.current.getLogger;
    // @ts-expect-error Property 'moveFocusToRelativeCell' does not exist on type 'GridApiPremium'
    apiRef.current.moveFocusToRelativeCell;
    // @ts-expect-error Property 'setColumnGroupHeaderFocus' does not exist on type 'GridApiPremium'
    apiRef.current.setColumnGroupHeaderFocus;
    // @ts-expect-error Property 'getColumnGroupHeaderFocus' does not exist on type 'GridApiPremium'
    apiRef.current.getColumnGroupHeaderFocus;
  });

  return null;
}

function ApiRefPublicMethods() {
  const apiRef = useGridApiRef();

  apiRef.current!.unstable_applyPipeProcessors('exportMenu', [], {});
}

function CallbackDetailsApiRef() {
  return (
    <DataGridPremium
      rows={[]}
      columns={[]}
      onRowGroupingModelChange={(model, details) => {
        // @ts-expect-error `current` is read-only on the details' apiRef
        details.apiRef.current = null;
      }}
      onCellModesModelChange={(model, details) => {
        // The editing hook path must expose a Premium-typed apiRef.
        const premiumApiRef: RefObject<GridApiPremium> = details.apiRef;
      }}
    />
  );
}

function ApiRefProMethods() {
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    // available in Pro and Premium
    apiRef.current!.selectRows([]);
    apiRef.current!.selectRowRange({ startId: 0, endId: 1 });
    apiRef.current!.setColumnIndex;
    apiRef.current!.setRowIndex;
    apiRef.current!.setRowChildrenExpansion;
    apiRef.current!.getRowGroupChildren;
  });

  return null;
}

function FormulaFeatureInjectionTest() {
  return (
    <div>
      {/* The formula feature object from the `/formula` entry point fits the prop */}
      <DataGridPremium rows={[]} columns={[]} featureDependencies={{ formula: formulaFeature }} />
      {/* No feature dependencies at all is valid */}
      <DataGridPremium rows={[]} columns={[]} featureDependencies={{}} />
      {/* An arbitrary object is not a formula feature */}
      {/* @ts-expect-error An arbitrary object does not implement the formula feature interface. */}
      <DataGridPremium rows={[]} columns={[]} featureDependencies={{ formula: {} }} />
    </div>
  );
}

// The properties set by the grid on a computed column, and the ones only called for editable cells.
type ComputedColDefOwnProperty =
  | 'field'
  | 'type'
  | 'computed'
  | 'editable'
  | 'allowFormulas'
  | 'valueGetter'
  | 'valueSetter'
  | 'groupingValueGetter'
  | 'rowSpanValueGetter'
  | 'renderEditCell'
  | 'preProcessEditCellProps'
  | 'pastedValueParser';

type ComputedColDefTests = [
  Expect<Equal<GridComputedColDefOverrides[ComputedColDefOwnProperty], undefined>>,
];

function ComputedColDefTest() {
  const overrides: GridComputedColDefOverrides = {
    width: 120,
    headerAlign: 'center',
    cellClassName: 'total',
    headerClassName: 'total-header',
    // Parses the filter values.
    valueParser: (value: string) => Number(value) / 100,
  };
  const editableOverrides = { width: 120, editable: true };
  const getOverrides = (definition: GridComputedColumnDefinition) => ({
    width: 120,
    renderEditCell: () => definition.field,
  });
  return (
    <div>
      {/* The properties the grid applies to a computed column */}
      <DataGridPremium rows={[]} columns={[]} computedColDef={overrides} />
      <DataGridPremium
        rows={[]}
        columns={[]}
        computedColDef={(definition) => ({
          width: definition.type === 'number' ? 120 : 180,
          valueFormatter: (value: number) => value.toFixed(2),
        })}
      />
      {/* The properties that make it a computed column, and the cell editing ones, in every form */}
      <DataGridPremium
        rows={[]}
        columns={[]}
        // @ts-expect-error The grid sets the getters of a computed column.
        computedColDef={{ width: 120, valueGetter: () => 1 }}
      />
      <DataGridPremium
        rows={[]}
        columns={[]}
        // @ts-expect-error The cells of a computed column are never editable.
        computedColDef={(definition) => ({ width: 120, editable: definition.type === 'number' })}
      />
      {/* @ts-expect-error The cells of a computed column are never editable. */}
      <DataGridPremium rows={[]} columns={[]} computedColDef={editableOverrides} />
      {/* @ts-expect-error The cells of a computed column are never edited. */}
      <DataGridPremium rows={[]} columns={[]} computedColDef={getOverrides} />
      {/* The properties of the column types a computed column never has */}
      <DataGridPremium
        rows={[]}
        columns={[]}
        // @ts-expect-error A computed column is never a `singleSelect` one.
        computedColDef={{ width: 120, valueOptions: ['a'] }}
      />
      <DataGridPremium
        rows={[]}
        columns={[]}
        // @ts-expect-error A computed column is never an `actions` one.
        computedColDef={{ width: 120, getActions: () => [] }}
      />
    </div>
  );
}
