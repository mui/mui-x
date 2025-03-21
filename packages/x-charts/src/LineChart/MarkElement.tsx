'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { symbol as d3Symbol, symbolsFill as d3SymbolsFill } from '@mui/x-charts-vendor/d3-shape';
import { animated, to, useSpringValue } from '@react-spring/web';
import { getSymbol } from '../internals/getSymbol';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { useItemHighlighted } from '../hooks/useItemHighlighted';
import { MarkElementOwnerState, useUtilityClasses } from './markElementClasses';
import {
  UseChartCartesianAxisSignature,
  selectorChartsInteractionXAxisIndex,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { useSelector } from '../internals/store/useSelector';
import { useStore } from '../internals/store/useStore';

const MarkElementPath = styled(animated.path, {
  name: 'MuiMarkElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: MarkElementOwnerState }>(({ ownerState, theme }) => ({
  fill: (theme.vars || theme).palette.background.paper,
  stroke: ownerState.color,
  strokeWidth: 2,
}));

export type MarkElementProps = Omit<MarkElementOwnerState, 'isFaded' | 'isHighlighted'> &
  Omit<React.SVGProps<SVGPathElement>, 'ref' | 'id'> & {
    /**
     * If `true`, animations are skipped.
     * @default false
     */
    skipAnimation?: boolean;
    /**
     * The shape of the marker.
     */
    shape: 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
    /**
     * The index to the element in the series' data array.
     */
    dataIndex: number;
  };

/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [MarkElement API](https://mui.com/x/api/charts/mark-element/)
 */
function MarkElement(props: MarkElementProps) {
  const {
    x,
    y,
    id,
    classes: innerClasses,
    color,
    shape,
    dataIndex,
    onClick,
    skipAnimation,
    ...other
  } = props;

  const interactionProps = useInteractionItemProps({ type: 'line', seriesId: id, dataIndex });
  const { isFaded, isHighlighted } = useItemHighlighted({
    seriesId: id,
  });

  const store = useStore<[UseChartCartesianAxisSignature]>();
  const xAxisInteractionIndex = useSelector(store, selectorChartsInteractionXAxisIndex);

  const cx = useSpringValue(x, { immediate: skipAnimation });
  const cy = useSpringValue(y, { immediate: skipAnimation });

  React.useEffect(() => {
    cy.start(y, { immediate: skipAnimation });
    cx.start(x, { immediate: skipAnimation });
  }, [cy, y, cx, x, skipAnimation]);

  const ownerState = {
    id,
    classes: innerClasses,
    isHighlighted: xAxisInteractionIndex === dataIndex || isHighlighted,
    isFaded,
    color,
  };
  const classes = useUtilityClasses(ownerState);

  return (
    <MarkElementPath
      {...other}
      style={{
        transform: to([cx, cy], (pX, pY) => `translate(${pX}px, ${pY}px)`),
        transformOrigin: to([cx, cy], (pX, pY) => `${pX}px ${pY}px`),
      }}
      ownerState={ownerState}
      // @ts-expect-error
      className={classes.root}
      d={d3Symbol(d3SymbolsFill[getSymbol(shape)])()!}
      onClick={onClick}
      cursor={onClick ? 'pointer' : 'unset'}
      {...interactionProps}
    />
  );
}

MarkElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  /**
   * The index to the element in the series' data array.
   */
  dataIndex: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * The shape of the marker.
   */
  shape: PropTypes.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'])
    .isRequired,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: PropTypes.bool,
} as any;

export { MarkElement };
