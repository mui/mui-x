import { getLineLikeTooltip, type TooltipGetter } from '@mui/x-charts/internals';

const tooltipGetter: TooltipGetter<'radialLine'> = (params) =>
  getLineLikeTooltip(params, { includeMarkShape: true });

export default tooltipGetter;
