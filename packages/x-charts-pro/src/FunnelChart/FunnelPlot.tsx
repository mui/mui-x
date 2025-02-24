import * as React from 'react';
import PropTypes from 'prop-types';

import { CurveFactory, line as d3Line } from '@mui/x-charts-vendor/d3-shape';
import { getCurveFactory, AxisDefaultized, cartesianSeriesTypes } from '@mui/x-charts/internals';
import { useXAxes, useYAxes } from '@mui/x-charts/hooks';
import { CurveType } from '@mui/x-charts/models';
import { useTheme } from '@mui/material/styles';
import { FunnelItemIdentifier, FunnelDataPoints } from './funnel.types';
import { FunnelSection } from './FunnelSection';
import { alignLabel, positionLabel } from './labelUtils';
import { funnelHorizontalStepCurve, funnelVerticalStepCurve } from './funnelStepCurve';
import { FunnelPlotSlotExtension } from './funnelPlotSlots.types';
import { useFunnelSeriesContext } from '../hooks/useFunnelSeries';

cartesianSeriesTypes.addType('funnel');

export interface FunnelPlotProps extends FunnelPlotSlotExtension {
  /**
   * Callback fired when a funnel item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {FunnelItemIdentifier} funnelItemIdentifier The funnel item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    funnelItemIdentifier: FunnelItemIdentifier,
  ) => void;
}

const getFunnelCurve = (curve: CurveType | undefined, isHorizontal: boolean): CurveFactory => {
  if (curve === 'step') {
    return isHorizontal ? funnelHorizontalStepCurve : funnelVerticalStepCurve;
  }

  return getCurveFactory(curve ?? 'linear');
};

const useAggregatedData = () => {
  const seriesData = useFunnelSeriesContext();
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();

  const allData = React.useMemo(() => {
    if (seriesData === undefined) {
      return [];
    }

    const { series, seriesOrder } = seriesData;
    const defaultXAxisId = xAxisIds[0];
    const defaultYAxisId = yAxisIds[0];

    const isHorizontal = Object.values(series).some((s) => s.layout === 'horizontal');

    const result = seriesOrder.map((seriesId) => {
      const currentSeries = series[seriesId];
      const xAxisId = currentSeries.xAxisId ?? defaultXAxisId;
      const yAxisId = currentSeries.yAxisId ?? defaultYAxisId;

      const valueFormatter = currentSeries.valueFormatter;

      const baseScaleConfig = isHorizontal ? xAxis[xAxisId] : yAxis[yAxisId];

      const isXAxisBand = xAxis[xAxisId].scaleType === 'band';
      const isYAxisBand = yAxis[yAxisId].scaleType === 'band';

      const bandWidth =
        ((isXAxisBand || isYAxisBand) &&
          (baseScaleConfig as AxisDefaultized<'band'>).scale?.bandwidth()) ||
        0;

      const xScale = xAxis[xAxisId].scale;
      const yScale = yAxis[yAxisId].scale;

      const curve = getFunnelCurve(currentSeries.curve, isHorizontal);

      const xPosition = (
        value: number,
        bandIndex: number,
        stackOffset?: number,
        useBand?: boolean,
      ) => {
        if (isXAxisBand) {
          const position = xScale(bandIndex)!;
          return useBand ? position + bandWidth : position;
        }
        return xScale(isHorizontal ? value + (stackOffset || 0) : value)!;
      };

      const yPosition = (
        value: number,
        bandIndex: number,
        stackOffset?: number,
        useBand?: boolean,
      ) => {
        if (isYAxisBand) {
          const position = yScale(bandIndex);
          return useBand ? position! + bandWidth : position!;
        }
        return yScale(isHorizontal ? value : value + (stackOffset || 0))!;
      };

      return currentSeries.dataPoints.map((values, dataIndex) => {
        const color = currentSeries.data[dataIndex].color!;
        const id = `${seriesId}-${dataIndex}`;
        const sectionLabel =
          typeof currentSeries.sectionLabel === 'function'
            ? currentSeries.sectionLabel({
                dataIndex,
                seriesId,
                value: currentSeries.data[dataIndex].value,
              })
            : currentSeries.sectionLabel;

        const line = d3Line<FunnelDataPoints>()
          .x((d) =>
            xPosition(d.x, baseScaleConfig.data?.[dataIndex], d.stackOffset, d.useBandWidth),
          )
          .y((d) =>
            yPosition(d.y, baseScaleConfig.data?.[dataIndex], d.stackOffset, d.useBandWidth),
          )
          .curve(curve);

        return {
          d: line(values)!,
          color,
          id,
          seriesId,
          dataIndex,
          label: sectionLabel !== false && {
            ...positionLabel({
              ...sectionLabel,
              xPosition,
              yPosition,
              isHorizontal,
              values,
              dataIndex,
              baseScaleData: baseScaleConfig.data ?? [],
            }),
            ...alignLabel(sectionLabel ?? {}),
            value: valueFormatter
              ? valueFormatter(currentSeries.data[dataIndex], { dataIndex })
              : currentSeries.data[dataIndex].value?.toLocaleString(),
          },
        };
      });
    });

    return result.flatMap((v) => v.toReversed().flat());
  }, [seriesData, xAxis, xAxisIds, yAxis, yAxisIds]);

  return allData;
};

function FunnelPlot(props: FunnelPlotProps) {
  const { onItemClick, ...other } = props;
  const theme = useTheme();

  const data = useAggregatedData();

  return (
    <React.Fragment>
      {data.map(({ d, color, id, seriesId, dataIndex }) => (
        <FunnelSection
          {...other}
          d={d}
          color={color}
          key={id}
          dataIndex={dataIndex}
          seriesId={seriesId}
          onClick={
            onItemClick &&
            ((event) => {
              onItemClick(event, { type: 'funnel', seriesId, dataIndex });
            })
          }
        />
      ))}
      {data.map(({ id, label }) => {
        if (!label) {
          return null;
        }

        return (
          <text
            key={id}
            x={label.x}
            y={label.y}
            textAnchor={label.textAnchor}
            dominantBaseline={label.dominantBaseline}
            stroke="none"
            pointerEvents="none"
            fontFamily={theme.typography.body2.fontFamily}
            fontSize={theme.typography.body2.fontSize}
            fontSizeAdjust={theme.typography.body2.fontSizeAdjust}
            fontWeight={theme.typography.body2.fontWeight}
            letterSpacing={theme.typography.body2.letterSpacing}
            fontStretch={theme.typography.body2.fontStretch}
            fontStyle={theme.typography.body2.fontStyle}
            fontVariant={theme.typography.body2.fontVariant}
            fill={(theme.vars || theme)?.palette?.text?.primary}
          >
            {label.value}
          </text>
        );
      })}
    </React.Fragment>
  );
}

FunnelPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when a funnel item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {FunnelItemIdentifier} funnelItemIdentifier The funnel item identifier.
   */
  onItemClick: PropTypes.func,
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

export { FunnelPlot };
