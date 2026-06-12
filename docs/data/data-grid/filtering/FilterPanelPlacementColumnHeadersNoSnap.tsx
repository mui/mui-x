import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function FilterPanelPlacementColumnHeadersNoSnap() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const columnHeadersRef = React.useRef<HTMLDivElement>(null);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        showToolbar
        slotProps={{
          columnHeaders: {
            ref: columnHeadersRef,
          },
          panel: {
            placement: 'bottom-start',
            target: columnHeadersRef.current,
          },
        }}
      />
    </div>
  );
}
