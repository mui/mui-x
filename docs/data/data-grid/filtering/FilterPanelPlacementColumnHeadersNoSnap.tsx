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

  const [columnHeadersElement, setColumnHeadersElement] =
    React.useState<HTMLElement | null>(null);

  const columnHeadersRef = React.useCallback((instance: HTMLDivElement | null) => {
    setColumnHeadersElement(instance);
  }, []);

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
            target: columnHeadersElement,
          },
        }}
      />
    </div>
  );
}
