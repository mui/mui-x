import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import clsx from 'clsx';
import useForkRef from '@mui/utils/useForkRef';
import { useUtilityClasses } from '../ChartsSurface/chartsSurfaceClasses';
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

export interface ChartsLayerContainerProps extends React.ComponentProps<'div'> {}

/**
 * TODO: add docs
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
    const { children, className, ...other } = themeProps;

    const classes = useUtilityClasses();

    const svgRef = useSvgRef();
    const handleRef = useForkRef(svgRef, ref);

    return (
      <ChartsLayerContainerDiv
        ref={handleRef}
        ownerState={{ width: propsWidth, height: propsHeight }}
        tabIndex={isKeyboardNavigationEnabled ? 0 : undefined}
        className={clsx(classes.root, className)}
        {...other}
      >
        {children}
      </ChartsLayerContainerDiv>
    );
  },
);
