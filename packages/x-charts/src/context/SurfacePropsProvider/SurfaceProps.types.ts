import type { ChartsSurfaceProps } from '../../ChartsSurface';

export type SurfacePropsProviderProps = ChartsSurfaceProps;

export type SurfacePropsContextState = ChartsSurfaceProps & {
  ref: React.Ref<SVGSVGElement>;
};
