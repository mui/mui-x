import * as React from 'react';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';

function ColumnPropTest() {
  return (
    <div>
      {/* Wrong column with explicit generic on DataGrid */}
      <DataGridPremium<{ firstName: string }>
        rows={[]}
        columns={[
          {
            field: 'firstName',
            // @ts-expect-error
            groupingValueGetter: (params) => params.row.lastName,
          },
        ]}
      />
      {/* Valid column with explicit generic on DataGrid */}
      <DataGridPremium<{ firstName: string }>
        rows={[]}
        columns={[
          {
            field: 'firstName',
            groupingValueGetter: (params) => params.row.firstName,
          },
        ]}
      />
      {/* Wrong column without explicit generic on DataGrid */}
      <DataGridPremium
        rows={[{ firstName: 'John' }]}
        columns={[
          {
            field: 'firstName',
            // @ts-expect-error
            groupingValueGetter: (params) => params.row.lastName,
          },
        ]}
      />
      {/* Valid column without explicit generic on DataGrid */}
      <DataGridPremium
        rows={[{ firstName: 'John' }]}
        columns={[
          {
            field: 'firstName',
            groupingValueGetter: (params) => params.row.firstName,
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
    // @ts-expect-error Property 'detailPanelHasAutoHeight' does not exist on type 'GridApiPremium'
    apiRef.current.detailPanelHasAutoHeight;
    // @ts-expect-error Property 'calculateColSpan' does not exist on type 'GridApiPremium'
    apiRef.current.calculateColSpan;
    // @ts-expect-error Property 'rowHasAutoHeight' does not exist on type 'GridApiPremium'
    apiRef.current.rowHasAutoHeight;
    // @ts-expect-error Property 'getLastMeasuredRowIndex' does not exist on type 'GridApiPremium'
    apiRef.current.getLastMeasuredRowIndex;
    // @ts-expect-error Property 'getViewportPageSize' does not exist on type 'GridApiPremium'
    apiRef.current.getViewportPageSize;
    // @ts-expect-error Property 'updateGridDimensionsRef' does not exist on type 'GridApiPremium'
    apiRef.current.updateGridDimensionsRef;
    // @ts-expect-error Property 'getRenderContext' does not exist on type 'GridApiPremium'
    apiRef.current.getRenderContext;
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
    // available in Pro and Premium
    apiRef.current.selectRows([]);
    apiRef.current.selectRowRange({ startId: 0, endId: 1 });
  });

  return null;
}
