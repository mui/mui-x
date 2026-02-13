'use client';
import { styled, type SxProps, type Theme, useThemeProps } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as React from 'react';
import clsx from 'clsx';
import { ChartsAxesGradients } from '../internals/components/ChartsAxesGradients';
import { useChartContext } from '../context/ChartProvider';
import {
  selectorChartSvgWidth,
  selectorChartSvgHeight,
} from '../internals/plugins/corePlugins/useChartDimensions/useChartDimensions.selectors';
import { useUtilityClasses } from './chartsSvgLayerClasses';
import type { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction/useChartInteraction.types';
import type { UseChartItemClickSignature } from '../internals/plugins/featurePlugins/useChartItemClick';

export interface ChartsSvgLayerProps extends Omit<
  React.SVGProps<SVGSVGElement>,
  'id' | 'children' | 'className' | 'height' | 'width' | 'cx' | 'cy' | 'viewBox' | 'color' | 'ref'
> {
  className?: string;
  title?: string;
  desc?: string;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
}

const ChartsSvgLayerStyles = styled('svg', {
  name: 'MuiChartsSvgLayer',
  slot: 'Root',
})({
  width: '100%',
  height: '100%',
  position: 'absolute',
  inset: 0,
});

/**
 * A layer that provides the drawing area SVG the chart elements.
 * Must be wrapped in a `<ChartsLayerContainer>`.
 *
 * It provides the `title` and `desc` elements for the chart.
 *
 * Demos:
 *
 * - [Composition](https://mui.com/x/api/charts/composition/)
 *
 * API:
 *
 * - [ChartsSvgLayer API](https://mui.com/x/api/charts/charts-svg-layer/)
 */
const ChartsSvgLayer = React.forwardRef<SVGSVGElement, ChartsSvgLayerProps>(
  function ChartsSvgLayer(inProps, ref) {
    const { store, instance } = useChartContext<
      [],
      [UseChartInteractionSignature, UseChartItemClickSignature]
    >();

    const svgWidth = store.use(selectorChartSvgWidth);
    const svgHeight = store.use(selectorChartSvgHeight);

    const themeProps = useThemeProps({ props: inProps, name: 'MuiChartsSvgLayer' });

    const { children, className, title, desc, ...other } = themeProps;

    const classes = useUtilityClasses();
    const hasIntrinsicSize = svgHeight > 0 && svgWidth > 0;

    return (
      <ChartsSvgLayerStyles
        viewBox={`${0} ${0} ${svgWidth} ${svgHeight}`}
        className={clsx(classes.root, className)}
        {...other}
        onPointerEnter={(event) => {
          other.onPointerEnter?.(event);
          instance.handlePointerEnter?.(event);
        }}
        onPointerLeave={(event) => {
          other.onPointerLeave?.(event);
          instance.handlePointerLeave?.(event);
        }}
        onClick={(event) => {
          other.onClick?.(event);
          instance.handleClick?.(event);
        }}
        ref={ref}
      >
        {title && <title>{title}</title>}
        {desc && <desc>{desc}</desc>}
        <ChartsAxesGradients />
        {hasIntrinsicSize && children}
      </ChartsSvgLayerStyles>
    );
  },
);

ChartsSvgLayer.propTypes = {
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

export { ChartsSvgLayer };
