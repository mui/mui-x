import * as React from 'react';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function ClipboardCopy() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 12,
  });

  const [copiedData, setCopiedData] = React.useState('');

  const apiRef = useGridApiRef();

  React.useEffect(() => {
    return apiRef.current.subscribeEvent('clipboardCopy', (copiedString) => {
      setCopiedData(copiedString);
    });
  }, [apiRef]);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 400 }}>
        <DataGridPremium
          apiRef={apiRef}
          {...data}
          checkboxSelection
          unstable_cellSelection
        />
      </div>
      <Alert severity="info" sx={{ width: '100%', mt: 1 }}>
        <AlertTitle>Copied data:</AlertTitle>
        <code
          style={{
            display: 'block',
            maxHeight: 200,
            overflow: 'auto',
            whiteSpace: 'pre-line',
          }}
        >
          {copiedData}
        </code>
      </Alert>
    </div>
  );
}
