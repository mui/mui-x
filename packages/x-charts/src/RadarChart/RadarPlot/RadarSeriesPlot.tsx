import * as React from 'react';
import { animated, useTransition } from '@react-spring/web';
import { useStringInterpolator } from '../../internals/useStringInterpolator';
import { useInteractionItemProps } from '../../hooks/useInteractionItemProps';

export function RadarSeriesPlot(props: any) {
  const { seriesId, isSeriesHighlighted, isSeriesFaded, points, color, cx, cy } = props;

  const getInteractionItemProps = useInteractionItemProps();

  const d = `M ${points.map((p) => `${p.x} ${p.y}`).join('L')} Z`;
  const stringInterpolator = useStringInterpolator(
    d,
    `M ${points.map(() => `${cx} ${cy}`).join('L')} Z`,
  );

  const transitionArea = useTransition([stringInterpolator], {
    from: { value: 0 },
    to: { value: 1 },
    enter: { value: 1 },
    reset: false,
    // immediate: skipAnimation,
  });

  const transitionDots = useTransition(points, {
    keys: (point) => `${seriesId}-${point.dataIndex}`,
    from: { x: cx, y: cy },
    leave: { x: cx, y: cy },
    enter: (point) => ({ x: point.x, y: point.y }),
    update: (point) => ({ x: point.x, y: point.y }),
    reset: false,
    // immediate: skipAnimation,
  });

  //   const transitionChange = useTransition([stringInterpolator], {
  //     from: { value: 0 },
  //     to: { value: 1 },
  //     enter: { value: 1 },
  //     reset: false,
  //     // immediate: skipAnimation,
  //   });

  //   return transitionChange((style, interpolator) => (
  //     <animated.path
  //       key={seriesId}
  //       stroke={color}
  //       strokeOpacity={isSeriesFaded ? 0.5 : 1}
  //       fill={color}
  //       fillOpacity={isSeriesHighlighted ? 0.8 : 0.1}
  //       {...getInteractionItemProps({ type: 'radar', seriesId })}
  //       d={style.value.to(interpolator)}
  //     />
  //   ));

  //   return <animated.path d={transition(({ x, y }) => `${x} ${y}`).join('L')} fill="black" />;
  return (
    <g>
      {transitionArea((style, interpolator) => (
        <animated.path
          d={style.value.to(interpolator)}
          fill="red"
          stroke={color}
          strokeOpacity={isSeriesFaded ? 0.5 : 1}
          //   fill={color}
          fillOpacity={isSeriesHighlighted ? 0.8 : 0.1}
          {...getInteractionItemProps({ type: 'radar', seriesId })}
        />
      ))}
      {transitionDots((style, { seriesId, dataIndex, color, maskId }) => {
        return <animated.circle cx={style.x} cy={style.y} r={3} fill="red" />;
      })}
    </g>
  );
}
