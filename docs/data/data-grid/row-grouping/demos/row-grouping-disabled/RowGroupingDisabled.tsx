import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

export default function RowGroupingDisabled() {
  // @focus-start @padding 1
  const data = useMovieData();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium {...data} disableRowGrouping />
    </div>
  );
  // @focus-end
}
