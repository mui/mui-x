import { type FunnelCurveGenerator, type CurveOptions, type Point } from './curve.types';
import { borderRadiusPolygon } from './borderRadiusPolygon';
import { lerpX, lerpY } from './utils';

/**
 * This is a custom "pyramid" curve generator.
 * It draws straight lines for the 4 provided points. The slopes are calculated
 * based on the min and max values of the x and y axes.
 * with the option to add a gap between sections while also properly handling the border radius.
 */
export class Pyramid implements FunnelCurveGenerator {
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

  processPoints(points: Point[]): Point[] {
    // Replace funnel points by pyramids ones.
    const processedPoints = points.map((point, index) => {
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
        return {
          x: point.x,
          y: yGetter(point.x),
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
      return {
        x: xGetter(point.y),
        y: point.y,
      };
    });

    // In the last section, to form a triangle we need 3 points instead of 4
    // Else the algorithm will break.
    const isLastSection = this.position === this.sections - 1;
    const isFirstSection = this.position === 0;

    if (isFirstSection && this.isIncreasing) {
      return [processedPoints[0], processedPoints[1], processedPoints[2]];
    }

    if (isLastSection && !this.isIncreasing) {
      return [processedPoints[0], processedPoints[1], processedPoints[3]];
    }

    return processedPoints;
  }

  point(xIn: number, yIn: number): void {
    this.points.push({ x: xIn, y: yIn });
    const isLastSection = this.position === this.sections - 1;
    const isFirstSection = this.position === 0;
    const isSharpPoint =
      (isLastSection && !this.isIncreasing) || (isFirstSection && this.isIncreasing);
    if (this.points.length < (isSharpPoint ? 3 : 4)) {
      return;
    }

    borderRadiusPolygon(this.context, this.points, this.getBorderRadius());
  }
}
