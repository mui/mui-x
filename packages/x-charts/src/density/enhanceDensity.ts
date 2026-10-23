import type { CSSInterpolation, Theme } from '@mui/material/styles';
import type {} from '../themeAugmentation';
import { addStyleOverride, getDensityScale, getDensitySizing } from '@mui/x-internals/densityTheme';
import { labelMarkClasses } from '../ChartsLabel/labelMarkClasses';
import { legendClasses } from '../ChartsLegend/chartsLegendClasses';
import { piecewiseColorLegendClasses } from '../ChartsLegend/piecewiseColorLegendClasses';
import { chartsTooltipClasses } from '../ChartsTooltip/chartsTooltipClasses';

/** A theme whose `components` object the enhancer chain owns and can write into. */
export type DensityEnhancedTheme<T extends Theme> = T & {
  components: NonNullable<Theme['components']>;
};

type SlotOverrides = { styleOverrides?: Record<string, CSSInterpolation> };

/**
 * These components resolve theme overrides by name, but the charts theme
 * augmentation does not list them, so their keys are typed loosely here.
 */
export type ChartsDensityComponents = NonNullable<Theme['components']> & {
  MuiChartsAxisHighlightValue?: SlotOverrides;
  MuiChartsLabelMark?: SlotOverrides;
  MuiContinuousColorLegend?: SlotOverrides;
  MuiPiecewiseColorLegend?: SlotOverrides;
  MuiChartsToolbar?: SlotOverrides;
};

/**
 * Make the charts' HTML parts (legends, tooltips, toolbar, axis value labels)
 * density-aware on the scale the theme already carries. Apply after
 * `@mui/material`'s `unstable_enhanceDensity`; without it the theme has no
 * scale to read. The SVG drawing is untouched. The Pro and Premium enhancers
 * wrap this one and add what they own.
 */
export function enhanceDensity<T extends Theme>(theme: T): DensityEnhancedTheme<T> {
  getDensityScale(theme);
  const components: ChartsDensityComponents = { ...theme.components };
  const { spacing } = theme;
  const { touchTarget, iconSize } = getDensitySizing(theme);
  const halfStep = `calc(${spacing('xxSmall')} / 2)`;

  addStyleOverride(components, 'MuiChartsAxisHighlightValue', 'root', {
    padding: `${spacing('xxSmall')} ${spacing('xSmall')}`,
  });

  // Legend and tooltip marks are glyphs, so they step off `iconSize` (master's
  // 14 / 16x8 / 13 / 15 at the default 16).
  addStyleOverride(components, 'MuiChartsLabelMark', 'root', {
    width: `calc(${iconSize} - 2px)`,
    height: `calc(${iconSize} - 2px)`,
    [`&.${labelMarkClasses.line}`]: { width: iconSize, height: `calc(${iconSize} / 2)` },
    [`&.${labelMarkClasses.square}`]: {
      width: `calc(${iconSize} - 3px)`,
      height: `calc(${iconSize} - 3px)`,
    },
    [`&.${labelMarkClasses.circle}`]: {
      width: `calc(${iconSize} - 1px)`,
      height: `calc(${iconSize} - 1px)`,
    },
  });

  const legendBox = { marginBlock: spacing('xSmall'), marginInline: spacing('xSmall') };
  addStyleOverride(components, 'MuiChartsLegend', 'root', {
    ...legendBox,
    gap: spacing('medium'),
    [`& .${legendClasses.series}`]: { gap: spacing('xSmall') },
  });
  addStyleOverride(components, 'MuiContinuousColorLegend', 'root', {
    ...legendBox,
    gap: spacing('xxSmall'),
  });
  addStyleOverride(components, 'MuiPiecewiseColorLegend', 'root', {
    ...legendBox,
    gap: spacing('xxSmall'),
    [`.${piecewiseColorLegendClasses.item}`]: { gap: spacing('xxSmall') },
    [`&.${piecewiseColorLegendClasses.horizontal}`]: {
      [`&.${piecewiseColorLegendClasses.inlineStart}, &.${piecewiseColorLegendClasses.inlineEnd}`]:
        { gap: spacing('small') },
    },
  });

  // Tooltip table: the mark column holds a mark plus a gutter.
  addStyleOverride(components, 'MuiChartsTooltip', 'table', {
    [`& .${chartsTooltipClasses.markContainer}`]: {
      width: `calc(${iconSize} + ${spacing('xxSmall')} + ${spacing('small')})`,
    },
    '& caption': {
      padding: `${spacing('xxSmall')} ${spacing('small')}`,
      '& span': { marginRight: spacing('small') },
    },
  });
  addStyleOverride(components, 'MuiChartsTooltip', 'row', {
    'tr:first-of-type& td': { paddingTop: spacing('xxSmall') },
    'tr:last-of-type& td': { paddingBottom: spacing('xxSmall') },
  });
  // Same selector order as master, so the first and last cell insets still win.
  addStyleOverride(components, 'MuiChartsTooltip', 'cell', {
    [`&.${chartsTooltipClasses.cell}`]: { paddingInline: spacing('xSmall') },
    [`&.${chartsTooltipClasses.valueCell}`]: { paddingInline: spacing('small') },
    'td:first-of-type&, th:first-of-type&': { paddingLeft: spacing('small') },
    'td:last-of-type&, th:last-of-type&': { paddingRight: spacing('small') },
  });

  // Toolbar: a bar as high as its IconButtons plus its own block padding.
  addStyleOverride(components, 'MuiChartsToolbar', 'root', {
    gap: halfStep,
    padding: spacing('xxSmall'),
    marginBottom: spacing('small'),
    minHeight: `calc(${touchTarget} + 2 * ${spacing('xxSmall')})`,
  });

  return { ...theme, components };
}
