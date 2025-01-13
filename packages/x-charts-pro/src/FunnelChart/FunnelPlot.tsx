import * as React from 'react';

import { line as d3Line } from '@mui/x-charts-vendor/d3-shape';
import { getCurveFactory, AxisDefaultized, cartesianSeriesTypes } from '@mui/x-charts/internals';
import { useXAxes, useYAxes } from '@mui/x-charts/hooks';
import { FunnelItemIdentifier, FunnelStackedData } from './funnel.types';
import { FunnelElement } from './FunnelElement';
import { FunnelLabel } from './FunnelLabel';
import { useFunnelSeries } from '../hooks/useSeries';

cartesianSeriesTypes.addType('funnel');

export interface FunnelPlotSlots {}

export interface FunnelPlotSlotProps {}

export interface FunnelPlotProps {
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation?: boolean;
  /**
   * Callback fired when a funnel item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {FunnelItemIdentifier} funnelItemIdentifier The funnel item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    funnelItemIdentifier: FunnelItemIdentifier,
  ) => void;
  /**
   * The label configuration for the funnel plot.
   * Allows to customize the position and margin of the label.
   */
  // TODO: unsure how to handle this prop, eg: barLabel accepts 'value' or function, but it has no configuration for position and margin
  // Should we provide a function here as well and the positioning on another prop? Or should we provide a way for user to position stuff using hooks and custom components?
  funnelLabel?:
    | false
    | {
        /**
         * The position of the label.
         * @default { vertical: 'middle', horizontal: 'center' }
         */
        position?: {
          /**
           * The vertical position of the label.
           */
          vertical?: 'top' | 'middle' | 'bottom';
          /**
           * The horizontal position of the label.
           */
          horizontal?: 'left' | 'center' | 'right';
        };
        /**
         * The margin of the label.
         * @default 0
         */
        margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
      };
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: FunnelPlotSlotProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: FunnelPlotSlots;
}

