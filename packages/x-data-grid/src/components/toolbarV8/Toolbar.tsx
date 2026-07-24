'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import clsx from 'clsx';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import type { RenderProp } from '@mui/x-internals/useComponentRenderer';
import { ToolbarContextProvider } from '@mui/x-internals/ToolbarContext';
import { vars } from '../../constants/cssVariables';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';

export type ToolbarProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<React.ComponentProps<typeof ToolbarRoot>>;
};

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbar'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const ToolbarRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'Toolbar',
})({
  flex: '0 1 1px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'end',
  gap: vars.spacing(0.25),
  padding: vars.spacing(0.75),
  minHeight: 52,
  boxSizing: 'border-box',
  borderBottom: `1px solid ${vars.colors.border.base}`,
});

/**
 * The top level Toolbar component that provides context to child components.
 * It renders a styled `<div />` element.
 *
 * Demos:
 *
 * - [Toolbar](https://mui.com/x/react-data-grid/components/toolbar/)
 *
 * API:
 *
 * - [Toolbar API](https://mui.com/x/api/data-grid/toolbar/)
 */
const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(props, ref) {
  const { render, className, ...other } = props;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  const element = useComponentRenderer(ToolbarRoot, render, {
    role: 'toolbar',
    'aria-orientation': 'horizontal',
    'aria-label': rootProps.label || undefined,
    className: clsx(classes.root, className),
    ...other,
    ref,
  });

  return <ToolbarContextProvider>{element}</ToolbarContextProvider>;
});

Toolbar.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { Toolbar };
