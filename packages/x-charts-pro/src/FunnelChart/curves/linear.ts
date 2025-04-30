import { CurveGenerator } from '@mui/x-charts-vendor/d3-shape';

// From point1 to point2, get the x value from y
const xFromY =
  (point1: { x: number; y: number }, point2: { x: number; y: number }) =>
  (y: number): number => {
    const x1 = point1.x;
    const y1 = point1.y;
    const x2 = point2.x;
    const y2 = point2.y;

    if (y1 === y2) {
      return x1;
    }

    const result = ((x2 - x1) * (y - y1)) / (y2 - y1) + x1;

    return Number.isNaN(result) ? 0 : result;
  };

// From point1 to point2, get the y value from x
const yFromX =
  (point1: { x: number; y: number }, point2: { x: number; y: number }) =>
  (x: number): number => {
    const x1 = point1.x;
    const y1 = point1.y;
    const x2 = point2.x;
    const y2 = point2.y;
    if (x1 === x2) {
      return y1;
    }
    const result = ((y2 - y1) * (x - x1)) / (x2 - x1) + y1;
    return Number.isNaN(result) ? 0 : result;
  };

/**
 * This is a custom "linear" curve generator.
 *
 * It takes into account the gap between the points and draws a smooth curve between them.
 *
 * It is based on the d3-shape linear curve generator.
 * https://github.com/d3/d3-shape/blob/a82254af78f08799c71d7ab25df557c4872a3c51/src/curve/linear.js
 */
export class Linear implements CurveGenerator {
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
    this.currentPoint = 0;
  }

  lineEnd() {
    if (this.line || (this.line !== 0 && this.currentPoint === 1)) {
      this.context.closePath();
    }
    this.line = 1 - this.line;
  }

  point(x: number, y: number): void {
    x = +x;
    y = +y;

    // 0 is the top-left corner.
    if (this.isHorizontal) {
      const yGetter = yFromX({ x: this.x, y: this.y }, { x, y });
      let xGap = 0;

      if (this.currentPoint === 0) {
        xGap = x + this.gap;
        this.context.moveTo(xGap, y);
        this.context.lineTo(xGap, y);
      } else if (this.currentPoint === 1) {
        xGap = x - this.gap;
        this.context.lineTo(xGap, yGetter(xGap));
      } else if (this.currentPoint === 2) {
        xGap = this.x - this.gap;
        this.context.lineTo(xGap, y);
      } else {
        xGap = x + this.gap;
        this.context.lineTo(xGap, yGetter(xGap));
      }

      this.currentPoint += 1;
      this.x = x;
      this.y = y;
      return;
    }

    const xGetter = xFromY({ x: this.x, y: this.y }, { x, y });
    let yGap = 0;
    // 0 is the top-right corner.
    if (this.currentPoint === 0) {
      yGap = y + this.gap;
      this.context.moveTo(x, yGap);
      this.context.lineTo(x, yGap);
    } else if (this.currentPoint === 1) {
      yGap = y - this.gap;
      this.context.lineTo(xGetter(yGap), yGap);
    } else if (this.currentPoint === 2) {
      yGap = this.y - this.gap;
      this.context.lineTo(x, yGap);
    } else {
      yGap = y + this.gap;
      this.context.lineTo(xGetter(yGap), yGap);
    }

    this.currentPoint += 1;
    this.x = x;
    this.y = y;
  }
}
