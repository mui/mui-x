import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import clsx from 'clsx';
import ButtonBase, { ButtonBaseProps } from '@mui/material/ButtonBase';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';

export type GridToolbarButtonProps = ButtonBaseProps & {
  color?: 'standard' | 'primary';
};

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarButton'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

// Based on @mui/material/ToggleButton styles
const StyledGridToolbarButton = styled(ButtonBase, {
  name: 'MuiDataGrid',
  slot: 'ToolbarButton',
  overridesResolver: (_, styles) => styles.toolbarButton,
})<{ ownerState: OwnerState; selected?: boolean }>(({ theme }) => ({
  ...theme.typography.button,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  borderRadius: (theme.vars || theme).shape.borderRadius,
  padding: 7,
  minHeight: 34,
  fontSize: theme.typography.pxToRem(13),
  lineHeight: 'normal',
  color: (theme.vars || theme).palette.action.active,
  '&:disabled': {
    color: (theme.vars || theme).palette.action.disabled,
    border: `1px solid ${(theme.vars || theme).palette.action.disabledBackground}`,
  },
  '&:hover': {
    textDecoration: 'none',
    // Reset on mouse devices
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.text.primaryChannel} / ${theme.vars.palette.action.hoverOpacity})`
      : alpha(theme.palette.text.primary, theme.palette.action.hoverOpacity),
    '@media (hover: none)': {
      backgroundColor: 'transparent',
    },
  },
  variants: [
    {
      props: { selected: true, color: 'standard' },
      style: {
        color: (theme.vars || theme).palette.text.primary,
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.text.primaryChannel} / ${theme.vars.palette.action.selectedOpacity})`
          : alpha(theme.palette.text.primary, theme.palette.action.selectedOpacity),
        '&:hover': {
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.text.primaryChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${theme.vars.palette.action.hoverOpacity}))`
            : alpha(
                theme.palette.text.primary,
                theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity,
              ),
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.text.primaryChannel} / ${theme.vars.palette.action.selectedOpacity})`
              : alpha(theme.palette.text.primary, theme.palette.action.selectedOpacity),
          },
        },
      },
    },
    {
      props: { color: 'primary' },
      style: {
        color: (theme.vars || theme).palette.primary.main,
      },
    },
    {
      props: { selected: true, color: 'primary' },
      style: {
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.selectedOpacity})`
          : alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
        '&:hover': {
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.primary.mainChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${theme.vars.palette.action.hoverOpacity}))`
            : alpha(
                theme.palette.primary.main,
                theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity,
              ),
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.selectedOpacity})`
              : alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
          },
        },
      },
    },
  ],
}));

const GridToolbarButton = React.forwardRef<HTMLButtonElement, GridToolbarButtonProps>(
  function GridToolbarButton(props, ref) {
    const { children, className, color = 'standard', ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);

    return (
      <StyledGridToolbarButton
        ref={ref}
        ownerState={rootProps}
        className={clsx(classes.root, className)}
        color={color}
        selected={!!other['aria-expanded']}
        focusRipple
        {...other}
      >
        {children}
      </StyledGridToolbarButton>
    );
  },
);

export { GridToolbarButton };
