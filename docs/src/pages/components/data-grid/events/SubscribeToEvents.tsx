import * as React from 'react';
import { XGrid, useGridApiRef } from '@material-ui/x-grid';
import Alert from '@material-ui/lab/Alert';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export default function SubscribeToEvents() {
  const apiRef = useGridApiRef();
  const [message, setMessage] = React.useState('');
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 1,
    maxColumns: 6,
  });

  React.useEffect(() => {
    return apiRef.current.subscribeEvent('columnResize', (params) => {
      setMessage(
        `Column ${params.colDef.headerName} resized to ${params.computedWidth}px.`,
      );
    });
  }, [apiRef]);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 180, width: '100%' }}>
        <XGrid apiRef={apiRef} {...data} />
      </div>
      {message && (
        <Alert severity="info" style={{ marginTop: 8 }}>
          {message}
        </Alert>
      )}
    </div>
  );
}
