import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { SeriesId } from '../models/seriesType/common';

export interface LineHighlightElementClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type HighlightElementClassKey = keyof LineHighlightElementClasses;

interface LineHighlightElementOwnerState {
  id: SeriesId;
  color: string;
  x: number;
  y: number;
  classes?: Partial<LineHighlightElementClasses>;
}

export function getHighlightElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiHighlightElement', slot);
}

export const lineHighlightElementClasses: LineHighlightElementClasses = generateUtilityClasses(
  'MuiHighlightElement',
  ['root'],
);

const useUtilityClasses = (ownerState: LineHighlightElementOwnerState) => {
  const { classes, id } = ownerState;
  const slots = {
    root: ['root', `series-${id}`],
  };

  return composeClasses(slots, getHighlightElementUtilityClass, classes);
};

const HighlightElement = styled('circle', {
  name: 'MuiHighlightElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: LineHighlightElementOwnerState }>(({ ownerState }) => ({
  transform: `translate(${ownerState.x}px, ${ownerState.y}px)`,
  transformOrigin: `${ownerState.x}px ${ownerState.y}px`,
  fill: ownerState.color,
}));

export type LineHighlightElementProps = LineHighlightElementOwnerState &
  Omit<React.SVGProps<SVGCircleElement>, 'ref' | 'id'>;

/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LineHighlightElement API](https://mui.com/x/api/charts/line-highlight-element/)
 */
function LineHighlightElement(props: LineHighlightElementProps) {
  const { x, y, id, classes: innerClasses, color, ...other } = props;

  const ownerState = {
    id,
    classes: innerClasses,
    color,
    x,
    y,
  };
  const classes = useUtilityClasses(ownerState);

  return (
    <HighlightElement
      pointerEvents="none"
      ownerState={ownerState}
      className={classes.root}
      cx={0}
      cy={0}
      r={other.r === undefined ? 5 : other.r}
      {...other}
    />
  );
}

LineHighlightElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
} as any;

export { LineHighlightElement };
