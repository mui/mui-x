'use client';
import { type SxProps, type Theme, useThemeProps } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as React from 'react';
import clsx from 'clsx';
import { useUtilityClasses } from './chartsSurfaceClasses';
import { ChartsSvgLayer } from '../ChartsSvgLayer';
import { ChartsLayerContainer } from '../ChartsLayerContainer';

export interface ChartsSurfaceProps extends Omit<
  React.SVGProps<SVGSVGElement>,
  'id' | 'children' | 'className' | 'height' | 'width' | 'cx' | 'cy' | 'viewBox' | 'color' | 'ref'
> {
  className?: string;
  title?: string;
  desc?: string;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
}

/**
 * A helper component that combines `<ChartsLayerContainer>` and `<ChartsSvgLayer>` to provide a surface for drawing charts.
 * If you need more control over the layers, you can use `<ChartsLayerContainer>` and `<ChartsSvgLayer>` separately.
 *
 * Demos:
 *
 * - [Composition](https://mui.com/x/api/charts/composition/)
 *
 * API:
 *
 * - [ChartsSurface API](https://mui.com/x/api/charts/charts-surface/)
 */
const ChartsSurface = React.forwardRef<SVGSVGElement, ChartsSurfaceProps>(function ChartsSurface(
  inProps: ChartsSurfaceProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const themeProps = useThemeProps({ props: inProps, name: 'MuiChartsSurface' });

  const { children, className, ...other } = themeProps;

  const classes = useUtilityClasses();

  return (
    <ChartsLayerContainer className={clsx(classes.root, className)}>
      <ChartsSvgLayer {...other} ref={ref}>
        {children}
      </ChartsSvgLayer>
    </ChartsLayerContainer>
  );
});

ChartsSurface.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  className: PropTypes.string,
  desc: PropTypes.string,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  title: PropTypes.string,
} as any;

export { ChartsSurface };
