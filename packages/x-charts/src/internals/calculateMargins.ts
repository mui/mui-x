import type { ChartsLegendSlotExtension } from '../ChartsLegend';
import { DEFAULT_MARGINS, DEFAULT_LEGEND_FACING_MARGIN } from '../constants';
import type { LayoutConfig } from '../models';
import type { CartesianChartSeriesType, ChartsSeriesConfig } from '../models/seriesType/config';

const numberToMargin = (input: LayoutConfig['margin']) => {
  if (typeof input === 'number') {
    return {
      top: input,
      bottom: input,
      left: input,
      right: input,
    };
  }

  return input;
};

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
    return {
      ...DEFAULT_MARGINS,
      ...numberToMargin(props.margin),
    };
  }

  if (props.slotProps?.legend?.direction === 'vertical') {
    if (props.slotProps?.legend?.position?.horizontal === 'start') {
      return {
        ...DEFAULT_MARGINS,
        left: DEFAULT_LEGEND_FACING_MARGIN,
        ...numberToMargin(props.margin),
      };
    }

    return {
      ...DEFAULT_MARGINS,
      right: DEFAULT_LEGEND_FACING_MARGIN,
      ...numberToMargin(props.margin),
    };
  }

  if (props.slotProps?.legend?.position?.vertical === 'bottom') {
    return {
      ...DEFAULT_MARGINS,
      bottom: DEFAULT_LEGEND_FACING_MARGIN,
      ...numberToMargin(props.margin),
    };
  }

  return {
    ...DEFAULT_MARGINS,
    top: DEFAULT_LEGEND_FACING_MARGIN,
    ...numberToMargin(props.margin),
  };
};
