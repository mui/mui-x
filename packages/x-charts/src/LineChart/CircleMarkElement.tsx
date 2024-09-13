'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { warnOnce } from '@mui/x-internals/warning';
import { animated, useSpring } from '@react-spring/web';
import { InteractionContext } from '../context/InteractionProvider';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { useItemHighlighted } from '../context';
import { MarkElementOwnerState, useUtilityClasses } from './markElementClasses';

export type CircleMarkElementProps = Omit<MarkElementOwnerState, 'isFaded' | 'isHighlighted'> &
  Omit<React.SVGProps<SVGPathElement>, 'ref' | 'id'> & {
    /**
     * The shape of the marker.
     */
    shape: 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
    /**
     * If `true`, animations are skipped.
     * @default false
     */
    skipAnimation?: boolean;
    /**
     * The index to the element in the series' data array.
     */
    dataIndex: number;
  };

/**
 * The line mark element that only render circle for performance improvement.
 *
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [CircleMarkElement API](https://mui.com/x/api/charts/circle-mark-element/)
 */
function CircleMarkElement(props: CircleMarkElementProps) {
  const {
    x,
    y,
    id,
    classes: innerClasses,
    color,
    dataIndex,
    onClick,
    skipAnimation,
    shape,
    ...other
  } = props;

  if (shape !== 'circle') {
    warnOnce(
      [
        `MUI X: The mark element of your line chart have shape "${shape}" which is not supported when using \`experimentalRendering=true\`.`,
        'Only "circle" are supported with `experimentalRendering`.',
      ].join('\n'),
      'error',
    );
  }
  const theme = useTheme();
  const getInteractionItemProps = useInteractionItemProps();
  const { isFaded, isHighlighted } = useItemHighlighted({
    seriesId: id,
  });
  const { axis } = React.useContext(InteractionContext);

  const position = useSpring({ to: { x, y }, immediate: skipAnimation });
  const ownerState = {
    id,
    classes: innerClasses,
    isHighlighted: axis.x?.index === dataIndex || isHighlighted,
    isFaded,
    color,
  };
  const classes = useUtilityClasses(ownerState);

  return (
    <animated.circle
      {...other}
      cx={position.x}
      cy={position.y}
      r={5}
      fill={(theme.vars || theme).palette.background.paper}
      stroke={color}
      strokeWidth={2}
      className={classes.root}
      onClick={onClick}
      cursor={onClick ? 'pointer' : 'unset'}
      {...getInteractionItemProps({ type: 'line', seriesId: id, dataIndex })}
    />
  );
}

CircleMarkElement.propTypes = {
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

export { CircleMarkElement };
