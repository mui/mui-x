import * as React from 'react';
import Button, { ButtonProps, buttonClasses } from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import clsx from 'clsx';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';

export type GridToolbarButtonProps = ButtonProps;

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarButton'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const StyledButton = styled(Button, {
  name: 'MuiDataGrid',
  slot: 'ToolbarButton',
  overridesResolver: (_, styles) => styles.toolbarButton,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  gap: theme.spacing(0.5),
  // Styles below from:
  // https://github.com/mui/material-ui/blob/master/packages/mui-material/src/ToggleButton/ToggleButton.js
  ...theme.typography.button,
  borderRadius: (theme.vars || theme).shape.borderRadius,
  color: (theme.vars || theme).palette.action.active,
  [`&.${buttonClasses.disabled}`]: {
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
      props: { size: 'small' },
      style: {
        padding: 7,
        fontSize: theme.typography.pxToRem(13),
      },
    },
    {
      props: { size: 'large' },
      style: {
        padding: 15,
        fontSize: theme.typography.pxToRem(15),
      },
    },
  ],
}));

const GridToolbarButton = React.forwardRef<HTMLButtonElement, GridToolbarButtonProps>(
  function GridToolbarButton(props, ref) {
    const { children, className, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);

    return (
      <StyledButton
        ownerState={rootProps}
        className={clsx(classes.root, className)}
        ref={ref}
        size="small"
        {...other}
      >
        {children}
      </StyledButton>
    );
  },
);

export { GridToolbarButton };
