import * as React from 'react';
import PropTypes from 'prop-types';
import { SeriesContext } from '../context/SeriesContextProvider';
import { DrawingContext } from '../context/DrawingProvider';
import { PieArcPlot, PieArcPlotProps, PieArcPlotSlotProps, PieArcPlotSlots } from './PieArcPlot';
import { PieArcLabelPlotSlots, PieArcLabelPlotSlotProps, PieArcLabelPlot } from './PieArcLabelPlot';
import { getPercentageValue } from '../internals/utils';

export interface PiePlotSlots extends PieArcPlotSlots, PieArcLabelPlotSlots {}

export interface PiePlotSlotProps extends PieArcPlotSlotProps, PieArcLabelPlotSlotProps {}

export interface PiePlotProps extends Pick<PieArcPlotProps, 'skipAnimation' | 'onClick'> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: PiePlotSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: PiePlotSlotProps;
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

  const { series, seriesOrder } = seriesData;

  return (
    <g>
      {seriesOrder.map((seriesId) => {
        const {
          innerRadius: innerRadiusParam,
          outerRadius: outerRadiusParam,
          cornerRadius,
          paddingAngle,
          data,
          cx: cxParam,
          cy: cyParam,
          highlighted,
          faded,
          highlightScope,
        } = series[seriesId];

        const outerRadius = getPercentageValue(
          outerRadiusParam ?? availableRadius,
          availableRadius,
        );
        const innerRadius = getPercentageValue(innerRadiusParam ?? 0, availableRadius);
        const cx = getPercentageValue(cxParam ?? '50%', width);
        const cy = getPercentageValue(cyParam ?? '50%', height);
        return (
          <g key={seriesId} transform={`translate(${left + cx}, ${top + cy})`}>
            <PieArcPlot
              innerRadius={innerRadius}
              outerRadius={outerRadius}
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
          innerRadius: innerRadiusParam,
          outerRadius: outerRadiusParam,
          arcLabelRadius: arcLabelRadiusParam,
          cornerRadius,
          paddingAngle,
          arcLabel,
          arcLabelMinAngle,
          data,
          cx: cxParam,
          cy: cyParam,
          highlightScope,
        } = series[seriesId];
        const outerRadius = getPercentageValue(
          outerRadiusParam ?? availableRadius,
          availableRadius,
        );
        const innerRadius = getPercentageValue(innerRadiusParam ?? 0, availableRadius);

        const arcLabelRadius =
          arcLabelRadiusParam === undefined
            ? (outerRadius + innerRadius) / 2
            : getPercentageValue(arcLabelRadiusParam, availableRadius);

        const cx = getPercentageValue(cxParam ?? '50%', width);
        const cy = getPercentageValue(cyParam ?? '50%', height);
        return (
          <g key={seriesId} transform={`translate(${left + cx}, ${top + cy})`}>
            <PieArcLabelPlot
              innerRadius={innerRadius}
              outerRadius={outerRadius ?? availableRadius}
              arcLabelRadius={arcLabelRadius}
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
   * If `true`, animations are skipped.
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
