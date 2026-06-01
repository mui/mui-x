import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function FilterPanelPlacementColumnHeaders() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const columnHeadersRef = React.useRef(null);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
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
