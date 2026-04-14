import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesRadarSeriesArea } from './types.radar-series-area';

const allowedProps = ['classes', 'onItemClick', 'seriesId'];

export default function Page() {
  return (
    <TypesPageShell name="RadarSeriesArea" allowedProps={allowedProps}>
      <TypesRadarSeriesArea />
    </TypesPageShell>
  );
}
