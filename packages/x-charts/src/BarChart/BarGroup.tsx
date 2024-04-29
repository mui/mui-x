import * as React from 'react';
import { SpringValue, animated, useTransition } from '@react-spring/web';
import useId from '@mui/utils/useId';
import { BarElement } from './BarElement';
import type { CompletedBarData, MaskData } from './BarPlot';
import { BarItemIdentifier } from '../models';
import { getRadius } from './getRadius';

const getOutStyle = ({ layout, yOrigin, x, width, y, xOrigin, height }: CompletedBarData) => ({
  ...(layout === 'vertical'
    ? {
        y: yOrigin,
        x,
        height: 0,
        width,
      }
    : {
        y,
        x: xOrigin,
        height,
        width: 0,
      }),
});

const getInStyle = ({ x, width, y, height }: CompletedBarData) => ({
  y,
  x,
  height,
  width,
});

function BarClipRect(props: Record<string, any>) {
  const radiusData = props.ownerState;

  return (
    <animated.rect
      style={{
        ...props.style,
        clipPath: (
          (props.ownerState.layout === 'vertical'
            ? props.style?.height
            : props.style?.width) as SpringValue<number>
        ).to(
          (value) =>
            `inset(0px round ${Math.min(value, getRadius('top-left', radiusData))}px ${Math.min(value, getRadius('top-right', radiusData))}px ${Math.min(value, getRadius('bottom-right', radiusData))}px ${Math.min(value, getRadius('bottom-left', radiusData))}px)`,
        ),
      }}
    />
  );
}

function BarGroup(props: {
  completedData: CompletedBarData[];
  maskData: MaskData;
  borderRadius?: number;
  skipAnimation?: boolean;
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    barItemIdentifier: BarItemIdentifier,
  ) => void;
}) {
  const maskUniqueId = useId();
  const { completedData, skipAnimation, maskData, onItemClick, borderRadius, ...other } = props;

  const maskTransition = useTransition<MaskData, object>(maskData, {
    from: getOutStyle,
    leave: getOutStyle,
    enter: getInStyle,
    update: getInStyle,
    immediate: skipAnimation,
    config: {
      duration: 2500,
    },
  });

  // fix small values bars
  return (
    <React.Fragment>
      <defs>
        <clipPath id={maskUniqueId}>
          {maskTransition((style, ownerState) => {
            return (
              <BarClipRect
                style={style}
                ownerState={{
                  ...ownerState,
                  borderRadius: borderRadius || 0,
                }}
              />
            );
          })}
        </clipPath>
      </defs>
      <g clipPath={`url(#${maskUniqueId})`}>
        {completedData.map(
          ({ seriesId, dataIndex, color, highlightScope, x, y, height, width }) => {
            return (
              <BarElement
                key={`${seriesId}-${dataIndex}`}
                id={seriesId}
                data-testid={`${seriesId}-${dataIndex}`}
                dataIndex={dataIndex}
                color={color}
                highlightScope={highlightScope}
                {...other}
                onClick={
                  onItemClick &&
                  ((event) => {
                    onItemClick(event, { type: 'bar', seriesId, dataIndex });
                  })
                }
                x={x}
                y={y}
                height={height}
                width={width}
              />
            );
          },
        )}
      </g>
    </React.Fragment>
  );
}

BarGroup.propTypes = {} as any;

export { BarGroup };
