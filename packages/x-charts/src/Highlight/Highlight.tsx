import * as React from 'react';
import { InteractionContext } from '../context/InteractionProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { isBandScale } from '../hooks/useScale';

export type HighlightProps = {
  highlight: {
    x?: boolean;
    y?: boolean;
  };
};

export const Highlight = React.forwardRef<SVGPathElement, HighlightProps>(function Highlight(
  props,
  ref,
) {
  const {
    highlight: { x: xHighlight, y: yHighlight },
  } = props;
  const { xAxisIds, xAxis, yAxisIds, yAxis } = React.useContext(CartesianContext);

  const USED_X_AXIS_ID = xAxisIds[0];
  const USED_Y_AXIS_ID = yAxisIds[0];

  const xScale = xAxis[USED_X_AXIS_ID].scale;
  const yScale = yAxis[USED_Y_AXIS_ID].scale;

  const { axis } = React.useContext(InteractionContext);

  // React.useEffect(() => {
  //   interactionApi?.listenXAxis(USED_X_AXIS_ID);
  //   interactionApi?.listenYAxis(USED_Y_AXIS_ID);
  // }, [USED_X_AXIS_ID, USED_Y_AXIS_ID, interactionApi]);

  if (isBandScale(xScale)) {
    if (axis.x === null) {
      return null;
    }
    const x0 = xScale(axis.x.value)!;
    const w = xScale.bandwidth();
    const y0 = yScale(yScale.domain()[0]);
    const y1 = yScale(yScale.domain().at(-1));

    return (
      <path
        d={`M ${x0} ${y0} L ${x0 + w} ${y0} L ${x0 + w} ${y1} L ${x0} ${y1} Z`}
        fill="gray"
        fillOpacity={0.1}
        ref={ref}
        style={{ pointerEvents: 'none' }}
      />
    );
  }
  return (
    <React.Fragment>
      {xHighlight && axis.x !== null && (
        <path
          d={`M ${xScale(axis.x.value)} ${yScale(yScale.domain()[0])} L ${xScale(
            axis.x.value,
          )} ${yScale(yScale.domain().at(-1))}`}
          stroke="black"
          strokeDasharray="5 2"
          ref={ref}
          style={{ pointerEvents: 'none' }}
        />
      )}
      {yHighlight && axis.y !== null && (
        <path
          d={`M ${xScale(xScale.domain()[0])} ${yScale(axis.y.value)} L ${xScale(
            xScale.domain().at(-1)!,
          )} ${yScale(axis.y.value)}`}
          stroke="black"
          strokeDasharray="5 2"
          style={{ pointerEvents: 'none' }}
        />
      )}
    </React.Fragment>
  );
});
