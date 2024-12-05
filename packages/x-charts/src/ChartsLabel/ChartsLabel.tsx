'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ChartsLabelClasses, useUtilityClasses } from './labelClasses';
// import { labelClasses, useUtilityClasses } from './labelClasses';

export interface ChartsLabelProps {
  /**
   * Style applied to legend labels.
   * @default theme.typography.caption
   */
  // eslint-disable-next-line react/no-unused-prop-types
  labelStyle?: React.CSSProperties;
  /**
   * Override or extend the styles applied to the component.
   */
  // eslint-disable-next-line react/no-unused-prop-types
  classes?: Partial<ChartsLabelClasses>;
  children?: React.ReactNode;
}

const Root = styled('div', {
  name: 'MuiChartsLabel',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: ChartsLabelProps }>(({ theme, ownerState }) => ({
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.text.primary,
  ...ownerState.labelStyle,
  lineHeight: undefined,
  display: 'flex',
}));

/**
 * Generates the label mark for the tooltip and legend.
 */
export default function ChartsLabel(props: ChartsLabelProps) {
  const { children } = props;

  const classes = useUtilityClasses(props);

  return (
    <Root className={classes.root} ownerState={props}>
      {children}
    </Root>
  );
}

export { ChartsLabel };
