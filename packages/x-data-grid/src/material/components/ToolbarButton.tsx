import * as React from 'react';
import MUIButtonBase, { ButtonBaseProps as MUIButtonBaseProps } from '@mui/material/ButtonBase';
import { alpha, styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { getDataGridToolbarUtilityClass } from '../../constants/gridToolbarClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export interface ToolbarButtonProps extends MUIButtonBaseProps {
  /**
   * The color of the button.
   * @default 'standard'
   */
  color?: 'standard' | 'primary';
  /**
   * If `true`, the base button will have a keyboard focus ripple.
   * @default true
   */
  focusRipple?: boolean;
}

type OwnerState = Pick<ToolbarButtonProps, 'color'> & DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    button: ['button'],
  };

  return composeClasses(slots, getDataGridToolbarUtilityClass, classes);
};

const StyledToolbarButton = styled(MUIButtonBase, {
  name: 'MuiDataGridToolbar',
  slot: 'Button',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  ...theme.typography.button,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  borderRadius: (theme.vars || theme).shape.borderRadius,
  padding: 7,
  height: 36,
  minWidth: 36,
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
      props: { color: 'primary' },
      style: {
        color: (theme.vars || theme).palette.primary.main,
      },
    },
  ],
}));

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  function ToolbarButton(props, ref) {
    const { color = 'standard', ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);

    return (
      <StyledToolbarButton
        ref={ref}
        color={color}
        className={classes.button}
        ownerState={rootProps}
        focusRipple
        {...other}
      />
    );
  },
);

export { ToolbarButton };
