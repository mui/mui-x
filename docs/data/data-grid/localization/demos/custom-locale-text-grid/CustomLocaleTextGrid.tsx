import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function CustomLocaleTextGrid() {
  // @focus-start @padding 1
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 4,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        localeText={{
          toolbarQuickFilterPlaceholder: 'Search commodities',
        }}
        showToolbar
      />
    </div>
  );
  // @focus-end
}
