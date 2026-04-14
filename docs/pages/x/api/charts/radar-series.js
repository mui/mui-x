import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesRadarSeries } from './types.radar-series';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="RadarSeries" allowedProps={allowedProps}>
      <TypesRadarSeries />
    </TypesPageShell>
  );
}
