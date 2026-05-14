import { getLineDescription } from '../../internals/getLineDescription';
import type { DescriptionGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

const descriptionGetter: DescriptionGetter<'line'> = (params) =>
  getLineDescription({ ...params, categoryAxis: params.xAxis });

export default descriptionGetter;
