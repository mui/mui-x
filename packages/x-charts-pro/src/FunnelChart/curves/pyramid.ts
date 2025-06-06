/* eslint-disable class-methods-use-this */
import { CurveGenerator } from '@mui/x-charts-vendor/d3-shape';
import { CurveOptions, Point } from './curve.types';
import { borderRadiusPolygon } from './borderRadiusPolygon';
import { lerpX, lerpY } from './utils';

/**
 * This is a custom "pyramid" curve generator.
 * It draws straight lines for the 4 provided points. The slopes are calculated
 * based on the min and max values of the x and y axes.
 * with the option to add a gap between sections while also properly handling the border radius.
 */
export class Pyramid implements CurveGenerator {
  private context: CanvasRenderingContext2D;

  private position: number = 0;

  private sections: number = 0;

  private isHorizontal: boolean = false;

  private isIncreasing: boolean = false;

  private gap: number = 0;

  private borderRadius: number = 0;

  private min: Point = { x: 0, y: 0 };

  private max: Point = { x: 0, y: 0 };

  private points: Point[] = [];

  constructor(
    context: CanvasRenderingContext2D,
    { isHorizontal, gap, position, sections, borderRadius, min, max, isIncreasing }: CurveOptions,
  ) {
    this.context = context;
    this.isHorizontal = isHorizontal ?? false;
    this.gap = (gap ?? 0) / 2;
    this.position = position ?? 0;
    this.sections = sections ?? 1;
    this.borderRadius = borderRadius ?? 0;
    this.isIncreasing = isIncreasing ?? false;
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

  protected getBorderRadius(): number | number[] {
    if (this.gap > 0) {
      return this.borderRadius;
    }

    if (this.isIncreasing) {
      // Is largest section
      if (this.position === this.sections - 1) {
        return [this.borderRadius, this.borderRadius];
      }
      // Is smallest section and shaped like a triangle
      if (this.position === 0) {
        return [0, 0, this.borderRadius];
      }
    }

    if (!this.isIncreasing) {
      // Is largest section
      if (this.position === 0) {
        return [0, 0, this.borderRadius, this.borderRadius];
      }
      // Is smallest section and shaped like a triangle
      if (this.position === this.sections - 1) {
        return [this.borderRadius];
      }
    }

    return 0;
  }

  point(xIn: number, yIn: number): void {
    this.points.push({ x: xIn, y: yIn });
    if (this.points.length < 4) {
      return;
    }

    // Replace funnel points by pyramids ones.
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
        const yGetter = lerpY(slopeStart.x, slopeStart.y, slopeEnd.x, slopeEnd.y);
        const xGap = point.x;

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
      const xGetter = lerpX(slopeStart.x, slopeStart.y, slopeEnd.x, slopeEnd.y);
      const yGap = point.y;
      return {
        x: xGetter(yGap),
        y: yGap,
      };
    });

    // In the last section, to form a triangle we need 3 points instead of 4
    // Else the algorithm will break.
    const isLastSection = this.position === this.sections - 1;
    const isFirstSection = this.position === 0;

    if (isFirstSection && this.isIncreasing) {
      this.points = [this.points[0], this.points[1], this.points[2]];
    }

    if (isLastSection && !this.isIncreasing) {
      this.points = [this.points[0], this.points[1], this.points[3]];
    }

    borderRadiusPolygon(this.context, this.points, this.getBorderRadius());
  }
}
