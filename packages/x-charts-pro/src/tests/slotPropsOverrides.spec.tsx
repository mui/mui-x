import { BarChartPro, type BarChartProSlots } from '@mui/x-charts-pro/BarChartPro';
import { Heatmap, type HeatmapSlots } from '@mui/x-charts-pro/Heatmap';
import { FunnelChart, type FunnelChartSlots } from '@mui/x-charts-pro/FunnelChart';
// eslint-disable-next-line no-restricted-imports
import type { PropsFromSlot } from '@mui/x-charts';

declare module '@mui/x-charts' {
  interface TooltipPropsOverrides {
    heatmapTooltipExtra?: string;
  }
}

declare module '@mui/x-charts-pro' {
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

// Pro base + icon slots flow through `Partial<ChartsSlotsPro>` on every pro chart.
function CustomBaseDivider({ customDividerProp }: PropsFromSlot<BarChartProSlots['baseDivider']>) {
  return <hr data-prop={customDividerProp} />;
}
function CustomBaseMenuItem({
  customMenuItemProp,
}: PropsFromSlot<BarChartProSlots['baseMenuItem']>) {
  return <li data-prop={customMenuItemProp} />;
}
function CustomBaseMenuList({
  customMenuListProp,
}: PropsFromSlot<BarChartProSlots['baseMenuList']>) {
  return <ul data-prop={customMenuListProp} />;
}
function CustomBasePopper({ customPopperProp }: PropsFromSlot<BarChartProSlots['basePopper']>) {
  return <div data-prop={customPopperProp} />;
}
function CustomBaseTooltip({
  customBaseTooltipProp,
}: PropsFromSlot<BarChartProSlots['baseTooltip']>) {
  return <div data-prop={customBaseTooltipProp} />;
}
function CustomZoomInIcon({ customZoomInProp }: PropsFromSlot<BarChartProSlots['zoomInIcon']>) {
  return <svg data-prop={customZoomInProp} />;
}
function CustomZoomOutIcon({ customZoomOutProp }: PropsFromSlot<BarChartProSlots['zoomOutIcon']>) {
  return <svg data-prop={customZoomOutProp} />;
}
function CustomExportIcon({ customExportProp }: PropsFromSlot<BarChartProSlots['exportIcon']>) {
  return <svg data-prop={customExportProp} />;
}

export function AugmentedProBaseSlotsUsage() {
  return (
    <BarChartPro
      height={200}
      series={[{ data: [1, 2, 3] }]}
      slots={{
        baseDivider: CustomBaseDivider,
        baseMenuItem: CustomBaseMenuItem,
        baseMenuList: CustomBaseMenuList,
        basePopper: CustomBasePopper,
        baseTooltip: CustomBaseTooltip,
        zoomInIcon: CustomZoomInIcon,
        zoomOutIcon: CustomZoomOutIcon,
        exportIcon: CustomExportIcon,
      }}
      slotProps={{
        baseDivider: { customDividerProp: 'a' },
        baseMenuItem: { customMenuItemProp: 'a' },
        baseMenuList: { customMenuListProp: 'a' },
        basePopper: { open: false, customPopperProp: 'a' },
        baseTooltip: {
          title: 't',
          children: <span />,
          customBaseTooltipProp: 'a',
        },
        zoomInIcon: { customZoomInProp: 'a' },
        zoomOutIcon: { customZoomOutProp: 'a' },
        exportIcon: { customExportProp: 'a' },
      }}
    />
  );
}

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
