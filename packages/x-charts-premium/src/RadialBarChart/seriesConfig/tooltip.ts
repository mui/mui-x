import { getLineLikeTooltip, type TooltipGetter } from '@mui/x-charts/internals';

const tooltipGetter: TooltipGetter<'radialBar'> = (params) =>
  getLineLikeTooltip(params, { skipNullValues: true });

export default tooltipGetter;
