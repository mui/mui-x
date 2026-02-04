import type { SeriesId } from '../../models';
import type { PieSeriesLayout } from '../../models/seriesType/pie';
import type { SeriesLayoutGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import { getPercentageValue } from '../../internals/getPercentageValue';
import { getPieCoordinates } from '../getPieCoordinates';

const seriesLayout: SeriesLayoutGetter<'pie'> = (series, drawingArea) => {
  const seriesLayoutRecord: Record<SeriesId, PieSeriesLayout> = {};

  for (const seriesId of series.seriesOrder) {
    const {
      innerRadius,
      outerRadius,
      arcLabelRadius,
      cx: cxParam,
      cy: cyParam,
    } = series.series[seriesId];

    const { cx, cy, availableRadius } = getPieCoordinates(
      { cx: cxParam, cy: cyParam },
      { width: drawingArea.width, height: drawingArea.height },
    );

    const outer = getPercentageValue(outerRadius ?? availableRadius, availableRadius);
    const inner = getPercentageValue(innerRadius ?? 0, availableRadius);
    const label =
      arcLabelRadius === undefined
        ? (inner + outer) / 2
        : getPercentageValue(arcLabelRadius, availableRadius);

    seriesLayoutRecord[seriesId] = {
      radius: {
        available: availableRadius,
        inner,
        outer,
        label,
      },
      center: {
        x: drawingArea.left + cx,
        y: drawingArea.top + cy,
      },
    };
  }
  return seriesLayoutRecord;
};

export default seriesLayout;
