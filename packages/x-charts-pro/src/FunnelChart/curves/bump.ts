/* eslint-disable class-methods-use-this */
import { CurveGenerator } from '@mui/x-charts-vendor/d3-shape';
import { CurveOptions, Point } from './curve.types';

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

  private min: Point = { x: 0, y: 0 };

  private max: Point = { x: 0, y: 0 };

  private points: Point[] = [];

  constructor(
    context: CanvasRenderingContext2D,
    { isHorizontal, gap, min, max, isIncreasing }: CurveOptions,
  ) {
    this.context = context;
    this.isHorizontal = isHorizontal ?? false;
    this.gap = gap ?? 0;
    this.min = min ?? { x: 0, y: 0 };
    this.max = max ?? { x: 0, y: 0 };

    if (isIncreasing) {
      const currentMin = this.min;
      const currentMax = this.max;
      this.min = currentMax;
      this.max = currentMin;
    }
  }

  areaStart(): void {}

  areaEnd(): void {}

  lineStart(): void {}

  lineEnd(): void {}

  point(x: number, y: number): void {
    this.points.push({ x, y });
    if (this.points.length < 4) {
      return;
    }

    // Draw the path using bezier curves
    this.drawPath();
  }

  private drawPath(): void {
    if (this.isHorizontal) {
      this.drawHorizontalPath();
    } else {
      this.drawVerticalPath();
    }
  }

  private drawHorizontalPath(): void {
    const [p0, p1, p2, p3] = this.points;

    // 0 is the top-left corner
    this.context.moveTo(p0.x, p0.y);
    this.context.lineTo(p0.x, p0.y);

    // Bezier curve to point 1
    this.context.bezierCurveTo((p0.x + p1.x) / 2, p0.y, (p0.x + p1.x) / 2, p1.y, p1.x, p1.y);

    // Line to point 2
    this.context.lineTo(p2.x, p2.y);

    // Bezier curve back to point 3
    this.context.bezierCurveTo((p2.x + p3.x) / 2, p2.y, (p2.x + p3.x) / 2, p3.y, p3.x, p3.y);

    this.context.closePath();
  }

  private drawVerticalPath(): void {
    const [p0, p1, p2, p3] = this.points;

    // 0 is the top-right corner
    this.context.moveTo(p0.x, p0.y);
    this.context.lineTo(p0.x, p0.y);

    // Bezier curve to point 1
    this.context.bezierCurveTo(p0.x, (p0.y + p1.y) / 2, p1.x, (p0.y + p1.y) / 2, p1.x, p1.y);

    // Line to point 2
    this.context.lineTo(p2.x, p2.y);

    // Bezier curve back to point 3
    this.context.bezierCurveTo(p2.x, (p2.y + p3.y) / 2, p3.x, (p2.y + p3.y) / 2, p3.x, p3.y);

    this.context.closePath();
  }
}
