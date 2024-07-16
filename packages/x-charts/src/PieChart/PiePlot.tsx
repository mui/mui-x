import * as React from 'react';
import PropTypes from 'prop-types';
import { DrawingContext } from '../context/DrawingProvider';
import { PieArcPlot, PieArcPlotProps, PieArcPlotSlotProps, PieArcPlotSlots } from './PieArcPlot';
import { PieArcLabelPlotSlots, PieArcLabelPlotSlotProps, PieArcLabelPlot } from './PieArcLabelPlot';
import { getPercentageValue } from '../internals/getPercentageValue';
import { getPieCoordinates } from './getPieCoordinates';
import { usePieSeries } from '../hooks/useSeries';

export interface PiePlotSlots extends PieArcPlotSlots, PieArcLabelPlotSlots {}

export interface PiePlotSlotProps extends PieArcPlotSlotProps, PieArcLabelPlotSlotProps {}

export interface PiePlotProps extends Pick<PieArcPlotProps, 'skipAnimation' | 'onItemClick'> {
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
  const { skipAnimation, slots, slotProps, onItemClick } = props;
  const seriesData = usePieSeries();
  const { left, top, width, height } = React.useContext(DrawingContext);

  if (seriesData === undefined) {
    return null;
  }

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
        } = series[seriesId];

        const { cx, cy, availableRadius } = getPieCoordinates(
          { cx: cxParam, cy: cyParam },
          { width, height },
        );

        const outerRadius = getPercentageValue(
          outerRadiusParam ?? availableRadius,
          availableRadius,
        );
        const innerRadius = getPercentageValue(innerRadiusParam ?? 0, availableRadius);
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
              highlighted={highlighted}
              faded={faded}
              onItemClick={onItemClick}
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
        } = series[seriesId];

        const { cx, cy, availableRadius } = getPieCoordinates(
          { cx: cxParam, cy: cyParam },
          { width, height },
        );

        const outerRadius = getPercentageValue(
          outerRadiusParam ?? availableRadius,
          availableRadius,
        );
        const innerRadius = getPercentageValue(innerRadiusParam ?? 0, availableRadius);

        const arcLabelRadius =
          arcLabelRadiusParam === undefined
            ? (outerRadius + innerRadius) / 2
            : getPercentageValue(arcLabelRadiusParam, availableRadius);

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
              slots={slots}
              slotProps={slotProps}
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
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when a pie item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {PieItemIdentifier} pieItemIdentifier The pie item identifier.
   * @param {DefaultizedPieValueType} item The pie item.
   */
  onItemClick: PropTypes.func,
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
