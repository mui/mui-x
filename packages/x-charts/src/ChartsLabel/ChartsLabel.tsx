'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, SxProps, Theme } from '@mui/material/styles';
import clsx from 'clsx';
import { ChartsLabelClasses, useUtilityClasses } from './labelClasses';
import { consumeThemeProps } from '../internals/consumeThemeProps';

export interface ChartsLabelProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsLabelClasses>;
  children?: React.ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

const Root = styled('span', {
  name: 'MuiChartsLabel',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: ChartsLabelProps }>(({ theme }) => ({
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.text.primary,
  lineHeight: undefined,
  display: 'flex',
}));

/**
 * @ignore - internal component.
 *
 * Generates the label mark for the tooltip and legend.
 */
const ChartsLabel = consumeThemeProps(
  'MuiChartsLabel',
  {
    classesResolver: useUtilityClasses,
  },
  function ChartsLabel(props: ChartsLabelProps, ref: React.Ref<HTMLSpanElement>) {
    const { children, className, classes, ...other } = props;

    return (
      <Root className={clsx(classes?.root, className)} ownerState={props} ref={ref} {...other}>
        {children}
      </Root>
    );
  },
);

ChartsLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
} as any;

export { ChartsLabel };
