import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ClipboardPasteDisabled() {
  // @focus-start @padding 1
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 6,
    editable: true,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium {...data} disableClipboardPaste />
    </div>
  );
  // @focus-end
}