const positionLabel = ({
  vertical = 'middle',
  horizontal = 'center',
  margin,
  xPosition,
  yPosition,
  isHorizontal,
  values,
  dataIndex,
}: {
  vertical?: 'top' | 'middle' | 'bottom';
  horizontal?: 'left' | 'center' | 'right';
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
  xPosition: (value: number, bandIndex: number, useBand?: boolean) => number | undefined;
  yPosition: (value: number, bandIndex: number, useBand?: boolean) => number | undefined;
  isHorizontal: boolean;
  values: FunnelStackedData[];
  dataIndex: number;
}) => {
  let x: number | undefined = 0;
  let y: number | undefined = 0;

  // TODO: should we provide these to the user when they override the label?
  // We can optimize this by only calculating the necessary values
  // And simplifying the if/else mess :)
  let minTop: number = 0;
  let maxTop: number = 0;
  let minBottom: number = 0;
  let maxBottom: number = 0;
  let minLeft: number = 0;
  let maxLeft: number = 0;
  let minRight: number = 0;
  let maxRight: number = 0;
  let center: number = 0;
  let leftCenter: number = 0;
  let rightCenter: number = 0;
  let middle: number = 0;
  let topMiddle: number = 0;
  let bottomMiddle: number = 0;

  const mt = typeof margin === 'number' ? margin : (margin?.top ?? 0);
  const mr = typeof margin === 'number' ? margin : (margin?.right ?? 0);
  const mb = typeof margin === 'number' ? margin : (margin?.bottom ?? 0);
  const ml = typeof margin === 'number' ? margin : (margin?.left ?? 0);

  if (isHorizontal) {
    maxTop = yPosition(values[0].y, dataIndex)! + mt;
    minTop = yPosition(values[1].y, dataIndex)! + mt;
    minBottom = yPosition(values[2].y, dataIndex)! - mb;
    maxBottom = yPosition(values[3].y, dataIndex)! - mb;
    minRight = 0;
    maxRight = xPosition(Math.min(...values.map((v) => v.x)), dataIndex, true)! - mr;
    minLeft = 0;
    maxLeft = xPosition(Math.max(...values.map((v) => v.x)), dataIndex)! + ml;
    center = maxRight - (maxRight - maxLeft) / 2;
    leftCenter = 0;
    rightCenter = 0;
    middle = yPosition(0, dataIndex)!;
    topMiddle = yPosition(values[0].y - (values[0].y - values[1].y) / 2, dataIndex)! + mt;
    bottomMiddle = yPosition(values[3].y - (values[3].y - values[2].y) / 2, dataIndex)! - mb;
  } else {
    minTop = 0;
    maxTop = yPosition(Math.max(...values.map((v) => v.y)), dataIndex)! + mt;
    minBottom = 0;
    maxBottom = yPosition(Math.min(...values.map((v) => v.y)), dataIndex, true)! - mb;
    maxRight = xPosition(values[0].x, dataIndex)! - mr;
    minRight = xPosition(values[1].x, dataIndex)! - mr;
    minLeft = xPosition(values[2].x, dataIndex)! + ml;
    maxLeft = xPosition(values[3].x, dataIndex)! + ml;
    center = xPosition(0, dataIndex)!;
    rightCenter = xPosition(values[0].x - (values[0].x - values[1].x) / 2, dataIndex)! - mr;
    leftCenter = xPosition(values[3].x - (values[3].x - values[2].x) / 2, dataIndex)! + ml;
    middle = yPosition(values[0].y - (values[0].y - values[1].y) / 2, dataIndex)!;
    middle = maxTop - (maxTop - maxBottom) / 2;
    topMiddle = 0;
    bottomMiddle = 0;
  }

  if (isHorizontal) {
    if (horizontal === 'center') {
      x = center;
      if (vertical === 'top') {
        y = topMiddle;
      } else if (vertical === 'middle') {
        y = middle;
      } else if (vertical === 'bottom') {
        y = bottomMiddle;
      }
    } else if (horizontal === 'left') {
      x = maxLeft;
      if (vertical === 'top') {
        y = maxTop;
      } else if (vertical === 'middle') {
        y = middle;
      } else if (vertical === 'bottom') {
        y = maxBottom;
      }
    } else if (horizontal === 'right') {
      x = maxRight;
      if (vertical === 'top') {
        y = minTop;
      } else if (vertical === 'middle') {
        y = middle;
      } else if (vertical === 'bottom') {
        y = minBottom;
      }
    }
  }

  if (!isHorizontal) {
    if (vertical === 'middle') {
      y = middle;
      if (horizontal === 'left') {
        x = leftCenter;
      } else if (horizontal === 'center') {
        x = center;
      } else if (horizontal === 'right') {
        x = rightCenter;
      }
    } else if (vertical === 'top') {
      y = maxTop;
      if (horizontal === 'left') {
        x = maxLeft;
      } else if (horizontal === 'center') {
        x = center;
      } else if (horizontal === 'right') {
        x = maxRight;
      }
    } else if (vertical === 'bottom') {
      y = maxBottom;
      if (horizontal === 'left') {
        x = minLeft;
      } else if (horizontal === 'center') {
        x = center;
      } else if (horizontal === 'right') {
        x = minRight;
      }
    }
  }

  return {
    x,
    y,
  };
};

const alignLabel = ({
  vertical = 'middle',
  horizontal = 'center',
}: {
  vertical?: 'top' | 'middle' | 'bottom';
  horizontal?: 'left' | 'center' | 'right';
}) => {
  let textAnchor = 'middle';
  let dominantBaseline = 'central';

  if (vertical === 'top') {
    dominantBaseline = 'hanging';
  } else if (vertical === 'bottom') {
    dominantBaseline = 'baseline';
  }

  if (horizontal === 'left') {
    textAnchor = 'start';
  } else if (horizontal === 'right') {
    textAnchor = 'end';
  }

  return {
    textAnchor,
    dominantBaseline,
  };
};

