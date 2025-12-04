import { PiecewiseLabelFormatterParams } from './piecewiseColorLegend.types';

export function piecewiseColorDefaultLabelFormatter(params: PiecewiseLabelFormatterParams) {
  if (params.min === null) {
    return `<${params.formattedMax}`;
  }
  if (params.max === null) {
    return `>${params.formattedMin}`;
  }
  return `${params.formattedMin}-${params.formattedMax}`;
}
