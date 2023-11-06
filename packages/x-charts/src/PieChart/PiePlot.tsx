import * as React from 'react';
import PropTypes from 'prop-types';
import { SeriesContext } from '../context/SeriesContextProvider';
import { DrawingContext } from '../context/DrawingProvider';
import {
  PieArcPlot,
  PieArcPlotProps,
  PieArcPlotSlotComponentProps,
  PieArcPlotSlotsComponent,
} from './PieArcPlot';
import {
  PieArcLabelPlotSlotsComponent,
  PieArcLabelPlotSlotComponentProps,
  PieArcLabelPlot,
} from './PieArcLabelPlot';

export interface PiePlotSlotsComponent
  extends PieArcPlotSlotsComponent,
    PieArcLabelPlotSlotsComponent {}

export interface PiePlotSlotComponentProps
  extends PieArcPlotSlotComponentProps,
    PieArcLabelPlotSlotComponentProps {}

export interface PiePlotProps extends Pick<PieArcPlotProps, 'skipAnimation' | 'onClick'> {
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
  const { skipAnimation, slots, slotProps, onClick } = props;
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

  return (
    <g>
      {seriesOrder.map((seriesId) => {
        const {
          innerRadius,
          outerRadius,
          cornerRadius,
          paddingAngle,
          data,
          cx,
          cy,
          highlighted,
          faded,
          highlightScope,
        } = series[seriesId];
        return (
          <g
            key={seriesId}
            transform={`translate(${cx === undefined ? center.x : left + cx}, ${
              cy === undefined ? center.y : top + cy
            })`}
          >
            <PieArcPlot
              innerRadius={innerRadius}
              outerRadius={outerRadius ?? availableRadius}
              cornerRadius={cornerRadius}
              paddingAngle={paddingAngle}
              id={seriesId}
              data={data}
              skipAnimation={skipAnimation}
              highlightScope={highlightScope}
              highlighted={highlighted}
              faded={faded}
              onClick={onClick}
              slots={slots}
              slotProps={slotProps}
            />
          </g>
        );
      })}
      {seriesOrder.map((seriesId) => {
        const {
          innerRadius,
          outerRadius,
          cornerRadius,
          paddingAngle,
          arcLabel,
          arcLabelMinAngle,
          data,
          cx,
          cy,
          highlightScope,
        } = series[seriesId];
        return (
          <g
            key={seriesId}
            transform={`translate(${cx === undefined ? center.x : left + cx}, ${
              cy === undefined ? center.y : top + cy
            })`}
          >
            <PieArcLabelPlot
              innerRadius={innerRadius}
              outerRadius={outerRadius ?? availableRadius}
              cornerRadius={cornerRadius}
              paddingAngle={paddingAngle}
              id={seriesId}
              data={data}
              skipAnimation={skipAnimation}
              arcLabel={arcLabel}
              arcLabelMinAngle={arcLabelMinAngle}
              highlightScope={highlightScope}
            />
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
   * If `true`, animations are skiped.
   * @default false
   */
  skipAnimation: PropTypes.bool,
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
