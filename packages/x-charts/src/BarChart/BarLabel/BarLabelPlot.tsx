import type { ProcessedBarSeriesData } from '../types';
import { BarLabelItem, BarLabelItemProps } from './BarLabelItem';
import { useUtilityClasses } from '../barClasses';

type BarLabelPlotProps = {
  processedSeries: ProcessedBarSeriesData;
  skipAnimation?: boolean;
  barLabel?: BarLabelItemProps['barLabel'];
};

/**
 * @ignore - internal component.
 */
function BarLabelPlot(props: BarLabelPlotProps) {
  const { processedSeries, skipAnimation, ...other } = props;
  const { seriesId, data, layout, xOrigin, yOrigin } = processedSeries;
  const classes = useUtilityClasses();

  const barLabel = processedSeries.barLabel ?? props.barLabel;

  if (!barLabel) {
    return null;
  }

  return (
    <g key={seriesId} className={classes.seriesLabels} data-series={seriesId}>
      {data.map(({ x, y, dataIndex, color, value, width, height }) => (
        <BarLabelItem
          key={dataIndex}
          seriesId={seriesId}
          dataIndex={dataIndex}
          value={value}
          color={color}
          xOrigin={xOrigin}
          yOrigin={yOrigin}
          x={x}
          y={y}
          width={width}
          height={height}
          skipAnimation={skipAnimation ?? false}
          layout={layout ?? 'vertical'}
          {...other}
          barLabel={barLabel}
          barLabelPlacement={processedSeries.barLabelPlacement || 'center'}
        />
      ))}
    </g>
  );
}

export { BarLabelPlot };
