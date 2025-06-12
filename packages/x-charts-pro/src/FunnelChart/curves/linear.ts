/* eslint-disable class-methods-use-this */
import { CurveGenerator } from '@mui/x-charts-vendor/d3-shape';
import { CurveOptions, FunnelPointShape, Point } from './curve.types';
import { borderRadiusPolygon } from './borderRadiusPolygon';
import { lerpX, lerpY } from './utils';

/**
 * This is a custom "linear" curve generator.
 * It draws straight lines for the 4 provided points,
 * with the option to properly handling the border radius.
 *
 * The implementation is based on the d3-shape linear curve generator.
 * https://github.com/d3/d3-shape/blob/a82254af78f08799c71d7ab25df557c4872a3c51/src/curve/linear.js
 */
export class Linear implements CurveGenerator {
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

  private pointShape: FunnelPointShape = 'square';

  constructor(
    context: CanvasRenderingContext2D,
    {
      isHorizontal,
      gap,
      position,
      sections,
      borderRadius,
      min,
      max,
      isIncreasing,
      pointShape,
    }: CurveOptions,
  ) {
    this.context = context;
    this.isHorizontal = isHorizontal ?? false;
    this.gap = gap ?? 0;
    this.position = position ?? 0;
    this.sections = sections ?? 1;
    this.borderRadius = borderRadius ?? 0;
    this.isIncreasing = isIncreasing ?? false;
    this.min = min ?? { x: 0, y: 0 };
    this.max = max ?? { x: 0, y: 0 };
    this.pointShape = pointShape ?? 'square';

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
      if (this.position === 0 && this.pointShape === 'sharp') {
        return [0, 0, this.borderRadius];
      }
      // Is smallest section
      if (this.position === 0) {
        return [0, 0, this.borderRadius, this.borderRadius];
      }
    }

    if (!this.isIncreasing) {
      // Is largest section
      if (this.position === 0) {
        return [0, 0, this.borderRadius, this.borderRadius];
      }
      // Is smallest section and shaped like a triangle
      if (this.position === this.sections - 1 && this.pointShape === 'sharp') {
        return [this.borderRadius];
      }

      // Is smallest section
      if (this.position === this.sections - 1) {
        return [this.borderRadius, this.borderRadius];
      }
    }

    return 0;
  }

  point(xIn: number, yIn: number): void {
    this.points.push({ x: xIn, y: yIn });
    if (this.points.length < 4) {
      return;
    }

    // Add gaps where they are needed.
    this.points = this.points.map((point, index) => {
      const slopeStart = this.points.at(index <= 1 ? 0 : 3)!;
      const slopeEnd = this.points.at(index <= 1 ? 1 : 2)!;

      if (this.isHorizontal) {
        const yGetter = lerpY(slopeStart.x - this.gap, slopeStart.y, slopeEnd.x, slopeEnd.y);

        return {
          x: point.x,
          y: yGetter(point.x),
        };
      }

      const xGetter = lerpX(slopeStart.x, slopeStart.y - this.gap, slopeEnd.x, slopeEnd.y);

      return {
        x: xGetter(point.y),
        y: point.y,
      };
    });

    if (this.pointShape === 'sharp') {
      // In the last section, to form a triangle we need 3 points instead of 4
      // Else the algorithm will break.
      const isLastSection = this.position === this.sections - 1;
      const isFirstSection = this.position === 0;

      let firstPoint: Point | null = null;
      let secondPoint: Point | null = null;

      if (isFirstSection && this.isIncreasing) {
        firstPoint = this.points[1];
        secondPoint = this.points[2];
      }

      if (isLastSection && !this.isIncreasing) {
        firstPoint = this.points[3];
        secondPoint = this.points[0];
      }

      if (firstPoint && secondPoint) {
        this.points = [
          // Sharp point at the start
          this.isHorizontal
            ? { x: this.max.x, y: (this.max.y + this.min.y) / 2 }
            : { x: (this.max.x + this.min.x) / 2, y: this.max.y },
          // Then other points
          firstPoint,
          secondPoint,
        ];
      }
    }

    borderRadiusPolygon(this.context, this.points, this.getBorderRadius());
  }
}
