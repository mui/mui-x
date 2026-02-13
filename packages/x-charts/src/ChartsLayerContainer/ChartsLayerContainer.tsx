import * as React from 'react';
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
export const ChartsLayerContainer = React.forwardRef<HTMLDivElement, ChartsLayerContainerProps>(
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
