'use client';
import PropTypes from 'prop-types';
import {
  PieArcPlot,
  type PieArcPlotProps,
  type PieArcPlotSlotProps,
  type PieArcPlotSlots,
} from './PieArcPlot';
import {
  type PieArcLabelPlotSlots,
  type PieArcLabelPlotSlotProps,
  PieArcLabelPlot,
} from './PieArcLabelPlot';
import { usePieSeriesContext, usePieSeriesLayout } from '../hooks/usePieSeries';
import { useSkipAnimation } from '../hooks/useSkipAnimation';
import { useUtilityClasses } from './pieClasses';

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
  const { skipAnimation: inSkipAnimation, slots, slotProps, onItemClick } = props;
  const seriesData = usePieSeriesContext();
  const seriesLayout = usePieSeriesLayout();
  const skipAnimation = useSkipAnimation(inSkipAnimation);
  const classes = useUtilityClasses();

  if (seriesData === undefined) {
    return null;
  }

  const { series, seriesOrder } = seriesData;

  return (
    <g>
      {seriesOrder.map((seriesId) => {
        const { cornerRadius, paddingAngle, data, highlighted, faded } = series[seriesId];

        return (
          <g
            key={seriesId}
            className={classes.series}
            transform={`translate(${seriesLayout[seriesId].center.x}, ${seriesLayout[seriesId].center.y})`}
            data-series={seriesId}
          >
            <PieArcPlot
              innerRadius={seriesLayout[seriesId].radius.inner}
              outerRadius={seriesLayout[seriesId].radius.outer}
              cornerRadius={cornerRadius}
              paddingAngle={paddingAngle}
              seriesId={seriesId}
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
        const { cornerRadius, paddingAngle, arcLabel, arcLabelMinAngle, data } = series[seriesId];

        return (
          <g
            key={seriesId}
            className={classes.seriesLabels}
            transform={`translate(${seriesLayout[seriesId].center.x}, ${seriesLayout[seriesId].center.y})`}
            data-series={seriesId}
          >
            <PieArcLabelPlot
              innerRadius={seriesLayout[seriesId].radius.inner}
              outerRadius={seriesLayout[seriesId].radius.outer}
              arcLabelRadius={seriesLayout[seriesId].radius.label}
              cornerRadius={cornerRadius}
              paddingAngle={paddingAngle}
              seriesId={seriesId}
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
