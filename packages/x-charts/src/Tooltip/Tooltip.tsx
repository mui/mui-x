import * as React from 'react';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import NoSsr from '@mui/material/NoSsr';
import { symbol as d3Symbol, symbolsFill as d3SymbolsFill } from 'd3-shape';
import {
  AxisInteractionData,
  InteractionContext,
  ItemInteractionData,
} from '../context/InteractionProvider';
import { FormattedSeries, SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { Highlight, HighlightProps } from '../Highlight';
import { getSymbol } from '../internals/utils';
import { generateVirtualElement, useAxisEvents, useMouseTracker, getTootipHasData } from './utils';
import { FormatterResult } from '../models/seriesType/config';
import { AxisDefaultized } from '../models/axis';

const format = (data: any) => (typeof data === 'object' ? `(${data.x}, ${data.y})` : data);

function DefaultItemContent(props: ItemContentProps) {
  const { series, dataIndex } = props;

  if (dataIndex === undefined) {
    return null;
  }

  const data = series.data[dataIndex];
  return (
    <Paper sx={{ p: 1 }}>
      <p>
        {series.id}: {format(data)}
      </p>
    </Paper>
  );
}

function ItemTooltipContent(
  props: ItemInteractionData & {
    content: TooltipProps['itemContent'];
  },
) {
  const { seriesId, type, dataIndex, content } = props;

  const series = React.useContext(SeriesContext)[type]!.series[seriesId];

  const Content = content ?? DefaultItemContent;
  return <Content seriesId={seriesId} type={type} dataIndex={dataIndex} series={series} />;
}

function DefaultAxisContent(props: AxisContentProps) {
  const { series, axis, dataIndex, axisValue } = props;

  if (dataIndex === null) {
    return null;
  }
  const xAxisName = axis.id;

  const markerSize = 30; // TODO: allows customization
  const shape = 'square';
  return (
    <Paper sx={{ p: 1 }}>
      {axisValue != null && (
        <React.Fragment>
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
            {xAxisName}: {axisValue.toLocaleString()}
          </Typography>
          <Divider />
        </React.Fragment>
      )}
      {series.map(({ color, id, data }) => (
        <Typography variant="caption" key={id} sx={{ display: 'flex', alignItems: 'center' }}>
          <svg width={markerSize} height={markerSize}>
            <path
              // @ts-ignore TODO: Fix me
              d={d3Symbol(d3SymbolsFill[getSymbol(shape)], markerSize)()!}
              // TODO: Should be customizable. Maybe owner state would make more sense
              // fill={invertMarkers ? d.stroke : d.fill}
              // stroke={invertMarkers ? d.fill : d.stroke}
              fill={color}
              transform={`translate(${markerSize / 2}, ${markerSize / 2})`}
            />
          </svg>
          {/* @ts-ignore */}
          {id}: {format(data[dataIndex])}
        </Typography>
      ))}
    </Paper>
  );
}

function AxisTooltipContent(
  props: AxisInteractionData & {
    content: TooltipProps['axisContent'];
  },
) {
  const { content, ...other } = props;
  const dataIndex = props.x && props.x.index;
  const axisValue = props.x && props.x.value;

  const { xAxisIds, xAxis } = React.useContext(CartesianContext);
  const series = React.useContext(SeriesContext);

  const USED_X_AXIS_ID = xAxisIds[0];

  const relevantSeries = React.useMemo(() => {
    const rep: any[] = [];
    (Object.keys(series) as (keyof FormattedSeries)[]).forEach((seriesType) => {
      series[seriesType]!.seriesOrder.forEach((seriesId) => {
        if (series[seriesType]!.series[seriesId].xAxisKey === USED_X_AXIS_ID) {
          rep.push(series[seriesType]!.series[seriesId]);
        }
      });
    });
    return rep;
  }, [USED_X_AXIS_ID, series]);

  const relevantAxis = React.useMemo(() => {
    return xAxis[USED_X_AXIS_ID];
  }, [USED_X_AXIS_ID, xAxis]);

  const Content = content ?? DefaultAxisContent;
  return (
    <Content
      {...other}
      series={relevantSeries}
      axis={relevantAxis}
      dataIndex={dataIndex}
      axisValue={axisValue}
    />
  );
}

export type TooltipProps = {
  /**
   * Select the kind of tooltip to display
   * - 'item': Shows data about the item below the mouse.
   * - 'axis': Shows values associated with the hovered x value
   * - 'none': Does not display tooltip
   * @default 'item'
   */
  trigger?: 'item' | 'axis' | 'none';
  /**
   * Props propagate to the highlight
   */
  highlightProps?: Partial<HighlightProps>;
  /**
   * Component to override the tooltip content when triger is set to 'item'.
   */
  itemContent?: React.ElementType<ItemContentProps>;
  /**
   * Component to override the tooltip content when triger is set to 'axis'.
   */
  axisContent?: React.ElementType<AxisContentProps>;
};

interface AxisContentProps extends AxisInteractionData {
  /**
   * The series linked to the triggered axis
   */
  series: FormatterResult<'bar' | 'line' | 'scatter'>['series'][];
  /**
   * The properties of the triggered axis
   */
  axis: AxisDefaultized;
  /**
   * The index of the data item triggered
   */
  dataIndex?: null | number;
  /**
   * The value associated to the current mouse position.
   */
  axisValue: any;
}

type ItemContentProps = ItemInteractionData & {
  /**
   * The series linked to the triggered axis
   */
  series: FormatterResult<'bar' | 'line' | 'scatter'>['series'];
};

export function Tooltip(props: TooltipProps) {
  const { trigger = 'axis', highlightProps, itemContent, axisContent } = props;

  useAxisEvents(trigger);
  const mousePosition = useMouseTracker();

  const { item, axis } = React.useContext(InteractionContext);

  const highlightRef = React.useRef<SVGPathElement>(null);

  const displayedData = trigger === 'item' ? item : axis;

  const tooltipHasData = getTootipHasData(trigger, displayedData);
  const popperOpen = mousePosition !== null && tooltipHasData;

  if (trigger === 'none') {
    return null;
  }
  return (
    <NoSsr>
      {popperOpen && (
        <Popper
          open={popperOpen}
          placement="right-start"
          anchorEl={generateVirtualElement(mousePosition)}
          style={{ padding: '16px', pointerEvents: 'none' }}
        >
          {trigger === 'item' ? (
            <ItemTooltipContent {...(displayedData as ItemInteractionData)} content={itemContent} />
          ) : (
            <AxisTooltipContent {...(displayedData as AxisInteractionData)} content={axisContent} />
          )}
        </Popper>
      )}
      <Highlight ref={highlightRef} highlight={{ x: true, y: false }} {...highlightProps} />
    </NoSsr>
  );
}
