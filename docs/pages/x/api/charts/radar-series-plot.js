import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesRadarSeriesPlot } from './types.radar-series-plot';

const allowedProps = ['classes', 'onAreaClick', 'onMarkClick', 'seriesId'];

export default function Page() {
  return (
    <TypesPageShell name="RadarSeriesPlot" allowedProps={allowedProps}>
      <TypesRadarSeriesPlot />
    </TypesPageShell>
  );
}
