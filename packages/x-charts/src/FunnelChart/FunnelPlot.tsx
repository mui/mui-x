import * as React from 'react';

import { line as d3Line } from '@mui/x-charts-vendor/d3-shape';
import { FunnelItemIdentifier } from './funnel.types';
import { useFunnelSeries } from '../hooks/useSeries';
import { useCartesianContext } from '../context/CartesianProvider';
import { AxisId } from '../models/axis';
import getCurveFactory from '../internals/getCurve';
import { FunnelElement } from './FunnelElement';
import { FunnelLabel } from './FunnelLabel';

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
  label?: {
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
  xScale,
  yScale,
  isHorizontal,
  values,
}: {
  vertical?: 'top' | 'middle' | 'bottom';
  horizontal?: 'left' | 'center' | 'right';
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
  xScale: (value: number) => number | undefined;
  yScale: (value: number) => number | undefined;
  isHorizontal: boolean;
  values: { x: number; y: number }[];
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
    maxTop = yScale(values[0].y)! + mt;
    minTop = yScale(values[1].y)! + mt;
    minBottom = yScale(values[2].y)! - mb;
    maxBottom = yScale(values[3].y)! - mb;
    minRight = 0;
    maxRight = xScale(Math.min(...values.map((v) => v.x)))! - mr;
    minLeft = 0;
    maxLeft = xScale(Math.max(...values.map((v) => v.x)))! + ml;
    center = xScale(values[0].x - (values[0].x - values[1].x) / 2)!;
    leftCenter = 0;
    rightCenter = 0;
    middle = yScale(0)!;
    topMiddle = yScale(values[0].y - (values[0].y - values[1].y) / 2)! + mt;
    bottomMiddle = yScale(values[3].y - (values[3].y - values[2].y) / 2)! - mb;
  } else {
    minTop = 0;
    maxTop = yScale(Math.max(...values.map((v) => v.y)))! + mt;
    minBottom = 0;
    maxBottom = yScale(Math.min(...values.map((v) => v.y)))! - mb;
    maxRight = xScale(values[0].x)! - mr;
    minRight = xScale(values[1].x)! - mr;
    minLeft = xScale(values[2].x)! + ml;
    maxLeft = xScale(values[3].x)! + ml;
    center = xScale(0)!;
    rightCenter = xScale(values[0].x - (values[0].x - values[1].x) / 2)! - mr;
    leftCenter = xScale(values[3].x - (values[3].x - values[2].x) / 2)! + ml;
    middle = yScale(values[0].y - (values[0].y - values[1].y) / 2)!;
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

const useAggregatedData = (props: Pick<FunnelPlotProps, 'label'>) => {
  const seriesData = useFunnelSeries();
  const axisData = useCartesianContext();

  const allData = React.useMemo(() => {
    if (seriesData === undefined) {
      return [];
    }

    const { series, stackingGroups } = seriesData;
    const { xAxis, yAxis, xAxisIds, yAxisIds } = axisData;
    const defaultXAxisId = xAxisIds[0];
    const defaultYAxisId = yAxisIds[0];

    const isHorizontal = Object.values(series).some((s) => s.layout === 'horizontal');

    const result = stackingGroups.map(({ ids: groupIds }) => {
      return groupIds.map((seriesId) => {
        const xAxisId = series[seriesId].xAxisId ?? series[seriesId].xAxisKey ?? defaultXAxisId;
        const yAxisId = series[seriesId].yAxisId ?? series[seriesId].yAxisKey ?? defaultYAxisId;

        const xScale = xAxis[xAxisId].scale;
        const yScale = yAxis[yAxisId].scale;

        const gradientUsed: [AxisId, 'x' | 'y'] | undefined =
          (yAxis[yAxisId].colorScale && [yAxisId, 'y']) ||
          (xAxis[xAxisId].colorScale && [xAxisId, 'x']) ||
          undefined;

        const { stackedData } = series[seriesId];

        const curve = getCurveFactory(series[seriesId].curve ?? 'linear');

        const line = d3Line<{ x: number; y: number }>()
          .x((d) => xScale(d.x)!)
          .y((d) => yScale(d.y)!)
          .curve(curve);

        return stackedData.map((values, dataIndex) => {
          const color = series[seriesId].color ?? 'black';
          const id = `${seriesId}-${dataIndex}`;

          return {
            d: line(values)!,
            color,
            id,
            seriesId,
            dataIndex,
            gradientUsed,
            label: {
              ...positionLabel({
                vertical: props?.label?.position?.vertical,
                horizontal: props?.label?.position?.horizontal,
                margin: props?.label?.margin,
                xScale,
                yScale,
                isHorizontal,
                values,
              }),
              ...alignLabel({
                vertical: props?.label?.position?.vertical,
                horizontal: props?.label?.position?.horizontal,
              }),
              value: series[seriesId].data[dataIndex]?.toLocaleString(),
            },
          };
        });
      });
    });

    return result.flatMap((v) => v.toReversed().flat());
  }, [seriesData, axisData, props]);

  return allData;
};

function FunnelPlot(props: FunnelPlotProps) {
  const { skipAnimation, onItemClick, ...other } = props;

  const data = useAggregatedData(other);

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
      {data.map(({ id, label }) => (
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
      ))}
    </React.Fragment>
  );
}

export { FunnelPlot };
