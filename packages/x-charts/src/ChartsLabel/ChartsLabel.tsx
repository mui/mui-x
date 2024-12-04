'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
// import { labelClasses, useUtilityClasses } from './labelClasses';

export interface ChartsLabelProps {
  /**
   * Style applied to legend labels.
   * @default theme.typography.subtitle1
   */
  labelStyle?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Generates the label  for the tooltip and legend.
 */
const ChartsLabel = styled('div', {
  name: 'MuiChartsLabel',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<ChartsLabelProps>(({ theme, labelStyle }) => ({
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.text.primary,
  ...labelStyle,
}));

export default ChartsLabel;
export { ChartsLabel };
