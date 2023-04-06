import * as React from 'react';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import NoSsr from '@mui/material/NoSsr';
import {
  AxisInteractionData,
  InteractionContext,
  ItemInteractionData,
} from '../context/InteractionProvider';
import { SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { Highlight } from '../Highlight';

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

  const { xAxisIds } = React.useContext(CartesianContext);
  const series = React.useContext(SeriesContext);

  const USED_X_AXIS_ID = xAxisIds[0];

  const seriesConcerned = React.useMemo(() => {
    const rep: { type: string; id: string }[] = [];

    // @ts-ignore
    Object.keys(series).forEach((seriesType) => {
      // @ts-ignore
      series[seriesType].seriesOrder.forEach((seriesId: string) => {
        // @ts-ignore
        if (series[seriesType].series[seriesId].xAxisKey === USED_X_AXIS_ID) {
          rep.push({ type: seriesType, id: seriesId });
        }
      });
    });
    return rep;
  }, [USED_X_AXIS_ID, series]);

  if (dataIndex == null) {
    return null;
  }

  return (
    <div>
      {seriesConcerned.map(({ type, id }) => (
        <p key={id}>
          {/* @ts-ignore */}
          {id}: {format(series[type].series[id].data[dataIndex])}
        </p>
      ))}
    </div>
  );
}

export type TooltipProps = {
  /**
   * Select the kinf of tooltip to display
   * - 'item': Shows data about the item below the mouse.
   * - 'axis': Shows vlaues associated to the hovered x value
   * - 'none': Does nto display tooltip
   * @default 'item'
   */
  trigger?: 'item' | 'axis' | 'none';
};

export function Tooltip(props: TooltipProps) {
  const { trigger = 'axis' } = props;

  const { item, axis, interactionApi } = React.useContext(InteractionContext);
  const { xAxisIds } = React.useContext(CartesianContext);

  const highlightRef = React.useRef<SVGPathElement>(null);
  React.useEffect(() => {
    if (trigger === 'axis') {
      interactionApi?.listenXAxis(xAxisIds[0]);
    }
  });

  const displayedData = trigger === 'item' ? item : axis;
  const popperOpen =
    displayedData !== null && trigger === 'item'
      ? displayedData !== null
      : (displayedData as AxisInteractionData).x !== null;

  return (
    <NoSsr>
      <React.Fragment>
        {popperOpen && (
          <Popper
            open={popperOpen}
            placement="right-start"
            anchorEl={(displayedData && (displayedData as any).target) || highlightRef.current}
            style={{ padding: '16px', pointerEvents: 'none' }}
          >
            <Paper>
              {trigger === 'item' ? (
                <ItemTooltipContent {...(displayedData as ItemInteractionData)} />
              ) : (
                <AxisTooltipContent {...(displayedData as AxisInteractionData)} />
              )}
            </Paper>
          </Popper>
        )}
        <Highlight ref={highlightRef} />
      </React.Fragment>
    </NoSsr>
  );
}
