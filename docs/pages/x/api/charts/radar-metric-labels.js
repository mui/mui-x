import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesRadarMetricLabels } from './types.radar-metric-labels';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="RadarMetricLabels" allowedProps={allowedProps}>
      <TypesRadarMetricLabels />
    </TypesPageShell>
  );
}
