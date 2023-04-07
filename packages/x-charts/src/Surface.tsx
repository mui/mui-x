import { styled, SxProps, Theme } from '@mui/system';
import * as React from 'react';

type ViewBox = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};
export interface SurfaceProps {
  width: number;
  height: number;
  viewBox?: ViewBox;
  className?: string;
  title?: string;
  desc?: string;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
}

const ChartSurfaceStyles = styled('svg', {
  name: 'MuiChartsSurface',
  slot: 'Root',
})(() => ({}));

export const Surface = React.forwardRef<SVGSVGElement, SurfaceProps>(function Surface(
  props: SurfaceProps,
  ref,
) {
  const { children, width, height, viewBox, className, ...other } = props;
  const svgView = { width, height, x: 0, y: 0, ...viewBox };

  return (
    <ChartSurfaceStyles
      width={width}
      height={height}
      viewBox={`${svgView.x} ${svgView.y} ${svgView.width} ${svgView.height}`}
      ref={ref}
      {...other}
    >
      <title>{props.title}</title>
      <desc>{props.desc}</desc>
      {children}
    </ChartSurfaceStyles>
  );
});
