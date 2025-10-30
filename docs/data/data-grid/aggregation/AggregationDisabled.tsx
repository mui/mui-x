import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

export default function AggregationDisabled() {
  const data = useMovieData();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        disableAggregation
        initialState={{ aggregation: { model: { gross: 'sum' } } }}
      />
    </div>
  );
}
