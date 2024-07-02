import { useSetupPan } from './useSetupPan';
import { useSetupZoom } from './useSetupZoom';

function ZoomSetup() {
  useSetupZoom();
  useSetupPan();
  return null;
}

export { ZoomSetup };
