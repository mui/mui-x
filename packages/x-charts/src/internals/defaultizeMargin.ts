import type {
  ChartMargin,
  UseChartDimensionsParameters,
} from './plugins/corePlugins/useChartDimensions/useChartDimensions.types';

export function defaultizeMargin(
  input: UseChartDimensionsParameters['margin'],
  defaultMargin: ChartMargin,
): ChartMargin;
export function defaultizeMargin(
  input: UseChartDimensionsParameters['margin'],
  defaultMargin?: ChartMargin,
): Partial<ChartMargin> | undefined;
export function defaultizeMargin(
  input: UseChartDimensionsParameters['margin'],
  defaultMargin?: ChartMargin,
): Partial<ChartMargin> | undefined {
  if (typeof input === 'number') {
    return {
      top: input,
      bottom: input,
      left: input,
      right: input,
    };
  }

  if (defaultMargin) {
    return {
      ...defaultMargin,
      ...input,
    };
  }

  return input;
}
