import { ChartsLegendSlotExtension } from '../ChartsLegend';
import { DEFAULT_MARGINS, LEGEND_SIDE_MARGIN } from '../constants';
import { LayoutConfig } from '../models';

export const calculateMargins = <
  T extends ChartsLegendSlotExtension &
    Pick<LayoutConfig, 'margin'> & {
      hideLegend?: boolean;
    },
>(
  props: T,
): Required<LayoutConfig['margin']> => {
  if (props.margin || props.hideLegend) {
    return {
      ...DEFAULT_MARGINS,
      ...props.margin,
    };
  }

  if (props.slotProps?.legend?.direction === 'vertical') {
    if (props.slotProps?.legend?.position?.horizontal === 'left') {
      return {
        ...DEFAULT_MARGINS,
        left: LEGEND_SIDE_MARGIN,
      };
    }

    return {
      ...DEFAULT_MARGINS,
      right: LEGEND_SIDE_MARGIN,
    };
  }

  if (props.slotProps?.legend?.position?.vertical === 'bottom') {
    return {
      ...DEFAULT_MARGINS,
      bottom: LEGEND_SIDE_MARGIN,
    };
  }

  return {
    ...DEFAULT_MARGINS,
    top: LEGEND_SIDE_MARGIN,
  };
};
