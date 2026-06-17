import { type SeriesId } from '../../models/seriesType/common';
import { type MarkerLabelFunction, type ScatterValueType } from '../../models/seriesType/scatter';

export function getMarkerLabel(options: {
  markerLabel: 'label' | MarkerLabelFunction;
  value: ScatterValueType;
  dataIndex: number;
  seriesId: SeriesId;
  markerSize: number;
}): string | null | undefined {
  const { markerLabel, value, dataIndex, seriesId, markerSize } = options;

  if (markerLabel === 'label') {
    return value.label;
  }

  return markerLabel({ seriesId, dataIndex, value, size: markerSize });
}
