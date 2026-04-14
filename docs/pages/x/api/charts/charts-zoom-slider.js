import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsZoomSlider } from './types.charts-zoom-slider';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChartsZoomSlider" allowedProps={allowedProps}>
      <TypesChartsZoomSlider />
    </TypesPageShell>
  );
}
