import { styled } from '@mui/material/styles';
import * as React from 'react';
import useId from '@mui/utils/useId';
import { useStore } from '../../internals/store/useStore';
import { useSelector } from '../../internals/store/useSelector';
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

function AnimatedGroup({ children, layout, xOrigin, yOrigin, ...props }: AnimatedGroupProps) {
  const store = useStore();
  const drawingArea = useSelector(store, selectorChartDrawingArea);
  const clipPathId = useId();

  const animateChildren: React.ReactNode[] = [];

  if (layout === 'horizontal') {
    animateChildren.push(
      <rect
        key="left"
        x={drawingArea.left}
        width={xOrigin - drawingArea.left}
        y={drawingArea.top}
        height={drawingArea.height}
      >
        <animate
          attributeName="x"
          from={xOrigin}
          to={drawingArea.left}
          dur={`${ANIMATION_DURATION_MS}ms`}
          fill="freeze"
        />
        <animate
          attributeName="width"
          from={0}
          to={xOrigin - drawingArea.left}
          dur={`${ANIMATION_DURATION_MS}ms`}
          fill="freeze"
        />
      </rect>,
    );
    animateChildren.push(
      <rect
        key="right"
        x={xOrigin}
        width={drawingArea.left + drawingArea.width - xOrigin}
        y={drawingArea.top}
        height={drawingArea.height}
      >
        <animate
          attributeName="width"
          from={0}
          to={drawingArea.left + drawingArea.width - xOrigin}
          dur={`${ANIMATION_DURATION_MS}ms`}
          fill="freeze"
        />
      </rect>,
    );
  } else {
    animateChildren.push(
      <rect
        key="top"
        x={drawingArea.left}
        width={drawingArea.width}
        y={drawingArea.top}
        height={yOrigin - drawingArea.top}
      >
        <animate
          attributeName="y"
          from={yOrigin}
          to={drawingArea.top}
          dur={`${ANIMATION_DURATION_MS}ms`}
          fill="freeze"
        />
        <animate
          attributeName="height"
          from={0}
          to={yOrigin - drawingArea.top}
          dur={`${ANIMATION_DURATION_MS}ms`}
          fill="freeze"
        />
      </rect>,
    );
    animateChildren.push(
      <rect
        key="bottom"
        x={drawingArea.left}
        width={drawingArea.width}
        y={yOrigin}
        height={drawingArea.top + drawingArea.height - yOrigin}
      >
        <animate
          attributeName="height"
          from={0}
          to={drawingArea.top + drawingArea.height - yOrigin}
          dur={`${ANIMATION_DURATION_MS}ms`}
          fill="freeze"
        />
      </rect>,
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
