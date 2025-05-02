/* eslint-disable class-methods-use-this */
import { CurveGenerator } from '@mui/x-charts-vendor/d3-shape';
import { Point } from './curve.types';
import { borderRadiusPolygon } from './borderRadiusPolygon';

// From point1 to point2, get the x value from y
const xFromY =
  (x1: number, y1: number, x2: number, y2: number) =>
  (y: number): number => {
    if (y1 === y2) {
      return x1;
    }

    const result = ((x2 - x1) * (y - y1)) / (y2 - y1) + x1;

    return Number.isNaN(result) ? 0 : result;
  };

// From point1 to point2, get the y value from x
const yFromX =
  (x1: number, y1: number, x2: number, y2: number) =>
  (x: number): number => {
    if (x1 === x2) {
      return y1;
    }
    const result = ((y2 - y1) * (x - x1)) / (x2 - x1) + y1;
    return Number.isNaN(result) ? 0 : result;
  };

/**
 * This is a custom "linear" curve generator.
 * It draws straight lines for the 4 provided points,
 * with the option to add a gap between sections while also properly handling the border radius.
 *
 * The implementation is based on the d3-shape linear curve generator.
 * https://github.com/d3/d3-shape/blob/a82254af78f08799c71d7ab25df557c4872a3c51/src/curve/linear.js
 */
export class Linear implements CurveGenerator {
  private context: CanvasRenderingContext2D;

  private position: number = 0;

  private sections: number = 0;

  private isHorizontal: boolean = false;

  private gap: number = 0;

  private borderRadius: number = 0;

  private points: Point[] = [];

  constructor(
    context: CanvasRenderingContext2D,
    {
      isHorizontal,
      gap,
      position,
      sections,
      borderRadius,
    }: {
      isHorizontal: boolean;
      gap?: number;
      position?: number;
      sections?: number;
      borderRadius?: number;
    },
  ) {
    this.context = context;
    this.isHorizontal = isHorizontal;
    this.gap = (gap ?? 0) / 2;
    this.position = position ?? 0;
    this.sections = sections ?? 1;
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
      const slopeStart = this.points.at(index <= 1 ? 0 : 2)!;
      const slopeEnd = this.points.at(index <= 1 ? 1 : 3)!;
      const yGetter = yFromX(slopeStart.x, slopeStart.y, slopeEnd.x, slopeEnd.y);
      if (this.isHorizontal) {
        const xGap = point.x + (index === 0 || index === 3 ? this.gap : -this.gap);

        return {
          x: xGap,
          y: yGetter(xGap),
        };
      }

      const xGetter = xFromY(slopeStart.x, slopeStart.y, slopeEnd.x, slopeEnd.y);
      const yGap = point.y + (index === 0 || index === 3 ? this.gap : -this.gap);
      return {
        x: xGetter(yGap),
        y: yGap,
      };
    });

    const getBorderRadius = () => {
      if (this.gap > 0) {
        return this.borderRadius;
      }
      if (this.position === 0) {
        return [0, 0, this.borderRadius, this.borderRadius];
      }
      if (this.position === this.sections - 1) {
        return [this.borderRadius, this.borderRadius];
      }
      return 0;
    };

    if (this.borderRadius > 0) {
      borderRadiusPolygon(this.context, this.points, getBorderRadius());
    } else {
      this.context.moveTo(this.points[0].x, this.points[0].y);
      this.points.forEach((point, index) => {
        if (index === 0) {
          this.context.moveTo(point.x, point.y);
        }
        this.context.lineTo(point.x, point.y);
        if (index === this.points.length - 1) {
          this.context.closePath();
        }
      });
    }
  }
}
