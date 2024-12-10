'use client';
import * as React from 'react';
import { animated, useTransition } from '@react-spring/web';
import { cleanId } from '../internals/cleanId';
import { useChartId, useDrawingArea } from '../hooks';
import { SeriesId } from '../models/seriesType/common';

interface AppearingMaskProps {
  id: SeriesId;
  skipAnimation?: boolean;
  children: React.ReactNode;
}

/**
 * @ignore - internal component.
 */
export function AppearingMask(props: AppearingMaskProps) {
  const drawingArea = useDrawingArea();
  const chartId = useChartId();

  const transitionAppear = useTransition<typeof drawingArea, { animatedWidth: number }>(
    [drawingArea],
    {
      from: (v) => ({ animatedWidth: v.left }),
      enter: (v) => ({ animatedWidth: v.width + v.left + v.right }),
      leave: (v) => ({ animatedWidth: v.width + v.left + v.right }),
      reset: false,
      immediate: props.skipAnimation,
    },
  );

  const clipId = cleanId(`${chartId}-${props.id}`);
  return (
    <React.Fragment>
      <clipPath id={clipId}>
        {transitionAppear((style) => (
          <animated.rect
            // @ts-expect-error
            x={0}
            y={0}
            width={style.animatedWidth}
            height={drawingArea.top + drawingArea.height + drawingArea.bottom}
          />
        ))}
      </clipPath>
      <g clipPath={`url(#${clipId})`}>{props.children}</g>
    </React.Fragment>
  );
}
