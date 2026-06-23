'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { type ScatterClasses } from '../scatterClasses';

export interface MarkerLabelOwnerState {
  isFaded: boolean;
  classes?: Partial<ScatterClasses>;
}

export type MarkerLabelProps = Omit<React.SVGProps<SVGTextElement>, 'ref' | 'id' | 'x' | 'y'> &
  MarkerLabelOwnerState & {
    x: number;
    y: number;
  };

function MarkerLabel(props: MarkerLabelProps): React.JSX.Element {
  const { isFaded, classes, ...otherProps } = props;

  return <text opacity={isFaded ? 0.3 : 1} {...otherProps} />;
}

MarkerLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  isFaded: PropTypes.bool.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
} as any;

export { MarkerLabel };
