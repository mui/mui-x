import * as React from 'react';
import { type BarPlotSlotProps, type BarPlotSlots } from './BarPlot';
import { type BarItemIdentifier } from '../models';
import { BarElement } from './BarElement';
import { type MaskData, type ProcessedBarSeriesData } from './types';
import { useUtilityClasses } from './barClasses';
import { BarClipPath } from './BarClipPath';
import { useRegisterItemClickHandlers } from './useRegisterItemClickHandlers';

export interface IndividualBarPlotProps {
  completedData: ProcessedBarSeriesData[];
  masksData: MaskData[];
  borderRadius?: number;
  skipAnimation?: boolean;
  onItemClick?: (event: MouseEvent, barItemIdentifier: BarItemIdentifier) => void;
  slotProps?: BarPlotSlotProps;
  slots?: BarPlotSlots;
}

export function IndividualBarPlot({
  completedData,
  masksData,
  borderRadius,
  onItemClick,
  skipAnimation,
  ...other
}: IndividualBarPlotProps) {
  useRegisterItemClickHandlers(onItemClick);

  const classes = useUtilityClasses();
  const withoutBorderRadius = !borderRadius || borderRadius <= 0;

  return (
    <React.Fragment>
      {!withoutBorderRadius &&
        masksData.map(
          ({ id, x, y, xOrigin, yOrigin, width, height, hasPositive, hasNegative, layout }) => {
            return (
              <BarClipPath
                key={id}
                maskId={id}
                borderRadius={borderRadius}
                hasNegative={hasNegative}
                hasPositive={hasPositive}
                layout={layout}
                x={x}
                y={y}
                xOrigin={xOrigin}
                yOrigin={yOrigin}
                width={width}
                height={height}
                skipAnimation={skipAnimation ?? false}
              />
            );
          },
        )}
      {completedData.map(({ seriesId, layout, xOrigin, yOrigin, data }) => {
        return (
          <g key={seriesId} data-series={seriesId} className={classes.series}>
            {data.map(({ dataIndex, color, maskId, x, y, width, height }) => {
              const barElement = (
                <BarElement
                  key={dataIndex}
                  seriesId={seriesId}
                  dataIndex={dataIndex}
                  color={color}
                  skipAnimation={skipAnimation ?? false}
                  layout={layout ?? 'vertical'}
                  x={x}
                  xOrigin={xOrigin}
                  y={y}
                  yOrigin={yOrigin}
                  width={width}
                  height={height}
                  cursor={onItemClick ? 'pointer' : undefined}
                  {...other}
                />
              );

              if (withoutBorderRadius) {
                return barElement;
              }

              return (
                <g key={dataIndex} clipPath={`url(#${maskId})`}>
                  {barElement}
                </g>
              );
            })}
          </g>
        );
      })}
    </React.Fragment>
  );
}
