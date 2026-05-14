import { getBarDescription } from '../../../internals/getBarDescription';
import type { DescriptionGetter } from '../../../internals/plugins/corePlugins/useChartSeriesConfig';

const descriptionGetter: DescriptionGetter<'bar'> = (params) => {
  const isHorizontal = params.series.layout === 'horizontal';
  const categoryAxis = isHorizontal ? params.yAxis : params.xAxis;
  return getBarDescription({ ...params, categoryAxis });
};

export default descriptionGetter;
