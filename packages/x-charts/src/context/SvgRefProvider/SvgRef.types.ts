import * as React from 'react';

export interface SvgRefProviderProps {
  children: React.ReactNode;
  svgRef?: React.Ref<SVGSVGElement>;
}

export type SvgRefState = {
  svgRef: React.Ref<SVGSVGElement>;
  surfaceRef: React.Ref<SVGSVGElement>;
};
