import { styled, SxProps, Theme } from '@mui/system';
import * as React from 'react';
import { useAxisEvents } from './hooks/useAxisEvents';

type ViewBox = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};
export interface ChartsSurfaceProps {
  width: number;
  height: number;
  viewBox?: ViewBox;
  className?: string;
  title?: string;
  desc?: string;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
  disableAxisListener?: boolean;
}

const ChartChartsSurfaceStyles = styled('svg', {
  name: 'MuiChartsSurface',
  slot: 'Root',
})(() => ({}));

export const ChartsSurface = React.forwardRef<SVGSVGElement, ChartsSurfaceProps>(
  function ChartsSurface(props: ChartsSurfaceProps, ref) {
    const {
      children,
      width,
      height,
      viewBox,
      disableAxisListener = false,
      className,
      sx,
      ...other
    } = props;
    const svgView = { width, height, x: 0, y: 0, ...viewBox };

    useAxisEvents(disableAxisListener);

    return (
      <ChartChartsSurfaceStyles
        width={width}
        height={height}
        viewBox={`${svgView.x} ${svgView.y} ${svgView.width} ${svgView.height}`}
        ref={ref}
        sx={[
          {
            '--ChartsLegend-itemWidth': '100px',
            '--ChartsLegend-itemMarkSize': '20px',
            '--ChartsLegend-rootSpacing': '5px',
            '--ChartsLegend-labelSpacing': '5px',
            '--ChartsLegend-rootOffsetY': '-20px',
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <title>{props.title}</title>
        <desc>{props.desc}</desc>
        {children}
      </ChartChartsSurfaceStyles>
    );
  },
);
