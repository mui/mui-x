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
import { generateVirtualElement, useAxisEvents, useMouseTracker } from './utils';

const format = (data: any) => (typeof data === 'object' ? `(${data.x}, ${data.y})` : data);

function ItemTooltipContent(props: ItemInteractionData) {
  const { seriesId, type, dataIndex } = props;

  const series = React.useContext(SeriesContext)[type]!.series[seriesId];

  if (dataIndex === undefined) {
    return null;
  }

  const data = series.data[dataIndex];
  return (
    <p>
      {seriesId}: {format(data)}
    </p>
  );
}
function AxisTooltipContent(props: AxisInteractionData) {
  const dataIndex = props.x && props.x.index;
  const axisValue = props.x && props.x.value;

  const { xAxisIds, xAxis } = React.useContext(CartesianContext);
  const series = React.useContext(SeriesContext);

  const USED_X_AXIS_ID = xAxisIds[0];
  const xAxisName = xAxis[USED_X_AXIS_ID].id;

  const relevantSeries = React.useMemo(() => {
    const rep: { type: string; id: string; color: string }[] = [];
    (Object.keys(series) as (keyof FormattedSeries)[]).forEach((seriesType) => {
      series[seriesType]!.seriesOrder.forEach((seriesId) => {
        if (series[seriesType]!.series[seriesId].xAxisKey === USED_X_AXIS_ID) {
          rep.push({
            type: seriesType,
            id: seriesId,
            color: series[seriesType]!.series[seriesId].color,
          });
        }
      });
    });
    return rep;
  }, [USED_X_AXIS_ID, series]);

  if (dataIndex == null) {
    return null;
  }

  const markerSize = 30; // TODO: allows customization
  const shape = 'square';
  return (
    <React.Fragment>
      {axisValue != null && (
        <React.Fragment>
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
            {xAxisName}: {axisValue.toLocaleString()}
          </Typography>
          <Divider />
        </React.Fragment>
      )}
      {relevantSeries.map(({ type, color, id }) => (
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
          {id}: {format(series[type].series[id].data[dataIndex])}
        </Typography>
      ))}
    </React.Fragment>
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
};

function getTootipHasData(
  trigger: TooltipProps['trigger'],
  displayedData: null | AxisInteractionData | ItemInteractionData,
): boolean {
  if (trigger === 'item') {
    return displayedData !== null;
  }

  const hasAxisXData = (displayedData as AxisInteractionData).x !== null;
  const hasAxisYData = (displayedData as AxisInteractionData).y !== null;

  return hasAxisXData || hasAxisYData;
}

export function Tooltip(props: TooltipProps) {
  const { trigger = 'axis', highlightProps } = props;

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
          <Paper sx={{ p: 1 }}>
            {trigger === 'item' ? (
              <ItemTooltipContent {...(displayedData as ItemInteractionData)} />
            ) : (
              <AxisTooltipContent {...(displayedData as AxisInteractionData)} />
            )}
          </Paper>
        </Popper>
      )}
      <Highlight ref={highlightRef} highlight={{ x: true, y: false }} {...highlightProps} />
    </NoSsr>
  );
}
