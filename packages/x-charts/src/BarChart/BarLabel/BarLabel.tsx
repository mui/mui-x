import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import { animated } from '@react-spring/web';
import PropTypes from 'prop-types';
import { barLabelClasses } from './barLabelClasses';
import { BarLabelOwnerState } from './BarLabel.types';

export const BarLabelComponent = styled(animated.text, {
  name: 'MuiBarLabel',
  slot: 'Root',
  overridesResolver: (_, styles) => [
    { [`&.${barLabelClasses.faded}`]: styles.faded },
    { [`&.${barLabelClasses.highlighted}`]: styles.highlighted },
    styles.root,
  ],
})(({ theme }) => ({
  ...theme?.typography?.body2,
  stroke: 'none',
  fill: (theme.vars || theme)?.palette?.text?.primary,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  textAnchor: 'middle',
  dominantBaseline: 'central',
  pointerEvents: 'none',
  opacity: 1,
  [`&.${barLabelClasses.faded}`]: {
    opacity: 0.3,
  },
}));

export type BarLabelProps = Omit<React.SVGProps<SVGTextElement>, 'ref' | 'id'> & {
  ownerState: BarLabelOwnerState;
};

function BarLabel(props: BarLabelProps) {
  const themeProps = useThemeProps({ props, name: 'MuiBarLabel' });

  return <BarLabelComponent {...themeProps} />;
}

BarLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  ownerState: PropTypes.shape({
    classes: PropTypes.object,
    color: PropTypes.string.isRequired,
    dataIndex: PropTypes.number.isRequired,
    isFaded: PropTypes.bool.isRequired,
    isHighlighted: PropTypes.bool.isRequired,
    seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }).isRequired,
} as any;

export { BarLabel };
