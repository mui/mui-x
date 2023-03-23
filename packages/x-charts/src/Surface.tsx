import * as React from 'react';

export interface SurfaceProps {
  width: number;
  height: number;
  viewBox?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
  className?: string;
  title?: string;
  desc?: string;
  children?: React.ReactNode;
}

export const Surface = React.forwardRef<SVGSVGElement, SurfaceProps>(function Surface(
  props: SurfaceProps,
  ref,
) {
  const { children, width, height, viewBox, className, ...other } = props;
  const svgView = viewBox || { width, height, x: 0, y: 0 };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`${svgView.x} ${svgView.y} ${svgView.width} ${svgView.height}`}
      ref={ref}
      {...other}
    >
      <title>{props.title}</title>
      <desc>{props.desc}</desc>
      {children}
    </svg>
  );
});
