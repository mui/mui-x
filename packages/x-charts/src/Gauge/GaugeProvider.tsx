// @ignore - do not document.
import * as React from 'react';
import { getPercentageValue } from '../internals/getPercentageValue';
import { getArcRatios, getAvailableRadius } from './utils';
import { useDrawingArea } from '../hooks/useDrawingArea';

interface CircularConfig {
  /**
   * The start angle (deg).
   * @default 0
   */
  startAngle?: number;
  /**
   * The end angle (deg).
   * @default 360
   */
  endAngle?: number;
  /**
   * The radius between circle center and the beginning of the arc.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the maximal radius that fit into the drawing area.
   * @default '80%'
   */
  innerRadius?: number | string;
  /**
   * The radius between circle center and the end of the arc.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the maximal radius that fit into the drawing area.
   * @default '100%'
   */
  outerRadius?: number | string;
  /**
   * The radius applied to arc corners (similar to border radius).
   * Set it to '50%' to get rounded arc.
   * @default 0
   */
  cornerRadius?: number | string;
  /**
   * The x coordinate of the arc center.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the width the drawing area.
   */
  cx?: number | string;
  /**
   * The y coordinate of the arc center.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the height the drawing area.
   */
  cy?: number | string;
}

interface ProcessedCircularConfig {
  /**
   * The start angle (rad).
   */
  startAngle: number;
  /**
   * The end angle (rad).
   */
  endAngle: number;
  /**
   * The radius between circle center and the beginning of the arc.
   */
  innerRadius: number;
  /**
   * The radius between circle center and the end of the arc.
   */
  outerRadius: number;
  /**
   * The radius applied to arc corners (similar to border radius).
   */
  cornerRadius: number;
  /**
   * The x coordinate of the pie center.
   */
  cx: number;
  /**
   * The y coordinate of the pie center.
   */
  cy: number;
}

interface GaugeConfig {
  /**
   * The value of the gauge.
   * Set to `null` to not display a value.
   */
  value?: number | null;
  /**
   * The minimal value of the gauge.
   * @default 0
   */
  valueMin?: number;
  /**
   * The maximal value of the gauge.
   * @default 100
   */
  valueMax?: number;
}

export const GaugeContext = React.createContext<
  Required<GaugeConfig> &
    ProcessedCircularConfig & {
      /**
       * The maximal radius from (cx, cy) that fits the arc in the drawing area.
       */
      maxRadius: number;
      /**
       * The angle (rad) associated to the current value.
       */
      valueAngle: null | number;
    }
>({
  value: null,
  valueMin: 0,
  valueMax: 0,
  startAngle: 0,
  endAngle: 0,
  innerRadius: 0,
  outerRadius: 0,
  cornerRadius: 0,
  cx: 0,
  cy: 0,
  maxRadius: 0,
  valueAngle: null,
});

if (process.env.NODE_ENV !== 'production') {
  GaugeContext.displayName = 'GaugeContext';
}

export interface GaugeProviderProps extends GaugeConfig, CircularConfig {
  children: React.ReactNode;
}

export function GaugeProvider(props: GaugeProviderProps) {
  const {
    value = null,
    valueMin = 0,
    valueMax = 100,
    startAngle = 0,
    endAngle = 360,
    outerRadius: outerRadiusParam,
    innerRadius: innerRadiusParam,
    cornerRadius: cornerRadiusParam,
    cx: cxParam,
    cy: cyParam,
    children,
  } = props;

  const { left, top, width, height } = useDrawingArea();

  const ratios = getArcRatios(startAngle, endAngle);

  const innerCx = cxParam ? getPercentageValue(cxParam, width) : ratios.cx * width;
  const innerCy = cyParam ? getPercentageValue(cyParam, height) : ratios.cy * height;

  let cx = left + innerCx;
  let cy = top + innerCy;

  const maxRadius = getAvailableRadius(innerCx, innerCy, width, height, ratios);

  // If the center is not defined, after computation of the available radius, update the center to use the remaining space.
  if (cxParam === undefined) {
    const usedWidth = maxRadius * (ratios.maxX - ratios.minX);
    cx = left + (width - usedWidth) / 2 + ratios.cx * usedWidth;
  }
  if (cyParam === undefined) {
    const usedHeight = maxRadius * (ratios.maxY - ratios.minY);
    cy = top + (height - usedHeight) / 2 + ratios.cy * usedHeight;
  }

  const outerRadius = getPercentageValue(outerRadiusParam ?? maxRadius, maxRadius);
  const innerRadius = getPercentageValue(innerRadiusParam ?? '80%', maxRadius);
  const cornerRadius = getPercentageValue(cornerRadiusParam ?? 0, outerRadius - innerRadius);

  const contextValue = React.useMemo(() => {
    const startAngleRad = (Math.PI * startAngle) / 180;
    const endAngleRad = (Math.PI * endAngle) / 180;
    return {
      value,
      valueMin,
      valueMax,
      startAngle: startAngleRad,
      endAngle: endAngleRad,
      outerRadius,
      innerRadius,
      cornerRadius,
      cx,
      cy,
      maxRadius,
      valueAngle:
        value === null
          ? null
          : startAngleRad +
            ((endAngleRad - startAngleRad) * (value - valueMin)) / (valueMax - valueMin),
    };
  }, [
    value,
    valueMin,
    valueMax,
    startAngle,
    endAngle,
    outerRadius,
    innerRadius,
    cornerRadius,
    cx,
    cy,
    maxRadius,
  ]);

  return <GaugeContext.Provider value={contextValue}>{children}</GaugeContext.Provider>;
}

export function useGaugeState() {
  return React.useContext(GaugeContext);
}
