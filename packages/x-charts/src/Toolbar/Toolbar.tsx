import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { ToolbarContextProvider } from '@mui/x-internals/ToolbarContext';
import { useRenderElement, MUIXUIComponentProps } from '@mui/x-internals/useRenderElement';
import { chartsToolbarClasses } from './chartToolbarClasses';

const ToolbarRoot = styled('div', {
  name: 'MuiChartsToolbar',
  slot: 'Root',
})(({ theme }) => ({
  flex: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'end',
  gap: theme.spacing(0.25),
  padding: theme.spacing(0.5),
  minHeight: 44,
  boxSizing: 'border-box',
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderRadius: 4,
}));

export interface ToolbarProps extends MUIXUIComponentProps<typeof ToolbarRoot, {}> {}

export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(props, ref) {
  const { className, render, ...other } = props;
  const element = useRenderElement(ToolbarRoot, props, {
    ref,
    props: [
      {
        role: 'toolbar',
        'aria-orientation': 'horizontal',
        className: chartsToolbarClasses.root,
      },
      other,
    ],
  });

  return <ToolbarContextProvider>{element}</ToolbarContextProvider>;
});

Toolbar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;
