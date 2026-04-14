import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesHeatmapSeries } from './types.heatmap-series';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="HeatmapSeries" allowedProps={allowedProps}>
      <TypesHeatmapSeries />
    </TypesPageShell>
  );
}
