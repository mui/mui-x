'use client';
import * as React from 'react';
import { warnOnce } from '@mui/x-internals/warning';
import { ChartPlugin } from '../../models';
import { UseChartPolarAxisSignature } from './useChartPolarAxis.types';
import { useSelector } from '../../../store/useSelector';
import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions/useChartDimensions.selectors';
import { defaultizeAxis } from './defaultizeAxis';
import { selectorChartsInteractionIsInitialized } from '../useChartInteraction';
import {
  selectorChartPolarCenter,
  selectorChartRadiusAxis,
  selectorChartRotationAxis,
} from './useChartPolarAxis.selectors';
import { getSVGPoint } from '../../../getSVGPoint';

export const useChartPolarAxis: ChartPlugin<UseChartPolarAxisSignature<any>> = ({
  params,
  store,
  seriesConfig,
  svgRef,
  instance,
}) => {
  const { rotationAxis, radiusAxis, dataset } = params;

  if (process.env.NODE_ENV !== 'production') {
    const ids = [...(rotationAxis ?? []), ...(radiusAxis ?? [])]
      .filter((axis) => axis.id)
      .map((axis) => axis.id);
    const duplicates = new Set(ids.filter((id, index) => ids.indexOf(id) !== index));
    if (duplicates.size > 0) {
      warnOnce(
        [
          `MUI X: The following axis ids are duplicated: ${Array.from(duplicates).join(', ')}.`,
          `Please make sure that each axis has a unique id.`,
        ].join('\n'),
        'error',
      );
    }
  }

  const drawingArea = useSelector(store, selectorChartDrawingArea);
  const center = useSelector(store, selectorChartPolarCenter);
  const isInteractionEnabled = useSelector(store, selectorChartsInteractionIsInitialized);
  const { axis: rotationAxisWithScale, axisIds: rotationAxisIds } = useSelector(
    store,
    selectorChartRotationAxis,
  );
  const { axis: radiusAxisWithScale, axisIds: radiusAxisIds } = useSelector(
    store,
    selectorChartRadiusAxis,
  );

  // The effect do not track any value defined synchronously during the 1st render by hooks called after `useChartPolarAxis`
  // As a consequence, the state generated by the 1st run of this useEffect will always be equal to the initialization one
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    store.update((prev) => ({
      ...prev,
      polarAxis: {
        ...prev.polarAxis,
        rotation: defaultizeAxis(rotationAxis, dataset, 'rotation'),
        radius: defaultizeAxis(radiusAxis, dataset, 'radius'),
      },
    }));
  }, [seriesConfig, drawingArea, rotationAxis, radiusAxis, dataset, store]);

  const svg2rotation = React.useCallback(
    (x: number, y: number) => Math.atan2(x - center.cx, center.cy - y),
    [center.cx, center.cy],
  );

  const svg2polar = React.useCallback(
    (x: number, y: number): [number, number] => {
      const angle = Math.atan2(x - center.cx, center.cy - y);
      return [Math.sqrt((x - center.cx) ** 2 + (center.cy - y) ** 2), angle];
    },
    [center.cx, center.cy],
  );

  const polar2svg = React.useCallback(
    (radius: number, rotation: number): [number, number] => {
      return [center.cx + radius * Math.sin(rotation), center.cy - radius * Math.cos(rotation)];
    },
    [center.cx, center.cy],
  );
  const usedRotationAxisId = rotationAxisIds[0];
  const usedRadiusAxisId = radiusAxisIds[0];

  // Use a ref to avoid rerendering on every mousemove event.
  const mousePosition = React.useRef({
    isInChart: false,
    x: -1,
    y: -1,
  });

  React.useEffect(() => {
    const element = svgRef.current;
    if (!isInteractionEnabled || element === null || params.disableAxisListener) {
      return () => {};
    }

    const handleOut = () => {
      mousePosition.current = {
        isInChart: false,
        x: -1,
        y: -1,
      };

      instance.cleanInteraction?.();
    };

    const handleMove = (event: MouseEvent | TouchEvent) => {
      const target = 'targetTouches' in event ? event.targetTouches[0] : event;
      const svgPoint = getSVGPoint(element, target);

      mousePosition.current.x = svgPoint.x;
      mousePosition.current.y = svgPoint.y;

      // Test if it's in the drawing area
      if (!instance.isPointInside(svgPoint, { targetElement: event.target as SVGElement })) {
        if (mousePosition.current.isInChart) {
          instance?.cleanInteraction();
          mousePosition.current.isInChart = false;
        }
        return;
      }

      // Test if it's in the radar circle
      const radiusSquare = (center.cx - svgPoint.x) ** 2 + (center.cy - svgPoint.y) ** 2;
      const maxRadius = radiusAxisWithScale[usedRadiusAxisId].scale.range()[1];

      if (radiusSquare > maxRadius ** 2) {
        if (mousePosition.current.isInChart) {
          instance?.cleanInteraction();
          mousePosition.current.isInChart = false;
        }
        return;
      }

      mousePosition.current.isInChart = true;
      instance.setPointerCoordinate?.(svgPoint);
    };

    const handleDown = (event: PointerEvent) => {
      const target = event.currentTarget;
      if (!target) {
        return;
      }

      if ((target as HTMLElement).hasPointerCapture(event.pointerId)) {
        (target as HTMLElement).releasePointerCapture(event.pointerId);
      }
    };

    element.addEventListener('pointerdown', handleDown);
    element.addEventListener('pointermove', handleMove);
    element.addEventListener('pointerout', handleOut);
    element.addEventListener('pointercancel', handleOut);
    element.addEventListener('pointerleave', handleOut);
    return () => {
      element.removeEventListener('pointerdown', handleDown);
      element.removeEventListener('pointermove', handleMove);
      element.removeEventListener('pointerout', handleOut);
      element.removeEventListener('pointercancel', handleOut);
      element.removeEventListener('pointerleave', handleOut);
    };
  }, [
    svgRef,
    store,
    center,
    radiusAxisWithScale,
    usedRadiusAxisId,
    rotationAxisWithScale,
    usedRotationAxisId,
    instance,
    params.disableAxisListener,
    isInteractionEnabled,
    svg2rotation,
  ]);

  return {
    instance: {
      svg2polar,
      svg2rotation,
      polar2svg,
    },
  };
};

useChartPolarAxis.params = {
  rotationAxis: true,
  radiusAxis: true,
  dataset: true,
  disableAxisListener: true,
};

useChartPolarAxis.getInitialState = (params) => ({
  polarAxis: {
    rotation: defaultizeAxis(params.rotationAxis, params.dataset, 'rotation'),
    radius: defaultizeAxis(params.radiusAxis, params.dataset, 'radius'),
  },
});
