import type { ChartsLegendSlotExtension } from '../ChartsLegend';
import { DEFAULT_MARGINS, DEFAULT_LEGEND_FACING_MARGIN } from '../constants';
import type { LayoutConfig } from '../models';
import type { CartesianChartSeriesType, ChartsSeriesConfig } from '../models/seriesType/config';
import { ChartMargin } from './plugins/corePlugins/useChartDimensions/useChartDimensions.types';

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

export const calculateMargins = <
  T extends ChartsLegendSlotExtension &
    Pick<LayoutConfig, 'margin'> & {
      hideLegend?: boolean;
      series?: Partial<ChartsSeriesConfig[CartesianChartSeriesType]['seriesProp']>[];
    },
>(
  props: T,
): Required<LayoutConfig['margin']> => {
  if (props.hideLegend || !props.series?.some((s) => s.label)) {
    return defaultizeMargin(props.margin, DEFAULT_MARGINS);
  }

  if (props.slotProps?.legend?.direction === 'vertical') {
    if (props.slotProps?.legend?.position?.horizontal === 'start') {
      return defaultizeMargin(props.margin, {
        ...DEFAULT_MARGINS,
        left: DEFAULT_LEGEND_FACING_MARGIN,
      });
    }

    return defaultizeMargin(props.margin, {
      ...DEFAULT_MARGINS,
      right: DEFAULT_LEGEND_FACING_MARGIN,
    });
  }

  if (props.slotProps?.legend?.position?.vertical === 'bottom') {
    return defaultizeMargin(props.margin, {
      ...DEFAULT_MARGINS,
      bottom: DEFAULT_LEGEND_FACING_MARGIN,
    });
  }

  return defaultizeMargin(props.margin, {
    ...DEFAULT_MARGINS,
    top: DEFAULT_LEGEND_FACING_MARGIN,
  });
};
