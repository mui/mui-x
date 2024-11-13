import type { ChartsSurfaceProps } from '../../ChartsSurface';

export type SurfacePropsProviderProps = ChartsSurfaceProps & {
  ref: React.Ref<SVGSVGElement>;
};

export type SurfacePropsContextState = ChartsSurfaceProps & {
  ref: React.Ref<SVGSVGElement>;
};
