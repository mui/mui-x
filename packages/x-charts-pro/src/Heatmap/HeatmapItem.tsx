import * as React from 'react';
import { useItemHighlighted } from '@mui/x-charts/context';
import { useInteractionItemProps, SeriesId } from '@mui/x-charts/internals';

interface HeatmapItemProps {
  dataIndex: number;
  seriesId: SeriesId;
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
}

export function HeatmapItem(props: HeatmapItemProps) {
  const { dataIndex, seriesId, width, height, x, y, color } = props;

  const getInteractionItemProps = useInteractionItemProps();
  const { isFaded, isHighlighted } = useItemHighlighted({
    seriesId,
    dataIndex,
  });

  return (
    <rect
      width={width}
      height={height}
      x={x}
      y={y}
      fill={color}
      {...getInteractionItemProps({ type: 'heatmap', seriesId, dataIndex })}
      style={{
        filter: (isHighlighted && 'saturate(120%)') || (isFaded && 'saturate(80%)') || undefined,
      }}
    />
  );
}
