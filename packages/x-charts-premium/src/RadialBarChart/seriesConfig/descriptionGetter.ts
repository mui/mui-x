import { getBarDescription, type DescriptionGetter } from '@mui/x-charts/internals';

const descriptionGetter: DescriptionGetter<'radialBar'> = (params) =>
  getBarDescription({ ...params, categoryAxis: params.rotationAxis });

export default descriptionGetter;
