import * as React from 'react';
import PropTypes from 'prop-types';
import { DefaultizedScatterSeriesType } from '../models/seriesType/scatter';
import { getValueToPositionMapper } from '../hooks/useScale';
import {
  getIsFaded,
  getIsHighlighted,
  useInteractionItemProps,
} from '../hooks/useInteractionItemProps';
import { InteractionContext } from '../context/InteractionProvider';
import { D3Scale } from '../models/axis';
import { HighlightScope } from '../context';

export interface ScatterProps {
  series: DefaultizedScatterSeriesType;
  xScale: D3Scale;
  yScale: D3Scale;
  markerSize: number;
  color: string;
}

/**
 * Demos:
 *
 * - [Scatter](https://mui.com/x/react-charts/scatter/)
 * - [Scatter demonstration](https://mui.com/x/react-charts/scatter-demo/)
 *
 * API:
 *
 * - [Scatter API](https://mui.com/x/api/charts/scatter/)
 */
function Scatter(props: ScatterProps) {
  const { series, xScale, yScale, color, markerSize } = props;

  const highlightScope: HighlightScope = React.useMemo(
    () => ({ highlighted: 'item', faded: 'global', ...series.highlightScope }),
    [series.highlightScope],
  );

  const { item, useVoronoiInteraction } = React.useContext(InteractionContext);

  const skipInteractionHandlers = useVoronoiInteraction || series.disableHover;
  const getInteractionItemProps = useInteractionItemProps(highlightScope, skipInteractionHandlers);

  const cleanData = React.useMemo(() => {
    const getXPosition = getValueToPositionMapper(xScale);
    const getYPosition = getValueToPositionMapper(yScale);
    const xRange = xScale.range();
    const yRange = yScale.range();

    const minXRange = Math.min(...xRange);
    const maxXRange = Math.max(...xRange);
    const minYRange = Math.min(...yRange);
    const maxYRange = Math.max(...yRange);

    const temp: {
      x: number;
      y: number;
      id: string | number;
      isHighlighted: boolean;
      isFaded: boolean;
      interactionProps: ReturnType<typeof getInteractionItemProps>;
    }[] = [];

    for (let i = 0; i < series.data.length; i += 1) {
      const scatterPoint = series.data[i];

      const x = getXPosition(scatterPoint.x);
      const y = getYPosition(scatterPoint.y);

      const isInRange = x >= minXRange && x <= maxXRange && y >= minYRange && y <= maxYRange;

      const pointCtx = { type: 'scatter' as const, seriesId: series.id, dataIndex: i };

      if (isInRange) {
        const isHighlighted = getIsHighlighted(item, pointCtx, highlightScope);
        temp.push({
          x,
          y,
          isHighlighted,
          isFaded: !isHighlighted && getIsFaded(item, pointCtx, highlightScope),
          interactionProps: getInteractionItemProps(pointCtx),
          id: scatterPoint.id,
        });
      }
    }

    return temp;
  }, [xScale, yScale, series.data, series.id, item, highlightScope, getInteractionItemProps]);

  return (
    <g>
      {cleanData.map((dataPoint) => (
        <circle
          key={dataPoint.id}
          cx={0}
          cy={0}
          r={(dataPoint.isHighlighted ? 1.2 : 1) * markerSize}
          transform={`translate(${dataPoint.x}, ${dataPoint.y})`}
          fill={color}
          opacity={(dataPoint.isFaded && 0.3) || 1}
          {...dataPoint.interactionProps}
        />
      ))}
    </g>
  );
}

Scatter.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  color: PropTypes.string.isRequired,
  markerSize: PropTypes.number.isRequired,
  series: PropTypes.shape({
    color: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      }),
    ).isRequired,
    disableHover: PropTypes.bool,
    highlightScope: PropTypes.shape({
      faded: PropTypes.oneOf(['global', 'none', 'series']),
      highlighted: PropTypes.oneOf(['item', 'none', 'series']),
    }),
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    markerSize: PropTypes.number,
    type: PropTypes.oneOf(['scatter']).isRequired,
    valueFormatter: PropTypes.func.isRequired,
    xAxisKey: PropTypes.string,
    yAxisKey: PropTypes.string,
  }).isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
} as any;

export { Scatter };
