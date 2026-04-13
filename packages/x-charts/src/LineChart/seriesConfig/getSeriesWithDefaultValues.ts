import type { GetSeriesWithDefaultValues } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

type Params<T extends 'line' | 'radial-line'> = Parameters<GetSeriesWithDefaultValues<T>>;
type Result<T extends 'line' | 'radial-line'> = ReturnType<GetSeriesWithDefaultValues<T>>;

function getSeriesWithDefaultValues(...args: Params<'line'>): Result<'line'>;
function getSeriesWithDefaultValues(...args: Params<'radial-line'>): Result<'radial-line'>;
function getSeriesWithDefaultValues(
  seriesData: Params<'line' | 'radial-line'>[0],
  seriesIndex: number,
  colors: readonly string[],
): Result<'line' | 'radial-line'> {
  return {
    ...seriesData,
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    color: seriesData.color ?? colors[seriesIndex % colors.length],
  } as Result<'line' | 'radial-line'>;
}

export default getSeriesWithDefaultValues;
