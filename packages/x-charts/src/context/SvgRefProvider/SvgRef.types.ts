import * as React from 'react';

export interface SvgRefProviderProps {
  children: React.ReactNode;
}

export type SvgRefState = {
  svgRef: React.Ref<SVGSVGElement>;
  surfaceRef: React.Ref<SVGSVGElement>;
};
