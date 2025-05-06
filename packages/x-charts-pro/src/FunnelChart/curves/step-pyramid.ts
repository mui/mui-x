/* eslint-disable class-methods-use-this */
import { CurveGenerator } from '@mui/x-charts-vendor/d3-shape';
import { CurveOptions, Point } from './curve.types';
import { borderRadiusPolygon } from './borderRadiusPolygon';
import { lerpX, lerpY } from './utils';

/**
 * This is a custom "step-pyramid" curve generator.
 * It creates a step pyramid, which is a step-like shape with static lengths.
 * It has the option to add a gap between sections while also properly handling the border radius.
 */
export class StepPyramid implements CurveGenerator {
  private context: CanvasRenderingContext2D;

  private position: number = 0;

  private isHorizontal: boolean = false;

  private gap: number = 0;

  private borderRadius: number = 0;

  private min: Point = { x: 0, y: 0 };

  private max: Point = { x: 0, y: 0 };

  private points: Point[] = [];

  constructor(
    context: CanvasRenderingContext2D,
    { isHorizontal, gap, position, borderRadius, min, max }: CurveOptions,
  ) {
    this.context = context;
    this.isHorizontal = isHorizontal ?? false;
    this.gap = (gap ?? 0) / 2;
    this.position = position ?? 0;
    this.borderRadius = borderRadius ?? 0;
    this.min = min ?? { x: 0, y: 0 };
    this.max = max ?? { x: 0, y: 0 };
  }

  areaStart(): void {}

  areaEnd(): void {}

  lineStart(): void {}

  lineEnd(): void {}

  protected getBorderRadius(): number | number[] {
    return this.gap > 0 || this.position === 0
      ? this.borderRadius
      : [this.borderRadius, this.borderRadius];
  }

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
        const yGetter = lerpY(slopeStart.x, slopeStart.y, slopeEnd.x, slopeEnd.y);
        const xGap = point.x + (index === 0 || index === 3 ? this.gap : -this.gap);
        const xInitial = index === 0 || index === 1 ? this.points.at(0)!.x : this.points.at(3)!.x;

        return {
          x: xGap,
          y: yGetter(xInitial),
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
      const yGap = point.y + (index === 0 || index === 3 ? this.gap : -this.gap);
      const yInitial = index === 0 || index === 1 ? this.points.at(0)!.y : this.points.at(3)!.y;
      return {
        x: xGetter(yInitial),
        y: yGap,
      };
    });

    borderRadiusPolygon(this.context, this.points, this.getBorderRadius());
  }
}
