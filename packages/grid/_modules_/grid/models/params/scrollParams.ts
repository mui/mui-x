export interface ScrollParams {
  left: number;
  top: number;
}

export type ScrollFn = (v: ScrollParams) => void;
