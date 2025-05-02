/* eslint-disable class-methods-use-this */
import { CurveGenerator } from '@mui/x-charts-vendor/d3-shape';
import { Point } from './curve.types';
import { borderRadiusPolygon } from './borderRadiusPolygon';

const max = (numbers: number[]) => Math.max(...numbers, -Infinity);
const min = (numbers: number[]) => Math.min(...numbers, Infinity);

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

  private gap: number = 0;

  private borderRadius: number = 0;

  private position: number = 0;

  private points: Point[] = [];

  constructor(
    context: CanvasRenderingContext2D,
    {
      isHorizontal,
      gap,
      position,
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
