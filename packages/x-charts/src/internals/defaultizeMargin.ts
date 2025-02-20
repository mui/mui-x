import type { LayoutConfig } from '../models';
import type { ChartMargin } from './plugins/corePlugins/useChartDimensions/useChartDimensions.types';

export function defaultizeMargin(
  input: LayoutConfig['margin'],
  defaultMargin: ChartMargin,
): ChartMargin;
export function defaultizeMargin(
  input: LayoutConfig['margin'],
  defaultMargin?: ChartMargin,
): Partial<ChartMargin> | undefined;
export function defaultizeMargin(
  input: LayoutConfig['margin'],
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
