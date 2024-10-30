import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

function FlexParentNoRowsOverlay() {
  return (
    <div>
      FlexParentNoRowsOverlay
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <DataGrid columns={[{ field: 'id' }]} />
      </div>
    </div>
  );
}

function FlexParentMinHeightNoRowsOverlay() {
  return (
    <div>
      FlexParentMinHeightNoRowsOverlay
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 300 }}>
        <DataGrid columns={[{ field: 'id' }]} />
      </div>
    </div>
  );
}

function FlexParentMaxHeightNoRowsOverlay() {
  return (
    <div>
      FlexParentMaxHeightNoRowsOverlay
      <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 200 }}>
        <DataGrid columns={[{ field: 'id' }]} />
      </div>
    </div>
  );
}

function AutoHeightNoRowsOverlay() {
  return (
    <div>
      AutoHeightNoRowsOverlay
      <div style={{ width: '100%' }}>
        <DataGrid columns={[{ field: 'id' }]} autoHeight />
      </div>
    </div>
  );
}

function AutoHeightLoadingOverlay() {
  return (
    <div>
      AutoHeightLoadingOverlay
      <div style={{ width: '100%' }}>
        <DataGrid columns={[{ field: 'id' }]} rows={[{ id: 1 }]} loading autoHeight />
      </div>
    </div>
  );
}

function PredefinedSizeNoRowsLoadingOverlay() {
  return (
    <div>
      PredefinedSizeNoRowsLoadingOverlay
      <div style={{ width: '100%', height: 300 }}>
        <DataGrid columns={[{ field: 'id' }]} loading />
      </div>
    </div>
  );
}

export default function DataGridFlexParentOverlay() {
  return (
    <div style={{ width: '100%' }}>
      <FlexParentNoRowsOverlay />
      <FlexParentMinHeightNoRowsOverlay />
      <FlexParentMaxHeightNoRowsOverlay />
      <AutoHeightNoRowsOverlay />
      <AutoHeightLoadingOverlay />
      <PredefinedSizeNoRowsLoadingOverlay />
    </div>
  );
}
