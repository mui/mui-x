import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesRadarSeriesMarks } from './types.radar-series-marks';

const allowedProps = ['classes', 'onItemClick', 'seriesId'];

export default function Page() {
  return (
    <TypesPageShell name="RadarSeriesMarks" allowedProps={allowedProps}>
      <TypesRadarSeriesMarks />
    </TypesPageShell>
  );
}
