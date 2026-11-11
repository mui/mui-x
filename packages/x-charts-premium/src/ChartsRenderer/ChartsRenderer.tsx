import * as React from 'react';
import PropTypes from 'prop-types';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { PieChartPro } from '@mui/x-charts-pro/PieChartPro';
import { configurationOptions } from './configuration';
import { colorPaletteLookup } from './colors';
import type { BarSeries } from '../BarChart';

const getLegendPosition = (position: string) => {
  let horizontal: 'start' | 'center' | 'end' | undefined = 'center';
  let vertical: 'top' | 'middle' | 'bottom' | undefined = 'middle';

  if (position === 'none') {
    return undefined;
  }

  if (position === 'top' || position === 'topLeft' || position === 'topRight') {
    vertical = 'top';
  }

  if (position === 'bottom' || position === 'bottomLeft' || position === 'bottomRight') {
    vertical = 'bottom';
  }

  if (position === 'left' || position === 'topLeft' || position === 'bottomLeft') {
    horizontal = 'start';
  }

  if (position === 'right' || position === 'topRight' || position === 'bottomRight') {
    horizontal = 'end';
  }

  return { horizontal, vertical };
};

const formatDimensionValue = (item: string | number | Date | null) =>
  item instanceof Date ? item.toLocaleDateString() : String(item);

interface PieNode {
  label: string;
  value: number;
  children: Map<string, PieNode>;
}

/**
 * Groups the rows of one value series by dimension (first dimension at the root) and returns
 * the items of one ring per dimension, each group summing its children and the children
 * listed right after their parent so the rings line up.
 */
const getPieRings = (
  dimensions: ChartsRendererProps['dimensions'],
  valueItem: ChartsRendererProps['values'][number],
) => {
  const root: PieNode = { label: '', value: 0, children: new Map() };

  valueItem.data.forEach((item, dataIndex) => {
    let node = root;
    dimensions.forEach((dimension) => {
      const dimensionValue = formatDimensionValue(dimension.data[dataIndex]);
      let child = node.children.get(dimensionValue);
      if (!child) {
        child = {
          label: node === root ? dimensionValue : `${node.label} - ${dimensionValue}`,
          value: 0,
          children: new Map(),
        };
        node.children.set(dimensionValue, child);
      }
      child.value += item || 0;
      node = child;
    });
  });

  const rings: { id: string; value: number; label: string }[][] = dimensions.map(() => []);
  const visit = (node: PieNode, levelIndex: number) => {
    node.children.forEach((child) => {
      const ring = rings[levelIndex];
      ring.push({
        id: `${valueItem.id}-${levelIndex}-${ring.length}`,
        value: child.value,
        label: `${child.label} - ${valueItem.label}`,
      });
      visit(child, levelIndex + 1);
    });
  };
  visit(root, 0);

  return rings;
};

export interface ChartsRendererProps {
  dimensions: { id: string; label: string; data: (string | number | Date | null)[] }[];
  values: { id: string; label: string; data: (number | null)[] }[];
  chartType: string;
  configuration: Record<string, any>;
  onRender?: (
    type: string,
    props: Record<string, any>,
    Component: React.ComponentType<any>,
  ) => React.ReactNode;
}

/**
 * A component that renders different types of charts based on the provided data and configuration.
 * It supports column, bar, line, area and pie charts with customizable styling and formatting options.
 * The component handles both single and multiple dimension datasets, with special data processing for each case.
 * For multiple dimension datasets, it creates grouped axes, or one ring per dimension for pie charts.
 *
 * @link https://www.mui.com/x/react-charts/data-grid-integration/
 * @param {Array<{id: string, label: string, data: Array<string|number|Date|null>}>} props.dimensions - Array of dimension objects containing data for chart axes
 * @param {Array<{id: string, label: string, data: Array<number|null>}>} props.values - Array of value objects containing the numerical data to plot
 * @param {string} props.chartType - Type of chart to render (e.g. 'bar', 'line', 'pie')
 * @param {Object} props.configuration - Configuration object containing chart-specific options. These options are merged with default configurations defined for each chart type
 * @param {Function} [props.onRender] - Optional callback function called before rendering to modify chart props. Receives chart type, props and component as arguments and should return a React node
 * @returns {React.ReactNode} The rendered chart component
 */
