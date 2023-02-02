import * as React from 'react';

interface SurfaceProps {
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

export function Surface(props: SurfaceProps) {
  const { children, width, height, viewBox, className, ...other } = props;
  const svgView = viewBox || { width, height, x: 0, y: 0 };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`${svgView.x} ${svgView.y} ${svgView.width} ${svgView.height}`}
      {...other}
    >
      <title>{props.title}</title>
      <desc>{props.desc}</desc>
      {children}
    </svg>
  );
}
