/* eslint-disable react/prop-types */
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

function FlexParent({ children, style }) {
  return <div style={{ display: 'flex', flexDirection: 'column', ...style }}>{children}</div>;
}

function FlexParentNoRowsOverlay() {
  return (
    <div>
      FlexParentNoRowsOverlay
      <FlexParent>
        <DataGrid columns={[{ field: 'id' }]} />
      </FlexParent>
    </div>
  );
}

function FlexParentMinHeightNoRowsOverlay() {
  return (
    <div>
      FlexParentMinHeightNoRowsOverlay
      <FlexParent style={{ minHeight: 300 }}>
        <DataGrid columns={[{ field: 'id' }]} />
      </FlexParent>
    </div>
  );
}

function FlexParentMaxHeightNoRowsOverlay() {
  return (
    <div>
      FlexParentMaxHeightNoRowsOverlay
      <FlexParent style={{ maxHeight: 200 }}>
        <DataGrid columns={[{ field: 'id' }]} />
      </FlexParent>
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

function FlexParentSkeletonOverlay() {
  return (
    <div>
      FlexParentSkeletonOverlay
      <FlexParent>
        <DataGrid
          columns={[{ field: 'id' }]}
          slotProps={{ loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' } }}
          loading
        />
      </FlexParent>
    </div>
  );
}

function FlexParentMinHeightSkeletonOverlay() {
  return (
    <div>
      FlexParentMinHeightSkeletonOverlay
      <FlexParent style={{ minHeight: 300 }}>
        <DataGrid
          columns={[{ field: 'id' }]}
          slotProps={{ loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' } }}
          loading
        />
      </FlexParent>
    </div>
  );
}

function FlexParentMaxHeightSkeletonOverlay() {
  return (
    <div>
      FlexParentMaxHeightSkeletonOverlay
      <FlexParent style={{ maxHeight: 200 }}>
        <DataGrid
          columns={[{ field: 'id' }]}
          slotProps={{ loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' } }}
          loading
        />
      </FlexParent>
    </div>
  );
}

function AutoHeightSkeletonOverlay() {
  return (
    <div>
      AutoHeightSkeletonOverlay
      <div style={{ width: '100%' }}>
        <DataGrid
          columns={[{ field: 'id' }]}
          autoHeight
          slotProps={{ loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' } }}
          loading
        />
      </div>
    </div>
  );
}

function PredefinedSizeSkeletonOverlay() {
  return (
    <div>
      PredefinedSizeSkeletonOverlay
      <div style={{ width: '100%', height: 300 }}>
        <DataGrid
          columns={[{ field: 'id' }]}
          loading
          slotProps={{ loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' } }}
        />
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

      <FlexParentSkeletonOverlay />
      <FlexParentMinHeightSkeletonOverlay />
      <FlexParentMaxHeightSkeletonOverlay />
      <AutoHeightSkeletonOverlay />
      <PredefinedSizeSkeletonOverlay />
    </div>
  );
}