function ChartsRenderer({
  dimensions,
  values,
  chartType,
  configuration,
  onRender,
}: ChartsRendererProps): React.ReactNode {
  const hasMultipleDimensions = dimensions.length > 1;
  const dimensionRawData = dimensions.length > 0 ? dimensions[dimensions.length - 1].data : [];
  const dimensionLabel = [...dimensions.map((dimension) => dimension.label)].reverse().join(' - ');

  // for single dimension dataset: make sure that the items are unique. for repeated values add the count to the value
  // for multiple dimension datasets: transpose the data and create a array of arrays with the data per index
  // this will allow easier data management in the groups value getter function
  const itemCount = new Map<string, number>();
  const dimensionData = hasMultipleDimensions
    ? Array.from({ length: dimensions[0].data.length }, (_, dataIndex) =>
        dimensions.map((dimension) => dimension.data[dataIndex]),
      )
    : dimensionRawData.map((item) => {
        const itemValue = formatDimensionValue(item);
        const currentCount = itemCount.get(itemValue) || 1;
        itemCount.set(itemValue, currentCount + 1);
        return currentCount > 1 ? `${item} (${currentCount})` : item;
      });

  // for multiple dimension datasets, create groups and height props for the axis
  const groups = hasMultipleDimensions
    ? Array.from({ length: dimensions.length }, (_, dimensionIndex) => ({
        getValue: (value: string[]) => value[dimensionIndex],
      })).reverse()
    : undefined;
  const valueFormatter = (value: string | string[] | number): string => {
    if (Array.isArray(value)) {
      return value.join(' - ');
    }

    return String(value);
  };

  const sections = configurationOptions[chartType]?.customization || [];
  const defaultOptions = Object.fromEntries(
    sections.flatMap((section) =>
      Object.entries(section.controls).map(([key, value]) => [key, value.default]),
    ),
  );

  // merge passed options with the defaults
  const chartConfiguration = React.useMemo(() => {
    return {
      ...defaultOptions,
      ...configuration,
    };
  }, [defaultOptions, configuration]);

  if (chartType === 'bar' || chartType === 'column') {
    const layout = chartType === 'bar' ? 'horizontal' : 'vertical';
    const { categoriesAxis, categoriesAxisPosition, seriesAxis, seriesAxisPosition } =
      layout === 'vertical'
        ? {
            categoriesAxis: 'xAxis',
            categoriesAxisPosition: chartConfiguration.xAxisPosition,
            seriesAxis: 'yAxis',
            seriesAxisPosition: chartConfiguration.yAxisPosition,
          }
        : {
            categoriesAxis: 'yAxis',
            categoriesAxisPosition: chartConfiguration.yAxisPosition,
            seriesAxis: 'xAxis',
            seriesAxisPosition: chartConfiguration.xAxisPosition,
          };

    // Build axis configuration
    const categoriesAxisConfig = {
      data: dimensionData,
      categoryGapRatio: chartConfiguration.categoryGapRatio,
      barGapRatio: chartConfiguration.barGapRatio,
      tickPlacement: chartConfiguration.tickPlacement,
      tickLabelPlacement: chartConfiguration.tickLabelPlacement,
      valueFormatter,
      groups,
      label: chartConfiguration.categoriesAxisLabel || dimensionLabel,
      position: categoriesAxisPosition,
    };

    const seriesAxisConfig = {
      label: chartConfiguration.seriesAxisLabel,
      position: seriesAxisPosition,
      reverse: chartConfiguration.seriesAxisReverse,
    };

    const axisProp = {
      [categoriesAxis]: [categoriesAxisConfig],
      [seriesAxis]: [seriesAxisConfig],
    };

    const seriesProp: BarSeries[] = chartConfiguration.stacked
      ? values.map((value) => ({
          ...value,
          stack: 'stack',
        }))
      : values;

    const barLabel = chartConfiguration.itemLabel === 'value' ? ('value' as const) : undefined;
    if (barLabel) {
      seriesProp.forEach((series) => {
        series.barLabel = series.barLabel ?? barLabel;
      });
    }

    const legendPosition = getLegendPosition(
      chartConfiguration.legendDirection === 'vertical'
        ? chartConfiguration.legendPositionVertical
        : chartConfiguration.legendPositionHorizontal,
    );
    const props = {
      ...axisProp,
      series: seriesProp,
      hideLegend: legendPosition === undefined,
      height: chartConfiguration.height,
      layout: layout as 'horizontal' | 'vertical',
      borderRadius: chartConfiguration.borderRadius,
      colors: colorPaletteLookup.get(chartConfiguration.colors),
      grid: {
        vertical: chartConfiguration.grid === 'vertical' || chartConfiguration.grid === 'both',
        horizontal: chartConfiguration.grid === 'horizontal' || chartConfiguration.grid === 'both',
      },
      skipAnimation: chartConfiguration.skipAnimation,
      showToolbar: chartConfiguration.showToolbar,
      slotProps: {
        tooltip: {
          trigger: chartConfiguration.tooltipTrigger,
          placement: chartConfiguration.tooltipPlacement,
        },
        legend: {
          direction: chartConfiguration.legendDirection,
          position: legendPosition,
        },
      },
    };

    return onRender ? onRender(chartType, props, BarChartPro) : <BarChartPro {...props} />;
  }

  if (chartType === 'line' || chartType === 'area') {
    const area = chartType === 'area';
    const seriesProp = values.map((value) => ({
      ...value,
      area,
      curve: chartConfiguration.interpolation,
      showMark: chartConfiguration.showMark,
      stack: chartConfiguration.stacked ? 'stack' : undefined,
    }));

    // Build axis configuration
    const xAxisConfig = {
      data: dimensionData,
      scaleType: 'point' as const,
      valueFormatter,
      groups,
      label: chartConfiguration.categoriesAxisLabel || dimensionLabel,
      position: chartConfiguration.xAxisPosition,
    };

    const yAxisConfig = {
      label: chartConfiguration.seriesAxisLabel,
      position: chartConfiguration.yAxisPosition,
      reverse: chartConfiguration.seriesAxisReverse,
    };

    const legendPosition = getLegendPosition(
      chartConfiguration.legendDirection === 'vertical'
        ? chartConfiguration.legendPositionVertical
        : chartConfiguration.legendPositionHorizontal,
    );
    const props = {
      xAxis: [xAxisConfig],
      yAxis: [yAxisConfig],
      series: seriesProp,
      hideLegend: legendPosition === undefined,
      height: chartConfiguration.height,
      colors: colorPaletteLookup.get(chartConfiguration.colors),
      skipAnimation: chartConfiguration.skipAnimation,
      showToolbar: chartConfiguration.showToolbar,
      grid: {
        vertical: chartConfiguration.grid === 'vertical' || chartConfiguration.grid === 'both',
        horizontal: chartConfiguration.grid === 'horizontal' || chartConfiguration.grid === 'both',
      },
      slotProps: {
        tooltip: {
          trigger: chartConfiguration.tooltipTrigger,
          placement: chartConfiguration.tooltipPlacement,
        },
        legend: {
          direction: chartConfiguration.legendDirection,
          position: legendPosition,
        },
      },
    };

    return onRender ? onRender(chartType, props, LineChartPro) : <LineChartPro {...props} />;
  }

  if (chartType === 'pie') {
    // each value series takes one ring per dimension, from the first dimension (innermost ring)
    // to the last one (outermost ring)
    const levelCount = Math.max(dimensions.length, 1);
    const ringCount = values.length * levelCount;

    // - `chartConfiguration.outerRadius - chartConfiguration.innerRadius` is available radius for the whole chart
    // - to get the radius for each ring, we need to substract the gaps between the rings
    //   (`chartConfiguration.seriesGap * ringCount`) and one pixel from the total available radius
    // - then we divide the result by the number of rings to get the radius for each ring
    const radiusPerRing =
      (chartConfiguration.outerRadius -
        chartConfiguration.innerRadius -
        chartConfiguration.seriesGap * ringCount -
        1) /
      ringCount;

    const seriesProp = values.flatMap((valueItem, valueIndex) => {
      const rings = hasMultipleDimensions
        ? getPieRings(dimensions, valueItem)
        : [
            valueItem.data.map((item, itemIndex) => ({
              id: `${valueItem.id}-${itemIndex}`,
              value: item || 0,
              label: `${String(dimensionData[itemIndex])} - ${valueItem.label}`,
            })),
          ];

      return rings.map((data, levelIndex) => {
        const ringIndex = valueIndex * levelCount + levelIndex;

        return {
          data,
          arcLabel: chartConfiguration.itemLabel === 'value' ? ('value' as const) : undefined,
          // each ring starts from
          // - inner radius of the chart
          // - plus all the rings before
          // - plus the gap between the rings
          innerRadius:
            chartConfiguration.innerRadius +
            ringIndex * radiusPerRing +
            chartConfiguration.seriesGap * ringIndex,
          // each ring ends at the radius that is the same as start plus the radius of one ring
          outerRadius:
            chartConfiguration.innerRadius +
            (ringIndex + 1) * radiusPerRing +
            chartConfiguration.seriesGap * ringIndex,
          cornerRadius: chartConfiguration.cornerRadius,
          startAngle: chartConfiguration.startAngle,
          endAngle: chartConfiguration.endAngle,
          paddingAngle: chartConfiguration.paddingAngle,
        };
      });
    });

    const legendPosition = getLegendPosition(
      chartConfiguration.pieLegendDirection === 'vertical'
        ? chartConfiguration.pieLegendPositionVertical
        : chartConfiguration.pieLegendPositionHorizontal,
    );
    const props = {
      series: seriesProp,
      height: chartConfiguration.height,
      width: chartConfiguration.width,
      skipAnimation: chartConfiguration.skipAnimation,
      hideLegend: legendPosition === undefined,
      colors: colorPaletteLookup.get(chartConfiguration.colors),
      showToolbar: chartConfiguration.showToolbar,
      slotProps: {
        legend: {
          direction: chartConfiguration.pieLegendDirection,
          position: legendPosition,
          sx: {
            overflowY: 'scroll',
            flexWrap: 'nowrap',
            maxWidth: chartConfiguration.width,
            maxHeight: chartConfiguration.height,
          },
        },
        tooltip: {
          trigger: chartConfiguration.pieTooltipTrigger,
          placement: chartConfiguration.tooltipPlacement,
        },
      },
    };

    return onRender ? onRender(chartType, props, PieChartPro) : <PieChartPro {...props} />;
  }

  return null;
}

ChartsRenderer.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  chartType: PropTypes.string.isRequired,
  configuration: PropTypes.object.isRequired,
  dimensions: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string]),
      ).isRequired,
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onRender: PropTypes.func,
  values: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
} as any;

export { ChartsRenderer };
