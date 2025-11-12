import * as React from 'react';
import { BarPlotSlotProps, BarPlotSlots } from './BarPlot';
import { BarItemIdentifier } from '../models';
import { BarElement } from './BarElement';
import { ProcessedBarSeriesData } from './types';
import { useUtilityClasses } from './barClasses';

interface BatchBarPlot {
  completedData: ProcessedBarSeriesData[];
  borderRadius?: number;
  skipAnimation?: boolean;
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    barItemIdentifier: BarItemIdentifier,
  ) => void;
  slotProps?: BarPlotSlotProps;
  slots?: BarPlotSlots;
}

export function BatchBarPlot({
  completedData,
  borderRadius,
  onItemClick,
  skipAnimation,
  ...other
}: BatchBarPlot) {
  const classes = useUtilityClasses();
  const withoutBorderRadius = !borderRadius || borderRadius <= 0;

  return (
    <React.Fragment>
      {completedData.map(({ seriesId, layout, xOrigin, yOrigin, data }) => {
        return (
          <g key={seriesId} data-series={seriesId} className={classes.series}>
            {data.map(({ dataIndex, color, maskId, x, y, width, height }) => {
              const barElement = (
                <BarElement
                  key={dataIndex}
                  id={seriesId}
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
                  {...other}
                  onClick={
                    onItemClick &&
                    ((event) => {
                      onItemClick(event, { type: 'bar', seriesId, dataIndex });
                    })
                  }
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
