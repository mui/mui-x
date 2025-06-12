/* eslint-disable class-methods-use-this */
import { CurveGenerator } from '@mui/x-charts-vendor/d3-shape';
import { CurveOptions, Point } from './curve.types';
import { borderRadiusPolygon } from './borderRadiusPolygon';
import { max, min } from './utils';

/**
 * This is a custom "step" curve generator.
 * It is used to draw "rectangles" from 4 points without having to rework the rendering logic,
 * with the option to add a gap between sections while also properly handling the border radius.
 *
 * It takes the min and max of the x and y coordinates of the points to create a rectangle.
 *
 * The implementation is based on the d3-shape step curve generator.
 * https://github.com/d3/d3-shape/blob/a82254af78f08799c71d7ab25df557c4872a3c51/src/curve/step.js
 */
export class Step implements CurveGenerator {
  private context: CanvasRenderingContext2D;

  private isHorizontal: boolean = false;

  private isIncreasing: boolean = false;

  private gap: number = 0;

  private borderRadius: number = 0;

  private position: number = 0;

  private sections: number = 0;

  private points: Point[] = [];

  constructor(
    context: CanvasRenderingContext2D,
    { isHorizontal, gap, position, borderRadius, isIncreasing, sections }: CurveOptions,
  ) {
    this.context = context;
    this.isHorizontal = isHorizontal ?? false;
    this.gap = gap ?? 0;
    this.position = position ?? 0;
    this.sections = sections ?? 1;
    this.borderRadius = borderRadius ?? 0;
    this.isIncreasing = isIncreasing ?? false;
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
      if (this.position === this.sections - 1) {
        return this.borderRadius;
      }

      return [0, 0, this.borderRadius, this.borderRadius];
    }

    if (this.position === 0) {
      return this.borderRadius;
    }

    return [this.borderRadius, this.borderRadius];
  }

  point(xIn: number, yIn: number): void {
    this.points.push({ x: xIn, y: yIn });
    if (this.points.length < 4) {
      return;
    }

    // Ensure we have rectangles instead of trapezoids.
    this.points = this.points.map((_, index) => {
      const allX = this.points.map((p) => p.x);
      const allY = this.points.map((p) => p.y);
      if (this.isHorizontal) {
        return {
          x: index === 1 || index === 2 ? max(allX) : min(allX),
          y: index <= 1 ? max(allY) : min(allY),
        };
      }
      return {
        x: index <= 1 ? min(allX) : max(allX),
        y: index === 1 || index === 2 ? max(allY) : min(allY),
      };
    });

    borderRadiusPolygon(this.context, this.points, this.getBorderRadius());
  }
}
