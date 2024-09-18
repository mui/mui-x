import { useDrawingArea } from '../../hooks/useDrawingArea';
import { useRotationScale } from '../../hooks/useScale';
import { useRadarSeries } from '../../hooks/useSeries';
import { usePolarContext } from '../../context/PolarProvider';
import { useHighlighted } from '../../context/HighlightedProvider';

export function useRadarCoordinates() {
  const rotationScale = useRotationScale<'point'>();
  const { radiusAxis } = usePolarContext();
  const radarSeries = useRadarSeries();

  const drawingArea = useDrawingArea();
  const highlighted = useHighlighted();

  const cx = drawingArea.left + drawingArea.width / 2;
  const cy = drawingArea.top + drawingArea.height / 2;

  const metrics = rotationScale.domain() as string[]; // The metrics only take string for radar.
  const angles = metrics.map((key) => rotationScale(key)!);
  const scales = metrics.map((key) => radiusAxis[key]!.scale);

  return {
    cx,
    cy,
    seriesCoordinates: radarSeries?.seriesOrder.map((seriesId) => {
      const isSeriesHighlighted = highlighted.isHighlighted({ seriesId });
      const isSeriesFaded = !isSeriesHighlighted && highlighted.isFaded({ seriesId });

      return {
        ...radarSeries.series[seriesId],
        seriesId,
        isSeriesHighlighted,
        isSeriesFaded,
        points: radarSeries.series[seriesId].data.map((value, dataIndex) => {
          const isItemHighlighted = highlighted.isHighlighted({ seriesId, dataIndex });
          const isItemFaded = !isItemHighlighted && highlighted.isFaded({ seriesId, dataIndex });

          const r = scales[dataIndex](value)!;
          const angle = angles[dataIndex];
          return {
            x: cx - r * Math.sin(angle),
            y: cy - r * Math.cos(angle),
            isItemHighlighted,
            isItemFaded,
            dataIndex,
          };
        }),
      };
    }),
  };
}
