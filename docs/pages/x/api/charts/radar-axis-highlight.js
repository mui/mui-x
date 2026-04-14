import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesRadarAxisHighlight } from './types.radar-axis-highlight';

const allowedProps = ['classes'];

export default function Page() {
  return (
    <TypesPageShell name="RadarAxisHighlight" allowedProps={allowedProps}>
      <TypesRadarAxisHighlight />
    </TypesPageShell>
  );
}
