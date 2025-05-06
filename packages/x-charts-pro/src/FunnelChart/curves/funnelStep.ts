import { CurveGenerator } from '@mui/x-charts-vendor/d3-shape';

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

  private line: number = NaN;

  private x: number = NaN;

  private y: number = NaN;

  private currentPoint: number = 0;

  private isHorizontal: boolean = false;

  private gap: number = 0;

  constructor(context: CanvasRenderingContext2D, isHorizontal: boolean, gap: number = 0) {
    this.context = context;
    this.isHorizontal = isHorizontal;
    this.gap = gap / 2;
  }

  areaStart(): void {
    this.line = 0;
  }

  areaEnd(): void {
    this.line = NaN;
  }

  lineStart(): void {
    this.x = NaN;
    this.y = NaN;
    this.currentPoint = 0;
  }

  lineEnd(): void {
    if (this.currentPoint === 2) {
      this.context.lineTo(this.x, this.y);
    }
    if (this.line || (this.line !== 0 && this.currentPoint === 1)) {
      this.context.closePath();
    }
    if (this.line >= 0) {
      this.line = 1 - this.line;
    }
  }

  point(x: number, y: number): void {
    x = +x;
    y = +y;

    // 0 is the top-left corner.
    if (this.isHorizontal) {
      if (this.currentPoint === 0) {
        this.context.moveTo(x + this.gap, y);
      } else if (this.currentPoint === 1 || this.currentPoint === 2) {
        this.context.lineTo(x - this.gap, this.y);
        this.context.lineTo(x - this.gap, y);
      } else {
        this.context.lineTo(this.x - this.gap, y);
        this.context.lineTo(x + this.gap, y);
      }

      this.currentPoint += 1;
      this.x = x;
      this.y = y;
      return;
    }

    // 0 is the top-right corner.
    if (this.currentPoint === 0) {
      this.context.moveTo(x, y + this.gap);
    } else if (this.currentPoint === 3) {
      this.context.lineTo(x, this.y - this.gap);
      this.context.lineTo(x, y + this.gap);
    } else {
      this.context.lineTo(this.x, y - this.gap);
      this.context.lineTo(x, y - this.gap);
    }

    this.currentPoint += 1;
    this.x = x;
    this.y = y;
  }
}
