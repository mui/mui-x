import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesRadarGrid } from './types.radar-grid';

const allowedProps = ['classes', 'divisions', 'shape', 'stripeColor'];

export default function Page() {
  return (
    <TypesPageShell name="RadarGrid" allowedProps={allowedProps}>
      <TypesRadarGrid />
    </TypesPageShell>
  );
}
