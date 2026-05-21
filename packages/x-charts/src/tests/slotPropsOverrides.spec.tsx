import { BarChart, type BarChartSlots } from '@mui/x-charts/BarChart';
import { LineChart, type LineChartSlots } from '@mui/x-charts/LineChart';
import { PieChart, type PieChartSlots } from '@mui/x-charts/PieChart';
import { ScatterChart, type ScatterChartSlots } from '@mui/x-charts/ScatterChart';
import type { PropsFromSlot } from '@mui/x-charts/models';
import type { ChartsSlots } from '@mui/x-charts/internals';

declare module '@mui/x-charts' {
  // Base slots
  interface BaseButtonPropsOverrides {
    customButtonProp?: string;
  }
  interface BaseIconButtonPropsOverrides {
    customIconButtonProp?: string;
  }
  interface BaseToggleButtonPropsOverrides {
    customToggleButtonProp?: string;
  }
  interface BaseToggleButtonGroupPropsOverrides {
    customToggleButtonGroupProp?: string;
  }

  // Axis slots
  interface AxisLinePropsOverrides {
    customAxisLineProp?: string;
  }
  interface AxisTickPropsOverrides {
    customAxisTickProp?: string;
  }
  interface AxisTickLabelPropsOverrides {
    customAxisTickLabelProp?: string;
  }
  interface AxisLabelPropsOverrides {
    customAxisLabelProp?: string;
  }
  interface XAxisPropsOverrides {
    customXAxisProp?: string;
  }
  interface YAxisPropsOverrides {
    customYAxisProp?: string;
  }

  // Plot slots
  interface BarPropsOverrides {
    customBarProp?: string;
  }
  interface BarLabelPropsOverrides {
    customBarLabelProp?: string;
  }
  interface LinePropsOverrides {
    customLineProp?: string;
  }
  interface AreaPropsOverrides {
    customAreaProp?: string;
  }
  interface MarkPropsOverrides {
    customMarkProp?: string;
  }
  interface LineHighlightPropsOverrides {
    customLineHighlightProp?: string;
  }
  interface PieArcPropsOverrides {
    customPieArcProp?: string;
  }
  interface PieArcLabelPropsOverrides {
    customPieArcLabelProp?: string;
  }
  interface ScatterPropsOverrides {
    customScatterProp?: string;
  }
  interface MarkerPropsOverrides {
    customMarkerProp?: string;
  }

  // Chart-level slots
  interface TooltipPropsOverrides {
    customTooltipProp?: string;
  }
  interface LegendPropsOverrides {
    customLegendProp?: string;
  }
  interface LoadingOverlayPropsOverrides {
    customLoadingOverlayProp?: string;
  }
  interface NoDataOverlayPropsOverrides {
    customNoDataOverlayProp?: string;
  }
  interface ToolbarPropsOverrides {
    customToolbarProp?: string;
  }
}

// Base slots flow through `ChartsSlots`. End users rarely override them
// directly, so cover them as type-only assertions instead of JSX.
type AssertBaseButton = PropsFromSlot<ChartsSlots['baseButton']>['customButtonProp'];
type AssertBaseIconButton = PropsFromSlot<
  ChartsSlots['baseIconButton']
>['customIconButtonProp'];
type AssertBaseToggleButton = PropsFromSlot<
  ChartsSlots['baseToggleButton']
>['customToggleButtonProp'];
type AssertBaseToggleButtonGroup = PropsFromSlot<
  ChartsSlots['baseToggleButtonGroup']
>['customToggleButtonGroupProp'];

export type _BaseAssertions = [
  AssertBaseButton,
  AssertBaseIconButton,
  AssertBaseToggleButton,
  AssertBaseToggleButtonGroup,
];

// LineChart covers tooltip, line, area, mark, lineHighlight, axis slots,
// legend, toolbar, and the two overlays.
function CustomTooltip({ customTooltipProp }: PropsFromSlot<LineChartSlots['tooltip']>) {
  return <div>{customTooltipProp}</div>;
}
function CustomLine({ customLineProp }: PropsFromSlot<LineChartSlots['line']>) {
  return <path data-prop={customLineProp} />;
}
function CustomArea({ customAreaProp }: PropsFromSlot<LineChartSlots['area']>) {
  return <path data-prop={customAreaProp} />;
}
function CustomMark({ customMarkProp }: PropsFromSlot<LineChartSlots['mark']>) {
  return <circle data-prop={customMarkProp} />;
}
function CustomLineHighlight({
  customLineHighlightProp,
}: PropsFromSlot<LineChartSlots['lineHighlight']>) {
  return <circle data-prop={customLineHighlightProp} />;
}
function CustomAxisLine({ customAxisLineProp }: PropsFromSlot<LineChartSlots['axisLine']>) {
  return <path data-prop={customAxisLineProp} />;
}
function CustomAxisTick({ customAxisTickProp }: PropsFromSlot<LineChartSlots['axisTick']>) {
  return <path data-prop={customAxisTickProp} />;
}
function CustomAxisTickLabel({
  customAxisTickLabelProp,
}: PropsFromSlot<LineChartSlots['axisTickLabel']>) {
  return <text data-prop={customAxisTickLabelProp} />;
}
function CustomAxisLabel({
  customAxisLabelProp,
}: PropsFromSlot<LineChartSlots['axisLabel']>) {
  return <text data-prop={customAxisLabelProp} />;
}
function CustomXAxis({ customXAxisProp }: PropsFromSlot<LineChartSlots['xAxis']>) {
  return <g data-prop={customXAxisProp} />;
}
function CustomYAxis({ customYAxisProp }: PropsFromSlot<LineChartSlots['yAxis']>) {
  return <g data-prop={customYAxisProp} />;
}
function CustomLegend({ customLegendProp }: PropsFromSlot<LineChartSlots['legend']>) {
  return <div>{customLegendProp}</div>;
}
function CustomToolbar({ customToolbarProp }: PropsFromSlot<LineChartSlots['toolbar']>) {
  return <div>{customToolbarProp}</div>;
}
function CustomLoadingOverlay({
  customLoadingOverlayProp,
}: PropsFromSlot<LineChartSlots['loadingOverlay']>) {
  return <text>{customLoadingOverlayProp}</text>;
}
function CustomNoDataOverlay({
  customNoDataOverlayProp,
}: PropsFromSlot<LineChartSlots['noDataOverlay']>) {
  return <text>{customNoDataOverlayProp}</text>;
}

