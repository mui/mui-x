import * as React from 'react';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import {
  AxisInteractionData,
  InteractionContext,
  ItemInteractionData,
} from '../context/InteractionProvider';
import { SeriesContext } from '../context/SeriesContextProvider';
import { SVGContext } from '../context/DrawingProvider';
import { CartesianContext } from '../context/CartesianContextProvider';

const format = (data) => (typeof data === 'object' ? `(${data.x}, ${data.y})` : data);

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

  const { xAxisIds } = React.useContext(CartesianContext);
  const series = React.useContext(SeriesContext);

  const USED_X_AXIS_ID = xAxisIds[0];

  const seriesConcerned = React.useMemo(() => {
    const rep: { type: string; id: string }[] = [];

    Object.keys(series).forEach((seriesType) => {
      series[seriesType].seriesOrder.forEach((seriesId) => {
        if (series[seriesType].series[seriesId].xAxisKey === USED_X_AXIS_ID) {
          rep.push({ type: seriesType, id: seriesId });
        }
      });
    });
    return rep;
  }, [USED_X_AXIS_ID, series]);
  return (
    <div>
      {seriesConcerned.map(({ type, id }) => (
        <p key={id}>
          {id}: {format(series[type].series[id].data[dataIndex])}
        </p>
      ))}
    </div>
  );
}

export function Tooltip(props) {
  const { trigger = 'axis' } = props;

  const { item, axis, interactionApi } = React.useContext(InteractionContext);
  const { xAxisIds } = React.useContext(CartesianContext);

  const svgRef = React.useContext(SVGContext);
  React.useEffect(() => {
    if (trigger === 'axis') {
      interactionApi?.listenXAxis(xAxisIds[0]);
    }
  });

  const displayedData = trigger === 'item' ? item : axis;
  const popperOpen = displayedData !== null;

  return (
    <Popper
      open={popperOpen}
      placement="right-start"
      anchorEl={(displayedData && (displayedData as any).target) || svgRef.current}
      style={{ padding: '16px', pointerEvents: 'none', top: 0, left: 0, width: 200, height: 500 }}
    >
      <Paper>
        {trigger === 'item' ? (
          <ItemTooltipContent {...(displayedData as ItemInteractionData)} />
        ) : (
          <AxisTooltipContent {...(displayedData as AxisInteractionData)} />
        )}
      </Paper>
    </Popper>
  );
}
