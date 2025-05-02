/* eslint-disable class-methods-use-this */
import { CurveGenerator } from '@mui/x-charts-vendor/d3-shape';
import { Point } from './curve.types';
import { borderRadiusBumpPolygon } from './borderRadiusBumpPolygon';

/**
 * This is a custom "bump" curve generator.
 * It draws smooth curves for the 4 provided points,
 * with the option to add a gap between sections while also properly handling the border radius.
 *
 * The implementation is based on the d3-shape bump curve generator.
 * https://github.com/d3/d3-shape/blob/a82254af78f08799c71d7ab25df557c4872a3c51/src/curve/bump.js
 */
export class Bump implements CurveGenerator {
  private context: CanvasRenderingContext2D;

  private isHorizontal: boolean = false;

  private gap: number = 0;

  private borderRadius: number = 0;

  private points: Point[] = [];

  constructor(
    context: CanvasRenderingContext2D,
    {
      isHorizontal,
      gap,
      borderRadius,
    }: { isHorizontal: boolean; gap?: number; borderRadius?: number },
  ) {
    this.context = context;
    this.isHorizontal = isHorizontal;
    this.gap = (gap ?? 0) / 2;
    this.borderRadius = borderRadius ?? 0;
  }

  areaStart(): void {}

  areaEnd(): void {}

  lineStart(): void {}

  lineEnd(): void {}

  point(xIn: number, yIn: number): void {
    this.points.push({ x: xIn, y: yIn });
    if (this.points.length < 4) {
      return;
    }

    // Add gaps where they are needed.
    this.points = this.points.map((point, index) => {
      if (this.isHorizontal) {
        return {
          x: point.x + (index === 0 || index === 3 ? this.gap : -this.gap),
          y: point.y,
        };
      }
      return {
        x: point.x,
        y: point.y + (index === 0 || index === 3 ? this.gap : -this.gap),
      };
    });

    borderRadiusBumpPolygon(this.context, this.points, this.borderRadius);
  }
}
