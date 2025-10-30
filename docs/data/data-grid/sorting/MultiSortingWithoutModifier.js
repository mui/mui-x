import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

const initialState = {
  sorting: {
    sortModel: [
      { field: 'rating', sort: 'desc' },
      { field: 'name', sort: 'asc' },
    ],
  },
};

export default function MultiSortingWithoutModifier() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        initialState={initialState}
        multipleColumnsSortingMode="always"
      />
    </div>
  );
}
