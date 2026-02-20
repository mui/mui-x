import * as React from 'react';
import PropTypes from 'prop-types';
import { warnOnce } from '@mui/x-internals/warning';
import { styled, useThemeProps, type SxProps, type Theme } from '@mui/material/styles';
import useForkRef from '@mui/utils/useForkRef';
import {
  selectorChartPropsHeight,
  selectorChartPropsWidth,
} from '../internals/plugins/corePlugins/useChartDimensions';
import { selectorChartsIsKeyboardNavigationEnabled } from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';
import { type UseChartItemClickSignature } from '../internals/plugins/featurePlugins/useChartItemClick';
import { type UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import { useChartContext } from '../context/ChartProvider';
import { useSvgRef } from '../hooks';
// eslint-disable-next-line import/no-cycle
import { ChartsSurface } from '../ChartsSurface';

const ChartsLayerContainerDiv = styled('div', {
  name: 'MuiChartsLayerContainer',
  slot: 'Root',
})<{ ownerState: { width?: number; height?: number } }>(({ ownerState }) => ({
  width: ownerState.width ?? '100%',
  height: ownerState.height ?? '100%',
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  touchAction: 'pan-y',
  userSelect: 'none',
  gridArea: 'chart',
  '&:focus': {
    outline: 'none', // By default, don't show focus outline
  },
}));

export interface ChartsLayerContainerProps extends React.ComponentProps<'div'> {
  sx?: SxProps<Theme>;
}

/**
 * A component that contains the chart layers, such as `<ChartsSvgLayer>`, and `<ChartsWebGlLayer>`.
 * It is responsible for positioning itself and providing the dimensions and interaction context to its children layers.
 */
const ChartsLayerContainer = React.forwardRef<HTMLDivElement, ChartsLayerContainerProps>(
  function ChartsLayerContainer(inProps, ref) {
    const { store } = useChartContext<
      [],
      [UseChartInteractionSignature, UseChartItemClickSignature]
    >();
    const propsWidth = store.use(selectorChartPropsWidth);
    const propsHeight = store.use(selectorChartPropsHeight);
    const isKeyboardNavigationEnabled = store.use(selectorChartsIsKeyboardNavigationEnabled);

    const themeProps = useThemeProps({ props: inProps, name: 'MuiChartsLayerContainer' });
    const { children, ...other } = themeProps;

    const svgRef = useSvgRef();
    const handleRef = useForkRef(svgRef, ref);

    if (process.env.NODE_ENV !== 'production') {
      React.Children.forEach(children, (child) => {
        if (
          typeof child === 'object' &&
          child != null &&
          'type' in child &&
          child.type === ChartsSurface
        ) {
          warnOnce(
            'MUI X Charts: ChartsSurface should not be used inside ChartsLayerContainer. Render a ChartsSvgLayer instead.',
            'error',
          );
        }
      });
    }
    return (
      <ChartsLayerContainerDiv
        ref={handleRef}
        ownerState={{ width: propsWidth, height: propsHeight }}
        tabIndex={isKeyboardNavigationEnabled ? 0 : undefined}
        {...other}
      >
        {children}
      </ChartsLayerContainerDiv>
    );
  },
);

ChartsLayerContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChartsLayerContainer };
