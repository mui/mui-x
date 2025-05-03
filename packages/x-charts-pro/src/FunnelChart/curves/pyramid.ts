/* eslint-disable class-methods-use-this */
import { CurveGenerator } from '@mui/x-charts-vendor/d3-shape';
import { CurveOptions, Point } from './curve.types';
import { borderRadiusPolygon } from './borderRadiusPolygon';
import { xFromY, yFromX } from './utils';

/**
 * This is a custom "pyramid" curve generator.
 * It draws straight lines for the 4 provided points,
 * with the option to add a gap between sections while also properly handling the border radius.
 */
export class Pyramid implements CurveGenerator {
  private context: CanvasRenderingContext2D;

  private position: number = 0;

  private sections: number = 0;

  private isHorizontal: boolean = false;

  private gap: number = 0;

  private borderRadius: number = 0;

  private min: Point = { x: 0, y: 0 };

  private max: Point = { x: 0, y: 0 };

  private points: Point[] = [];

  constructor(
    context: CanvasRenderingContext2D,
    { isHorizontal, gap, position, sections, borderRadius, min, max }: CurveOptions,
  ) {
    this.context = context;
    this.isHorizontal = isHorizontal ?? false;
    this.gap = (gap ?? 0) / 2;
    this.position = position ?? 0;
    this.sections = sections ?? 1;
    this.borderRadius = borderRadius ?? 0;
    this.min = min ?? { x: 0, y: 0 };
    this.max = max ?? { x: 0, y: 0 };
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
        const slopeEnd = {
          x: this.max.x,
          y: (this.max.y + this.min.y) / 2,
        };
        const slopeStart =
          index <= 1
            ? this.min
            : {
                x: this.min.x,
                y: this.max.y,
              };
        const yGetter = yFromX(slopeStart.x, slopeStart.y, slopeEnd.x, slopeEnd.y);
        const xGap = point.x + (index === 0 || index === 3 ? this.gap : -this.gap);

        return {
          x: xGap,
          y: yGetter(xGap),
        };
      }

      const slopeEnd = {
        x: (this.max.x + this.min.x) / 2,
        y: this.max.y,
      };
      const slopeStart =
        index <= 1
          ? {
              x: this.max.x,
              y: this.min.y,
            }
          : this.min;
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
      if (this.position === this.sections - 1 && this.gap <= 0) {
        return [this.borderRadius];
      }
      if (this.position === this.sections - 1) {
        return [this.borderRadius, this.borderRadius];
      }
      return 0;
    };

    // In the last section, to form a triangle we need 3 points instead of 4
    // Else the algorithm will break.
    if (this.position === this.sections - 1 && this.gap <= 0) {
      this.points = [this.points[0], this.points[1], this.points[3]];
    }

    borderRadiusPolygon(this.context, this.points, getBorderRadius());
  }
}
