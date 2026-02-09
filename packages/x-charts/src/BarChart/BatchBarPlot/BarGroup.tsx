import { styled } from '@mui/material/styles';
import * as React from 'react';
import useId from '@mui/utils/useId';
import { useStore } from '../../internals/store/useStore';
import { selectorChartDrawingArea } from '../../internals/plugins/corePlugins/useChartDimensions';
import { ANIMATION_DURATION_MS } from '../../internals/animation/animation';

const PathGroup = styled('g')({
  '&[data-faded="true"]': {
    opacity: 0.3,
  },
  '& path': {
    /* The browser must do hit testing to know which element a pointer is interacting with.
     * With many data points, we create many paths causing significant time to be spent in the hit test phase.
     * To fix this issue, we disable pointer events for the descendant paths.
     *
     * Ideally, users should be able to override this in case they need pointer events to be enabled,
     * but it can affect performance negatively, especially with many data points. */
    pointerEvents: 'none',
  },
});

interface BarGroupProps extends React.HTMLAttributes<SVGGElement> {
  skipAnimation: boolean;
  layout: 'horizontal' | 'vertical' | undefined;
  xOrigin: number;
  yOrigin: number;
}

export function BarGroup({ skipAnimation, layout, xOrigin, yOrigin, ...props }: BarGroupProps) {
  if (skipAnimation) {
    return <PathGroup {...props} />;
  }

  return <AnimatedGroup {...props} layout={layout} xOrigin={xOrigin} yOrigin={yOrigin} />;
}

interface AnimatedGroupProps extends React.HTMLAttributes<SVGGElement> {
  layout: 'horizontal' | 'vertical' | undefined;
  xOrigin: number;
  yOrigin: number;
}

const AnimatedRect = styled('rect')({
  '@keyframes scaleInX': {
    from: {
      transform: 'scaleX(0)',
    },
    to: {
      transform: 'scaleX(1)',
    },
  },
  '@keyframes scaleInY': {
    from: {
      transform: 'scaleY(0)',
    },
    to: {
      transform: 'scaleY(1)',
    },
  },
  animationDuration: `${ANIMATION_DURATION_MS}ms`,
  animationFillMode: 'forwards',
  '&[data-orientation="horizontal"]': {
    animationName: 'scaleInX',
  },
  '&[data-orientation="vertical"]': {
    animationName: 'scaleInY',
  },
});

function AnimatedGroup({ children, layout, xOrigin, yOrigin, ...props }: AnimatedGroupProps) {
  const store = useStore();
  const drawingArea = store.use(selectorChartDrawingArea);
  const clipPathId = useId();

  const animateChildren: React.ReactNode[] = [];

  if (layout === 'horizontal') {
    animateChildren.push(
      <AnimatedRect
        key="left"
        data-orientation="horizontal"
        x={drawingArea.left}
        width={xOrigin - drawingArea.left}
        y={drawingArea.top}
        height={drawingArea.height}
        style={{
          transformOrigin: `${xOrigin}px ${drawingArea.top + drawingArea.height / 2}px`,
        }}
      />,
    );
    animateChildren.push(
      <AnimatedRect
        key="right"
        data-orientation="horizontal"
        x={xOrigin}
        width={drawingArea.left + drawingArea.width - xOrigin}
        y={drawingArea.top}
        height={drawingArea.height}
        style={{
          transformOrigin: `${xOrigin}px ${drawingArea.top + drawingArea.height / 2}px`,
        }}
      />,
    );
  } else {
    animateChildren.push(
      <AnimatedRect
        key="top"
        data-orientation="vertical"
        x={drawingArea.left}
        width={drawingArea.width}
        y={drawingArea.top}
        height={yOrigin - drawingArea.top}
        style={{
          transformOrigin: `${drawingArea.left + drawingArea.width / 2}px ${yOrigin}px`,
        }}
      />,
    );
    animateChildren.push(
      <AnimatedRect
        key="bottom"
        data-orientation="vertical"
        x={drawingArea.left}
        width={drawingArea.width}
        y={yOrigin}
        height={drawingArea.top + drawingArea.height - yOrigin}
        style={{
          transformOrigin: `${drawingArea.left + drawingArea.width / 2}px ${yOrigin}px`,
        }}
      />,
    );
  }

  return (
    <React.Fragment>
      <clipPath id={clipPathId}>{animateChildren}</clipPath>
      <PathGroup clipPath={`url(#${clipPathId})`} {...props}>
        {children}
      </PathGroup>
    </React.Fragment>
  );
}
