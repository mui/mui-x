import { useSetupPan } from './useSetupPan';
import { useSetupZoom } from './useSetupZoom';

/**
 * Sets up the zoom functionality if using composition or a custom chart.
 *
 * Simply add this component at the same level as the chart component to enable zooming and panning.
 *
 * See: [Composition](https://mui.com/x/react-charts/composition/)
 */
function ZoomSetup() {
  useSetupZoom();
  useSetupPan();
  return null;
}

export { ZoomSetup };
