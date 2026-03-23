import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { warnOnce } from '@mui/x-internals/warning';
import { styled, useThemeProps, type SxProps, type Theme } from '@mui/material/styles';
import useForkRef from '@mui/utils/useForkRef';
import useId from '@mui/utils/useId';
import { useUtilityClasses } from '../ChartsSurface/chartsSurfaceClasses';
import {
  selectorChartPropsHeight,
  selectorChartPropsWidth,
} from '../internals/plugins/corePlugins/useChartDimensions';
import { selectorChartsIsKeyboardNavigationEnabled } from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';
import { type UseChartItemClickSignature } from '../internals/plugins/featurePlugins/useChartItemClick';
import { type UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import { useChartsContext } from '../context/ChartsProvider';
import { useChartsLayerContainerRef } from '../hooks';
import { useRegisterPointerInteractions } from '../internals/plugins/featurePlugins/shared/useRegisterPointerInteractions';
// eslint-disable-next-line import/no-cycle
import { ChartsSurface } from '../ChartsSurface';

const ChartsLayerContainerDiv = styled('div', {
  name: 'MuiChartsLayerContainer',
  slot: 'Root',
})<{ ownerState: { width?: number; height?: number } }>(({ ownerState }) => ({
  width: ownerState.width ?? '100%',
  height: ownerState.height ?? '100%',
  // This is a hack to let the content expand a bit when possible, but not overflow when the container is too small.
  aspectRatio: '1 / 1',
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
  /**
   * The title of the chart.
   * Used to provide an accessible label for the chart.
   */
  title?: string;
  /**
   * The description of the chart.
   * Used to provide an accessible description for the chart.
   */
  desc?: string;
  sx?: SxProps<Theme>;
}

/**
 * A component that contains the chart layers, such as `<ChartsSvgLayer>`, and `<ChartsWebGLLayer>`.
 * It is responsible for positioning itself and providing the dimensions and interaction context to its children layers.
 */
const ChartsLayerContainer = React.forwardRef<HTMLDivElement, ChartsLayerContainerProps>(
  function ChartsLayerContainer(inProps, ref) {
    const { store, instance } = useChartsContext<
      [],
      [UseChartInteractionSignature, UseChartItemClickSignature]
    >();
    const propsWidth = store.use(selectorChartPropsWidth);
    const propsHeight = store.use(selectorChartPropsHeight);
    const isKeyboardNavigationEnabled = store.use(selectorChartsIsKeyboardNavigationEnabled);

    useRegisterPointerInteractions();

    const themeProps = useThemeProps({ props: inProps, name: 'MuiChartsLayerContainer' });
    const { children, title, desc, className, ...other } = themeProps;

    const classes = useUtilityClasses();

    const chartsLayerContainerRef = useChartsLayerContainerRef();
    const handleRef = useForkRef(chartsLayerContainerRef, ref);
    const descId = useId();

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
        aria-label={title}
        aria-describedby={desc ? descId : undefined}
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
      >
        {desc && (
          <span id={descId} style={{ display: 'none' }}>
            {desc}
          </span>
        )}
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
  /**
   * The description of the chart.
   * Used to provide an accessible description for the chart.
   */
  desc: PropTypes.string,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * The title of the chart.
   * Used to provide an accessible label for the chart.
   */
  title: PropTypes.string,
} as any;

export { ChartsLayerContainer };
