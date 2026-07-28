import { getLineLikeTooltip } from '@mui/x-charts/internals';
import type { TooltipGetter } from '@mui/x-charts/internals';

const tooltipGetter: TooltipGetter<'radialLine'> = (params) =>
  getLineLikeTooltip(params, { includeMarkShape: true });

export default tooltipGetter;
