import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ColumnSelectorGridToggleAllMode() {
  // @focus-start @padding 1
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        showToolbar
        slotProps={{
          columnsManagement: {
            toggleAllMode: 'filteredOnly',
          },
        }}
      />
    </div>
  );
  // @focus-end
}
