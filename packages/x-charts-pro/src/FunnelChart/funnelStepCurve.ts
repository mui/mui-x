import { CurveFactory, CurveGenerator } from '@mui/x-charts-vendor/d3-shape';

class FunnelStep implements CurveGenerator {
  private context: CanvasRenderingContext2D;

  private line: number = NaN;

  private x: number = NaN;

  private y: number = NaN;

  private current_point: number = 0;

  private isHorizontal: boolean = false;

  constructor(context: CanvasRenderingContext2D, isHorizontal: boolean) {
    this.context = context;
    this.isHorizontal = isHorizontal;
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
    this.current_point = 0;
  }

  lineEnd(): void {
    if (this.current_point === 2) {
      this.context.lineTo(this.x, this.y);
    }
    if (this.line || (this.line !== 0 && this.current_point === 1)) {
      this.context.closePath();
    }
    if (this.line >= 0) {
      this.line = 1 - this.line;
    }
  }

  point(x: number, y: number): void {
    x = +x;
    y = +y;

    if (this.current_point === 0) {
      this.context.moveTo(x, y);
    } else if (this.isHorizontal && (this.current_point === 2 || this.current_point === 1)) {
      this.context.lineTo(x, this.y);
      this.context.lineTo(x, y);
    } else if (this.current_point === 3 && !this.isHorizontal) {
      this.context.lineTo(x, this.y);
      this.context.lineTo(x, y);
    } else {
      this.context.lineTo(this.x, y);
      this.context.lineTo(x, y);
    }

    this.current_point += 1;
    this.x = x;
    this.y = y;
  }
}

const funnelHorizontalStepCurve: CurveFactory = (context) => {
  return new FunnelStep(context as any, true);
};

const funnelVerticalStepCurve: CurveFactory = (context) => {
  return new FunnelStep(context as any, false);
};

export { funnelHorizontalStepCurve, funnelVerticalStepCurve };
