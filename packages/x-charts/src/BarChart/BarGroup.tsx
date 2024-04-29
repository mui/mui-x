import * as React from 'react';
import { animated, useTransition } from '@react-spring/web';
import useId from '@mui/utils/useId';
import { styled } from '@mui/material/styles';
import { BarElement } from './BarElement';
import type { CompletedBarData, MaskData } from './BarPlot';
import { BarItemIdentifier } from '../models';

const getRadius = (
  edge: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left',
  hasNegative: boolean,
  hasPositive: boolean,
  borderRadius: number | undefined,
  isVertical: boolean,
) => {
  if (!borderRadius) {
    return 0;
  }

  if (edge === 'top-left' && ((isVertical && hasPositive) || hasNegative)) {
    return borderRadius;
  }

  if (edge === 'top-right' && (isVertical || hasPositive)) {
    return borderRadius;
  }

  if ((edge === 'bottom-right' && !isVertical && hasPositive) || hasNegative) {
    return borderRadius;
  }

  if (edge === 'bottom-left' && !isVertical && hasNegative) {
    return borderRadius;
  }

  return 0;
};

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

const BarClipRect = styled(animated.rect, {
  name: 'MuiBarClipRect',
  slot: 'Root',
})();

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
  });

  const { hasNegative, layout } = maskData;
  const isVertical = layout === 'vertical';

  const radius = {
    topLeft: getRadius('top-left', hasNegative, maskData.hasPositive, borderRadius, isVertical),
    topRight: getRadius('top-right', hasNegative, maskData.hasPositive, borderRadius, isVertical),
    bottomRight: getRadius(
      'bottom-right',
      hasNegative,
      maskData.hasPositive,
      borderRadius,
      isVertical,
    ),
    bottomLeft: getRadius(
      'bottom-left',
      hasNegative,
      maskData.hasPositive,
      borderRadius,
      isVertical,
    ),
  };

  // fix small values bars
  return (
    <React.Fragment>
      <defs>
        <clipPath id={maskUniqueId}>
          {maskTransition((style) => {
            return (
              <BarClipRect
                style={style}
                clipPath={`inset(0px round ${radius.topLeft}px ${radius.topRight}px ${radius.bottomRight}px ${radius.bottomLeft}px)`}
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
