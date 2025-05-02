/* eslint-disable class-methods-use-this */
import { CurveGenerator } from '@mui/x-charts-vendor/d3-shape';
import { Point } from './curve.types';
import { borderRadiusPolygon } from './borderRadiusPolygon';

/**
 * This is a custom "step" curve generator for the funnel chart.
 * It is used to draw the funnel using "rectangles" without having to rework the rendering logic.
 *
 * It takes into account the gap between the points and draws a smooth curve between them.
 *
 * It is based on the d3-shape step curve generator.
 * https://github.com/d3/d3-shape/blob/a82254af78f08799c71d7ab25df557c4872a3c51/src/curve/step.js
 */
export class FunnelStep implements CurveGenerator {
  private context: CanvasRenderingContext2D;

  private isHorizontal: boolean = false;

  private gap: number = 0;

  private borderRadius: number = 0;

  private position: number = 0;

  private sections: number = 0;

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

    // Ensure we have rectangles instead of trapezoids.
    this.points = this.points.map((point, index) => {
      if (this.isHorizontal) {
        return {
          x: point.x,
          y: index <= 1 ? this.points.at(0)!.y : this.points.at(-1)!.y,
        };
      }
      return {
        x: index <= 1 ? this.points.at(0)!.x : this.points.at(-1)!.x,
        y: point.y,
      };
    });

    // Add gaps where they are needed.
    this.points = this.points.map((point, index) => {
      if (this.isHorizontal) {
        return {
          x: point.x + (index === 0 || index === 3 ? this.gap : -this.gap),
          y: point.y,
        };
      }
      return {
        x: point.x,
        y: point.y + (index === 0 || index === 3 ? this.gap : -this.gap),
      };
    });

    if (this.borderRadius > 0) {
      borderRadiusPolygon(
        this.context,
        this.points,
        this.gap > 0 || this.position === 0
          ? this.borderRadius
          : [this.borderRadius, this.borderRadius],
      );
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
