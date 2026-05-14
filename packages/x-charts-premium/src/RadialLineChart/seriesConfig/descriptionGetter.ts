import { getLineDescription, type DescriptionGetter } from '@mui/x-charts/internals';

const descriptionGetter: DescriptionGetter<'radialLine'> = (params) =>
  getLineDescription({ ...params, categoryAxis: params.rotationAxis });

export default descriptionGetter;
