'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { ScatterMarkerSlotProps, ScatterMarkerSlots } from './ScatterMarker.types';
import {
  DefaultizedScatterSeriesType,
  ScatterItemIdentifier,
  ScatterValueType,
} from '../models/seriesType/scatter';
import { useStore } from '../internals/store/useStore';
import { useSelector } from '../internals/store/useSelector';
import { D3Scale } from '../models/axis';
import {
  selectorChartsVoronoiIsVoronoiEnabled,
  UseChartVoronoiSignature,
} from '../internals/plugins/featurePlugins/useChartVoronoi';
import { ScatterMarker } from './ScatterMarker';
import { ColorGetter } from '../internals/plugins/models/seriesConfig';
import { ScatterClasses, useUtilityClasses } from './scatterClasses';
import { useChartContext } from '../context/ChartProvider';
import { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import { UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import { SeriesId } from '../models/seriesType/common';
import { getValueToPositionMapper } from '../hooks/useScale';

export interface ScatterProps {
  series: DefaultizedScatterSeriesType;
  xScale: D3Scale;
  yScale: D3Scale;
  color: string;
  colorGetter?: ColorGetter<'scatter'>;
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    scatterItemIdentifier: ScatterItemIdentifier,
  ) => void;
  classes?: Partial<ScatterClasses>;
  slots?: ScatterSlots;
  slotProps?: ScatterSlotProps;
}

export interface ScatterSlots extends ScatterMarkerSlots {}

export interface ScatterSlotProps extends ScatterMarkerSlotProps {}

/**
 * Demos:
 *
 * - [Scatter](https://mui.com/x/react-charts/scatter/)
 * - [Scatter demonstration](https://mui.com/x/react-charts/scatter-demo/)
 *
 * API:
 *
 * - [Scatter API](https://mui.com/x/api/charts/scatter/)
 */
function FastScatter(props: ScatterProps) {
  const {
    series,
    xScale,
    yScale,
    color,
    colorGetter,
    onItemClick,
    classes: inClasses,
    slots,
    slotProps,
  } = props;

  const { instance } =
    useChartContext<[UseChartInteractionSignature, UseChartHighlightSignature]>();
  const store = useStore<[UseChartVoronoiSignature]>();
  const isVoronoiEnabled = useSelector(store, selectorChartsVoronoiIsVoronoiEnabled);

  const getXPosition = getValueToPositionMapper(xScale);
  const getYPosition = getValueToPositionMapper(yScale);

  const temp: (ScatterValueType & {
    dataIndex: number;
    seriesId: SeriesId;
    type: 'scatter';
  })[] = [];

  const MAX_POINTS_PER_PATH = 1000;
  let points = 0;
  const paths: string[] = [];
  let path = '';
  const markerSize = series.markerSize ?? 1;
  const radius = markerSize / 2;
  for (let i = 0; i < series.data.length; i += 1) {
    const scatterPoint = series.data[i];

    const x = getXPosition(scatterPoint.x);
    const y = getYPosition(scatterPoint.y);

    const isInRange = instance.isPointInside(x, y);

    if (isInRange) {
      temp.push({
        x,
        y,
        id: scatterPoint.id,
        seriesId: series.id,
        type: 'scatter',
        dataIndex: i,
      });
      points += 1;
      path += `M${x + radius} ${y + radius} A${radius} ${radius} 0 1 1 ${x + radius} ${y + radius - 0.01}`;
    }

    if (points >= MAX_POINTS_PER_PATH) {
      paths.push(path);
      path = '';
      points = 0;
    }
  }

  if (path !== '') {
    paths.push(path);
  }

  const Marker = slots?.marker ?? ScatterMarker;
  const { ownerState, ...markerProps } = useSlotProps({
    elementType: Marker,
    externalSlotProps: slotProps?.marker,
    additionalProps: {
      seriesId: series.id,
      size: series.markerSize,
    },
    ownerState: {},
  });

  const classes = useUtilityClasses(inClasses);

  return (
    <g data-series={series.id} className={classes.root}>
      {paths.map((path, i) => (
        <path key={i} fill={color} d={path} />
      ))}
    </g>
  );
}

export { FastScatter };
