'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import { ScatterMarker, ScatterMarkerOwnerState, ScatterMarkerProps } from './ScatterMarker';
import {
  DefaultizedScatterSeriesType,
  ScatterItemIdentifier,
  ScatterValueType,
} from '../models/seriesType/scatter';
import { getValueToPositionMapper } from '../hooks/useScale';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { useStore } from '../internals/store/useStore';
import { useSelector } from '../internals/store/useSelector';
import { D3Scale } from '../models/axis';
import { useItemHighlightedGetter } from '../hooks/useItemHighlightedGetter';
import {
  selectorChartsVoronoiIsVoronoiEnabled,
  UseChartVoronoiSignature,
} from '../internals/plugins/featurePlugins/useChartVoronoi';
import { useChartContext } from '../context/ChartProvider';

export interface ScatterProps {
  series: DefaultizedScatterSeriesType;
  xScale: D3Scale;
  yScale: D3Scale;
  color: string;
  colorGetter?: (dataIndex: number) => string;
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    scatterItemIdentifier: ScatterItemIdentifier,
  ) => void;
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
function Scatter(props: ScatterProps) {
  const { series, xScale, yScale, color, colorGetter, onItemClick, slots, slotProps } = props;

  const { instance } = useChartContext();
  const store = useStore<[UseChartVoronoiSignature]>();
  const isVoronoiEnabled = useSelector(store, selectorChartsVoronoiIsVoronoiEnabled);

  const skipInteractionHandlers = isVoronoiEnabled || series.disableHover;
  const getInteractionItemProps = useInteractionItemProps(skipInteractionHandlers);
  const { isFaded, isHighlighted } = useItemHighlightedGetter();

  const cleanData = React.useMemo(() => {
    const getXPosition = getValueToPositionMapper(xScale);
    const getYPosition = getValueToPositionMapper(yScale);

    const temp: (ScatterValueType & {
      dataIndex: number;
      color: string;
      isHighlighted: boolean;
      isFaded: boolean;
      interactionProps: ReturnType<typeof getInteractionItemProps>;
    })[] = [];

    for (let i = 0; i < series.data.length; i += 1) {
      const scatterPoint = series.data[i];

      const x = getXPosition(scatterPoint.x);
      const y = getYPosition(scatterPoint.y);

      const isInRange = instance.isPointInside({ x, y });

      const pointCtx = { type: 'scatter' as const, seriesId: series.id, dataIndex: i };

      if (isInRange) {
        const currentItem = {
          seriesId: pointCtx.seriesId,
          dataIndex: pointCtx.dataIndex,
        };
        const isItemHighlighted = isHighlighted(currentItem);
        temp.push({
          x,
          y,
          isHighlighted: isItemHighlighted,
          isFaded: !isItemHighlighted && isFaded(currentItem),
          interactionProps: getInteractionItemProps(pointCtx),
          id: scatterPoint.id,
          dataIndex: i,
          color: colorGetter ? colorGetter(i) : color,
        });
      }
    }

    return temp;
  }, [
    xScale,
    yScale,
    series.data,
    series.id,
    isHighlighted,
    isFaded,
    getInteractionItemProps,
    colorGetter,
    color,
    instance,
  ]);

  return (
    <g>
      {cleanData.map((dataPoint) => (
        <ScatterMarkerElement
          key={dataPoint.id ?? dataPoint.dataIndex}
          id={series.id}
          dataIndex={dataPoint.dataIndex}
          color={dataPoint.color}
          isHighlighted={dataPoint.isHighlighted}
          isFaded={dataPoint.isFaded}
          x={dataPoint.x}
          y={dataPoint.y}
          onItemClick={
            onItemClick &&
            ((event) =>
              onItemClick(event, {
                type: 'scatter',
                seriesId: series.id,
                dataIndex: dataPoint.dataIndex,
              }))
          }
          interactionProps={dataPoint.interactionProps}
          slots={slots}
          slotProps={slotProps}
        />
      ))}
    </g>
  );
}

export interface ScatterMarkerElementProps extends ScatterMarkerOwnerState {
  slots?: ScatterMarkerSlots;
  slotProps?: ScatterMarkerSlotProps;
  onItemClick: ScatterMarkerProps['onClick'];
  interactionProps: ReturnType<ReturnType<typeof useInteractionItemProps>>;
}

export interface ScatterMarkerSlots {
  /**
   * The component that renders the marker for a scatter point.
   * @default ScatterMarker
   */
  marker?: React.JSXElementConstructor<ScatterMarkerProps>;
}

export interface ScatterMarkerSlotProps {
  marker?: ScatterMarkerProps;
}

function ScatterMarkerElement({
  id,
  x,
  y,
  onItemClick,
  dataIndex,
  color,
  isHighlighted,
  isFaded,
  interactionProps,
  slots,
  slotProps,
}: ScatterMarkerElementProps) {
  const Marker = slots?.marker ?? ScatterMarker;

  const ownerState = {
    id,
    dataIndex,
    color,
    isFaded,
    isHighlighted,
    x,
    y,
  };

  const markerProps = useSlotProps({
    elementType: Marker,
    externalSlotProps: slotProps?.marker,
    additionalProps: {
      onClick: onItemClick,
      cursor: onItemClick ? 'pointer' : 'unset',
      ...interactionProps,
    },
    ownerState,
  });

  return <Marker {...markerProps} />;
}

ScatterMarkerElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  color: PropTypes.string.isRequired,
  dataIndex: PropTypes.number.isRequired,
  /**
   * ID of the series this marker belongs to.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  interactionProps: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.shape({
      onPointerDown: PropTypes.func.isRequired,
      onPointerEnter: PropTypes.func.isRequired,
      onPointerLeave: PropTypes.func.isRequired,
    }),
  ]).isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  onItemClick: PropTypes.func,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
} as any;

Scatter.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  color: PropTypes.string.isRequired,
  colorGetter: PropTypes.func,
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
   */
  onItemClick: PropTypes.func,
  series: PropTypes.object.isRequired,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
} as any;

export { Scatter };
