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
    this.gap = gap ?? 0;
    this.position = position ?? 0;
    this.sections = sections ?? 1;
    this.borderRadius = borderRadius ?? 0;
    this.isIncreasing = isIncreasing ?? false;
    this.min = min ?? { x: 0, y: 0 };
    this.max = max ?? { x: 0, y: 0 };
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

  slopeStart(index: number): Point {
    if (this.isIncreasing) {
      if (this.isHorizontal) {
        return {
          x: this.min.x,
          y: (this.min.y + this.max.y) / 2,
        };
      }
      return {
        x: (this.min.x + this.max.x) / 2,
        y: this.min.y,
      };
    }

    if (this.isHorizontal) {
      if (index <= 1) {
        return this.min;
      }

      return {
        x: this.min.x,
        y: this.max.y,
      };
    }

    if (index <= 1) {
      return {
        x: this.max.x,
        y: this.min.y,
      };
    }

    return this.min;
  }

  slopeEnd(index: number): Point {
    if (this.isIncreasing) {
      if (this.isHorizontal) {
        if (index <= 1) {
          return {
            x: this.max.x,
            y: this.min.y,
          };
        }
        return this.max;
      }

      if (index <= 1) {
        return this.max;
      }
      return {
        x: this.min.x,
        y: this.max.y,
      };
    }

    if (this.isHorizontal) {
      return {
        x: this.max.x,
        y: (this.max.y + this.min.y) / 2,
      };
    }
    return {
      x: (this.max.x + this.min.x) / 2,
      y: this.max.y,
    };
  }

  initialX(index: number): number {
    if (this.isIncreasing) {
      return index === 0 || index === 1 ? this.points.at(1)!.x : this.points.at(2)!.x;
    }

    return index === 0 || index === 1 ? this.points.at(0)!.x : this.points.at(3)!.x;
  }

  initialY(index: number): number {
    if (this.isIncreasing) {
      return index === 0 || index === 1 ? this.points.at(1)!.y : this.points.at(2)!.y;
    }

    return index === 0 || index === 1 ? this.points.at(0)!.y : this.points.at(3)!.y;
  }

  point(xIn: number, yIn: number): void {
    this.points.push({ x: xIn, y: yIn });
    if (this.points.length < 4) {
      return;
    }

    // Replace funnel points by pyramids ones.
    this.points = this.points.map((point, index) => {
      const slopeStart = this.slopeStart(index);
      const slopeEnd = this.slopeEnd(index);

      if (this.isHorizontal) {
        const yGetter = lerpY(slopeStart.x, slopeStart.y, slopeEnd.x, slopeEnd.y);
        const xInitial = this.initialX(index);

        return {
          x: point.x,
          y: yGetter(xInitial),
        };
      }

      const xGetter = lerpX(slopeStart.x, slopeStart.y, slopeEnd.x, slopeEnd.y);
      const yInitial = this.initialY(index);
      return {
        x: xGetter(yInitial),
        y: point.y,
      };
    });

    borderRadiusPolygon(this.context, this.points, this.getBorderRadius());
  }
}
