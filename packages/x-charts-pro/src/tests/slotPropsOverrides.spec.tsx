import { Heatmap, type HeatmapSlots } from '@mui/x-charts-pro/Heatmap';
import { FunnelChart, type FunnelChartSlots } from '@mui/x-charts-pro/FunnelChart';
import type { ChartsSlotsPro } from '@mui/x-charts-pro/internals';
import type { PropsFromSlot } from '@mui/x-charts/models';

declare module '@mui/x-charts/models' {
  interface TooltipPropsOverrides {
    heatmapTooltipExtra?: string;
  }
}

declare module '@mui/x-charts-pro/models' {
  // Pro base slots
  interface BaseDividerPropsOverrides {
    customDividerProp?: string;
  }
  interface BaseMenuItemPropsOverrides {
    customMenuItemProp?: string;
  }
  interface BaseMenuListPropsOverrides {
    customMenuListProp?: string;
  }
  interface BasePopperPropsOverrides {
    customPopperProp?: string;
  }
  interface BaseTooltipPropsOverrides {
    customBaseTooltipProp?: string;
  }

  // Pro icons
  interface ZoomInIconPropsOverrides {
    customZoomInProp?: string;
  }
  interface ZoomOutIconPropsOverrides {
    customZoomOutProp?: string;
  }
  interface ExportIconPropsOverrides {
    customExportProp?: string;
  }

  // Pro chart slots
  interface CellPropsOverrides {
    highlightedColor?: string;
  }
  interface FunnelSectionPropsOverrides {
    customFunnelSectionProp?: string;
  }
  interface FunnelSectionLabelPropsOverrides {
    customFunnelSectionLabelProp?: string;
  }
}

// Pro base + icon slots flow through `ChartsSlotsPro`. End users rarely override
// them directly, so cover them as type-only assertions instead of JSX.
type AssertBaseDivider = PropsFromSlot<ChartsSlotsPro['baseDivider']>['customDividerProp'];
type AssertBaseMenuItem = PropsFromSlot<ChartsSlotsPro['baseMenuItem']>['customMenuItemProp'];
type AssertBaseMenuList = PropsFromSlot<ChartsSlotsPro['baseMenuList']>['customMenuListProp'];
type AssertBasePopper = PropsFromSlot<ChartsSlotsPro['basePopper']>['customPopperProp'];
type AssertBaseTooltip = PropsFromSlot<ChartsSlotsPro['baseTooltip']>['customBaseTooltipProp'];
type AssertZoomIn = PropsFromSlot<ChartsSlotsPro['zoomInIcon']>['customZoomInProp'];
type AssertZoomOut = PropsFromSlot<ChartsSlotsPro['zoomOutIcon']>['customZoomOutProp'];
type AssertExport = PropsFromSlot<ChartsSlotsPro['exportIcon']>['customExportProp'];

export type _ProBaseAssertions = [
  AssertBaseDivider,
  AssertBaseMenuItem,
  AssertBaseMenuList,
  AssertBasePopper,
  AssertBaseTooltip,
  AssertZoomIn,
  AssertZoomOut,
  AssertExport,
];

// Heatmap covers the pro tooltip + cell slots.
function CustomHeatmapTooltip({ heatmapTooltipExtra }: PropsFromSlot<HeatmapSlots['tooltip']>) {
  return <div>{heatmapTooltipExtra}</div>;
}

function CustomHeatmapCell({ highlightedColor }: PropsFromSlot<HeatmapSlots['cell']>) {
  return <rect fill={highlightedColor} />;
}

export function AugmentedHeatmapUsage() {
  return (
    <Heatmap
      height={200}
      xAxis={[{ data: [1, 2, 3] }]}
      yAxis={[{ data: [1, 2, 3] }]}
      series={[{ data: [[0, 0, 1]] }]}
      slots={{ tooltip: CustomHeatmapTooltip, cell: CustomHeatmapCell }}
      slotProps={{
        tooltip: { heatmapTooltipExtra: 'extra' },
        cell: { highlightedColor: 'red' },
      }}
    />
  );
}

// FunnelChart covers funnelSection and funnelSectionLabel.
function CustomFunnelSection({
  customFunnelSectionProp,
}: PropsFromSlot<FunnelChartSlots['funnelSection']>) {
  return <path data-prop={customFunnelSectionProp} />;
}

function CustomFunnelSectionLabel({
  customFunnelSectionLabelProp,
}: PropsFromSlot<FunnelChartSlots['funnelSectionLabel']>) {
  return <text>{customFunnelSectionLabelProp}</text>;
}

export function AugmentedFunnelChartUsage() {
  return (
    <FunnelChart
      height={200}
      series={[{ data: [{ value: 10 }, { value: 5 }] }]}
      slots={{
        funnelSection: CustomFunnelSection,
        funnelSectionLabel: CustomFunnelSectionLabel,
      }}
      slotProps={{
        funnelSection: { customFunnelSectionProp: 'a' },
        funnelSectionLabel: { customFunnelSectionLabelProp: 'a' },
      }}
    />
  );
}