const useAggregatedData = (funnelLabel: FunnelPlotProps['funnelLabel']) => {
  const seriesData = useFunnelSeries();
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();

  const allData = React.useMemo(() => {
    if (seriesData === undefined) {
      return [];
    }

    const { series, stackingGroups } = seriesData;
    const defaultXAxisId = xAxisIds[0];
    const defaultYAxisId = yAxisIds[0];

    const isHorizontal = Object.values(series).some((s) => s.layout === 'horizontal');

    const result = stackingGroups.map(({ ids: groupIds }) => {
      return groupIds.map((seriesId) => {
        const xAxisId = series[seriesId].xAxisId ?? defaultXAxisId;
        const yAxisId = series[seriesId].yAxisId ?? defaultYAxisId;

        const valueFormatter = series[seriesId].valueFormatter;

        const baseScaleConfig = (
          isHorizontal ? xAxis[xAxisId] : yAxis[yAxisId]
        ) as AxisDefaultized<'band'>;

        const isXAxisBand = xAxis[xAxisId].scaleType === 'band';
        const isYAxisBand = yAxis[yAxisId].scaleType === 'band';

        const bandWidth = ((isXAxisBand || isYAxisBand) && baseScaleConfig.scale.bandwidth()) || 0;

        const xScale = xAxis[xAxisId].scale;
        const yScale = yAxis[yAxisId].scale;

        // TODO: fix type, type is correct, but need to be inferred
        const { stackedData } = series[seriesId] as unknown as {
          stackedData: FunnelStackedData[][];
        };

        const curve = getCurveFactory(series[seriesId].curve ?? 'linear');

        const xPosition = (v: number, bandIndex: number, useBand?: boolean) => {
          if (isXAxisBand) {
            const value = xScale(bandIndex);
            return useBand ? value! + bandWidth : value!;
          }
          return xScale(v)!;
        };

        const yPosition = (v: number, bandIndex: number, useBand?: boolean) => {
          if (isYAxisBand) {
            const value = yScale(bandIndex);
            return useBand ? value! + bandWidth : value!;
          }
          return yScale(v)!;
        };

        return stackedData.map((values, dataIndex) => {
          const color = series[seriesId][dataIndex]?.color ?? 'pink';
          const id = `${seriesId}-${dataIndex}`;

          const line = d3Line<FunnelStackedData>()
            .x((d) => xPosition(d.x, dataIndex, d.useBandWidth))
            .y((d) => yPosition(d.y, dataIndex, d.useBandWidth))
            .curve(curve);

          return {
            d: line(values)!,
            color,
            id,
            seriesId,
            dataIndex,
            label: funnelLabel !== false && {
              ...positionLabel({
                vertical: funnelLabel?.position?.vertical,
                horizontal: funnelLabel?.position?.horizontal,
                margin: funnelLabel?.margin,
                xPosition,
                yPosition,
                isHorizontal,
                values,
                dataIndex,
              }),
              ...alignLabel({
                vertical: funnelLabel?.position?.vertical,
                horizontal: funnelLabel?.position?.horizontal,
              }),
              value: valueFormatter
                ? valueFormatter(series[seriesId].data[dataIndex], { dataIndex })
                : series[seriesId].data[dataIndex].value?.toLocaleString(),
            },
          };
        });
      });
    });

    return result.flatMap((v) => v.toReversed().flat());
  }, [seriesData, xAxis, xAxisIds, yAxis, yAxisIds, funnelLabel]);

  return allData;
};

function FunnelPlot(props: FunnelPlotProps) {
  const { skipAnimation, onItemClick, funnelLabel, ...other } = props;

  const data = useAggregatedData(funnelLabel);

  return (
    <React.Fragment>
      {data.map(({ d, color, id, seriesId, dataIndex }) => (
        <FunnelElement
          {...other}
          d={d}
          color={color}
          key={id}
          dataIndex={dataIndex}
          seriesId={seriesId}
          onClick={
            onItemClick &&
            ((event) => {
              onItemClick(event, { type: 'funnel', seriesId, dataIndex });
            })
          }
        />
      ))}
      {data.map(({ id, label }) => {
        if (!label) {
          return null;
        }

        return (
          <FunnelLabel
            key={id}
            x={label.x}
            y={label.y}
            sx={{
              textAnchor: label.textAnchor,
              dominantBaseline: label.dominantBaseline,
            }}
          >
            {label.value}
          </FunnelLabel>
        );
      })}
    </React.Fragment>
  );
}

export { FunnelPlot };
