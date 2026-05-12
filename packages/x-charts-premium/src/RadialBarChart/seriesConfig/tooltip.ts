import { createTooltipGetter } from '@mui/x-charts/internals';

const tooltipGetter = createTooltipGetter<'radialBar'>({ skipNullValues: true });

export default tooltipGetter;
