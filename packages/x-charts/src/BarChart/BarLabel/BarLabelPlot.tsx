import * as React from 'react';
import PropTypes from 'prop-types';
import { useTransition } from '@react-spring/web';
import type { AnimationData, CompletedBarData } from '../types';
import { BarLabelItem, BarLabelItemProps } from './BarLabelItem';

const leaveStyle = ({ layout, yOrigin, x, width, y, xOrigin, height }: AnimationData) => ({
  ...(layout === 'vertical'
    ? {
        y: yOrigin,
        x: x + width / 2,
        height: 0,
        width,
      }
    : {
        y: y + height / 2,
        x: xOrigin,
        height,
        width: 0,
      }),
});

const enterStyle = ({ x, width, y, height }: AnimationData) => ({
  x: x + width / 2,
  y: y + height / 2,
  height,
  width,
});

type BarLabelPlotProps = {
  bars: CompletedBarData[];
  skipAnimation?: boolean;
  barLabel?: BarLabelItemProps['barLabel'];
};

/**
 * @ignore - internal component.
 */
function BarLabelPlot(props: BarLabelPlotProps) {
  const { bars, skipAnimation, ...other } = props;

  const barLabelTransition = useTransition(bars, {
    keys: (bar) => `${bar.seriesId}-${bar.dataIndex}`,
    from: leaveStyle,
    leave: null,
    enter: enterStyle,
    update: enterStyle,
    immediate: skipAnimation,
  });

  return (
    <React.Fragment>
      {barLabelTransition((style, { seriesId, dataIndex, color, value, width, height }) => (
        <BarLabelItem
          seriesId={seriesId}
          dataIndex={dataIndex}
          value={value}
          color={color}
          width={width}
          height={height}
          {...other}
          style={style}
        />
      ))}
    </React.Fragment>
  );
}

BarLabelPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  barLabel: PropTypes.oneOfType([PropTypes.oneOf(['value']), PropTypes.func]),
  bars: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      dataIndex: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      layout: PropTypes.oneOf(['horizontal', 'vertical']),
      maskId: PropTypes.string.isRequired,
      seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      value: PropTypes.number,
      width: PropTypes.number.isRequired,
      x: PropTypes.number.isRequired,
      xOrigin: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      yOrigin: PropTypes.number.isRequired,
    }),
  ).isRequired,
  skipAnimation: PropTypes.bool,
} as any;

export { BarLabelPlot };
