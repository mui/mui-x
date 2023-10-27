import * as React from 'react';
import PropTypes from 'prop-types';
import { SeriesContext } from '../context/SeriesContextProvider';
import PieArc, { PieArcProps } from './PieArc';
import PieArcLabel, { PieArcLabelProps } from './PieArcLabel';
import { DrawingContext } from '../context/DrawingProvider';
import {
  DefaultizedPieValueType,
  PieItemIdentifier,
  PieSeriesType,
} from '../models/seriesType/pie';

const RATIO = 180 / Math.PI;

function getItemLabel(
  arcLabel: PieSeriesType['arcLabel'],
  arcLabelMinAngle: number,
  item: DefaultizedPieValueType,
) {
  if (!arcLabel) {
    return null;
  }
  const angle = (item.endAngle - item.startAngle) * RATIO;
  if (angle < arcLabelMinAngle) {
    return null;
  }

  if (typeof arcLabel === 'string') {
    return item[arcLabel]?.toString();
  }

  return arcLabel(item);
}

export interface PiePlotSlotsComponent {
  pieArc?: React.JSXElementConstructor<PieArcProps>;
  pieArcLabel?: React.JSXElementConstructor<PieArcLabelProps>;
}

export interface PiePlotSlotComponentProps {
  pieArc?: Partial<PieArcProps>;
  pieArcLabel?: Partial<PieArcLabelProps>;
}

export interface PiePlotProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: PiePlotSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: PiePlotSlotComponentProps;
  /**
   * Callback fired when a pie item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {PieItemIdentifier} pieItemIdentifier The pie item identifier.
   * @param {DefaultizedPieValueType} item The pie item.
   */
  onClick?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    pieItemIdentifier: PieItemIdentifier,
    item: DefaultizedPieValueType,
  ) => void;
}

/**
 * Demos:
 *
 * - [Pie](https://mui.com/x/react-charts/pie/)
 * - [Pie demonstration](https://mui.com/x/react-charts/pie-demo/)
 *
 * API:
 *
 * - [PiePlot API](https://mui.com/x/api/charts/pie-plot/)
 */
function PiePlot(props: PiePlotProps) {
  const { slots, slotProps, onClick } = props;
  const seriesData = React.useContext(SeriesContext).pie;
  const { left, top, width, height } = React.useContext(DrawingContext);

  if (seriesData === undefined) {
    return null;
  }
  const availableRadius = Math.min(width, height) / 2;

  const center = {
    x: left + width / 2,
    y: top + height / 2,
  };
  const { series, seriesOrder } = seriesData;

  const Arc = slots?.pieArc ?? PieArc;
  const ArcLabel = slots?.pieArcLabel ?? PieArcLabel;

  return (
    <g>
      {seriesOrder.map((seriesId) => {
        const {
          innerRadius,
          outerRadius,
          cornerRadius,
          arcLabel,
          arcLabelMinAngle = 0,
          data,
          cx,
          cy,
          highlighted,
          faded,
        } = series[seriesId];
        return (
          <g
            key={seriesId}
            transform={`translate(${cx === undefined ? center.x : left + cx}, ${
              cy === undefined ? center.y : top + cy
            })`}
          >
            <g>
              {data.map((item, index) => {
                return (
                  <Arc
                    {...item}
                    key={item.id}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius ?? availableRadius}
                    cornerRadius={cornerRadius}
                    id={seriesId}
                    color={item.color}
                    dataIndex={index}
                    highlightScope={series[seriesId].highlightScope}
                    highlighted={highlighted}
                    faded={faded}
                    onClick={
                      onClick &&
                      ((event) => {
                        onClick(event, { type: 'pie', seriesId, dataIndex: index }, item);
                      })
                    }
                    {...slotProps?.pieArc}
                  />
                );
              })}
              {data.map((item, index) => {
                return (
                  <ArcLabel
                    {...item}
                    key={item.id}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius ?? availableRadius}
                    cornerRadius={cornerRadius}
                    id={seriesId}
                    color={item.color}
                    dataIndex={index}
                    highlightScope={series[seriesId].highlightScope}
                    formattedArcLabel={getItemLabel(arcLabel, arcLabelMinAngle, item)}
                    {...slotProps?.pieArcLabel}
                  />
                );
              })}
            </g>
          </g>
        );
      })}
    </g>
  );
}

PiePlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when a pie item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {PieItemIdentifier} pieItemIdentifier The pie item identifier.
   * @param {DefaultizedPieValueType} item The pie item.
   */
  onClick: PropTypes.func,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
} as any;

export { PiePlot };
