/* eslint-disable class-methods-use-this */
import { CurveGenerator } from '@mui/x-charts-vendor/d3-shape';
import { CurveOptions } from './curve.types';

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

  private x: number = NaN;

  private y: number = NaN;

  private currentPoint: number = 0;

  private isHorizontal: boolean = false;

  private gap: number = 0;

  constructor(context: CanvasRenderingContext2D, { isHorizontal, gap }: CurveOptions) {
    this.context = context;
    this.isHorizontal = isHorizontal ?? false;
    this.gap = (gap ?? 0) / 2;
  }

  areaStart(): void {}

  areaEnd(): void {}

  lineStart(): void {}

  lineEnd(): void {}

  point(x: number, y: number): void {
    x = +x;
    y = +y;

    // 0 is the top-left corner.
    if (this.isHorizontal) {
      if (this.currentPoint === 0) {
        this.context.moveTo(x + this.gap, y);
        this.context.lineTo(x + this.gap, y);
      } else if (this.currentPoint === 1) {
        this.context.bezierCurveTo((this.x + x) / 2, this.y, (this.x + x) / 2, y, x - this.gap, y);
      } else if (this.currentPoint === 2) {
        this.context.lineTo(x - this.gap, y);
      } else {
        this.context.bezierCurveTo((this.x + x) / 2, this.y, (this.x + x) / 2, y, x + this.gap, y);
      }

      if (this.currentPoint === 3) {
        this.context.closePath();
      }
      this.currentPoint += 1;
      this.x = x;
      this.y = y;
      return;
    }

    // 0 is the top-right corner.
    if (this.currentPoint === 0) {
      // X from Y
      this.context.moveTo(x, y + this.gap);
      this.context.lineTo(x, y + this.gap);
    } else if (this.currentPoint === 1) {
      this.context.bezierCurveTo(this.x, (this.y + y) / 2, x, (this.y + y) / 2, x, y - this.gap);
    } else if (this.currentPoint === 2) {
      this.context.lineTo(x, y - this.gap);
    } else {
      this.context.bezierCurveTo(this.x, (this.y + y) / 2, x, (this.y + y) / 2, x, y + this.gap);
    }

    if (this.currentPoint === 3) {
      this.context.closePath();
    }
    this.currentPoint += 1;
    this.x = x;
    this.y = y;
  }
}
