import { createTooltipGetter } from '@mui/x-charts/internals';

const tooltipGetter = createTooltipGetter<'radialLine'>({ includeMarkShape: true });

export default tooltipGetter;
