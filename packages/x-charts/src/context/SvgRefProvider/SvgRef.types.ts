import * as React from 'react';

export interface SvgRefProviderProps {
  children: React.ReactNode;
  svgRef: React.Ref<SVGSVGElement>;
}

export type SvgRefState = React.Ref<SVGSVGElement>;
