import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesRadarAxis } from './types.radar-axis';

const allowedProps = ['angle', 'classes', 'divisions', 'dominantBaseline', 'labelOrientation', 'metric', 'textAnchor'];

export default function Page() {
  return (
    <TypesPageShell name="RadarAxis" allowedProps={allowedProps}>
      <TypesRadarAxis />
    </TypesPageShell>
  );
}