export function AugmentedLineChartUsage() {
  return (
    <LineChart
      height={200}
      series={[{ data: [1, 2, 3] }]}
      slots={{
        tooltip: CustomTooltip,
        line: CustomLine,
        area: CustomArea,
        mark: CustomMark,
        lineHighlight: CustomLineHighlight,
        axisLine: CustomAxisLine,
        axisTick: CustomAxisTick,
        axisTickLabel: CustomAxisTickLabel,
        axisLabel: CustomAxisLabel,
        xAxis: CustomXAxis,
        yAxis: CustomYAxis,
        legend: CustomLegend,
        toolbar: CustomToolbar,
        loadingOverlay: CustomLoadingOverlay,
        noDataOverlay: CustomNoDataOverlay,
      }}
      slotProps={{
        tooltip: { customTooltipProp: 'a' },
        line: { customLineProp: 'a' },
        area: { customAreaProp: 'a' },
        mark: { customMarkProp: 'a' },
        lineHighlight: { customLineHighlightProp: 'a' },
        axisLine: { customAxisLineProp: 'a' },
        axisTick: { customAxisTickProp: 'a' },
        axisTickLabel: { customAxisTickLabelProp: 'a' },
        axisLabel: { customAxisLabelProp: 'a' },
        xAxis: { customXAxisProp: 'a' },
        yAxis: { customYAxisProp: 'a' },
        legend: { customLegendProp: 'a' },
        toolbar: { customToolbarProp: 'a' },
        loadingOverlay: { customLoadingOverlayProp: 'a' },
        noDataOverlay: { customNoDataOverlayProp: 'a' },
      }}
    />
  );
}

// BarChart covers bar and barLabel.
function CustomBar({ customBarProp }: PropsFromSlot<BarChartSlots['bar']>) {
  return <rect data-prop={customBarProp} />;
}
function CustomBarLabel({ customBarLabelProp }: PropsFromSlot<BarChartSlots['barLabel']>) {
  return <text>{customBarLabelProp}</text>;
}

export function AugmentedBarChartUsage() {
  return (
    <BarChart
      height={200}
      series={[{ data: [1, 2, 3] }]}
      slots={{ bar: CustomBar, barLabel: CustomBarLabel }}
      slotProps={{
        bar: { customBarProp: 'a' },
        barLabel: { customBarLabelProp: 'a' },
      }}
    />
  );
}

// PieChart covers pieArc and pieArcLabel.
function CustomPieArc({ customPieArcProp }: PropsFromSlot<PieChartSlots['pieArc']>) {
  return <path data-prop={customPieArcProp} />;
}
function CustomPieArcLabel({
  customPieArcLabelProp,
}: PropsFromSlot<PieChartSlots['pieArcLabel']>) {
  return <text>{customPieArcLabelProp}</text>;
}

export function AugmentedPieChartUsage() {
  return (
    <PieChart
      height={200}
      series={[{ data: [{ value: 1 }, { value: 2 }] }]}
      slots={{ pieArc: CustomPieArc, pieArcLabel: CustomPieArcLabel }}
      slotProps={{
        pieArc: { customPieArcProp: 'a' },
        pieArcLabel: { customPieArcLabelProp: 'a' },
      }}
    />
  );
}

// ScatterChart covers scatter and marker.
function CustomScatter({ customScatterProp }: PropsFromSlot<ScatterChartSlots['scatter']>) {
  return <g data-prop={customScatterProp} />;
}
function CustomMarker({ customMarkerProp }: PropsFromSlot<ScatterChartSlots['marker']>) {
  return <circle data-prop={customMarkerProp} />;
}

export function AugmentedScatterChartUsage() {
  return (
    <ScatterChart
      height={200}
      series={[{ data: [{ x: 1, y: 1, id: 'a' }] }]}
      slots={{ scatter: CustomScatter, marker: CustomMarker }}
      slotProps={{
        scatter: { customScatterProp: 'a' },
        marker: { customMarkerProp: 'a' },
      }}
    />
  );
}
