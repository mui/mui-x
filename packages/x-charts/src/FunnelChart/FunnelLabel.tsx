'use client';
import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import PropTypes from 'prop-types';

export const FunnelLabelComponent = styled('text', {
  name: 'MuiFunnelLabel',
  slot: 'Root',
  overridesResolver: (_, styles) => [styles.root],
})(({ theme }) => ({
  ...theme?.typography?.body2,
  stroke: 'none',
  fill: (theme.vars || theme)?.palette?.text?.primary,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  // textAnchor: 'middle',
  // dominantBaseline: 'central',
  pointerEvents: 'none',
  opacity: 1,
}));

export interface FunnelLabelProps extends Omit<React.SVGProps<SVGTextElement>, 'ref' | 'id'> {}

function FunnelLabel(inProps: FunnelLabelProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiFunnelLabel' });

  const { ...otherProps } = props;

  return <FunnelLabelComponent {...otherProps} />;
}

FunnelLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
} as any;

export { FunnelLabel };
