import * as React from 'react';
import MUIButtonBase, { ButtonBaseProps as MUIButtonBaseProps } from '@mui/material/ButtonBase';
import { alpha, styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { getDataGridToolbarUtilityClass } from '../../constants/gridToolbarClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export interface ToolbarButtonProps extends MUIButtonBaseProps {
  /**
   * The size of the component.
   * @default 'small'
   */
  size?: 'small' | 'medium' | 'large';
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
})<ToolbarButtonProps & { ownerState: OwnerState }>(({ theme }) => ({
  ...theme.typography.button,
  borderRadius: (theme.vars || theme).shape.borderRadius,
  padding: 12,
  color: (theme.vars || theme).palette.action.active,
  gap: theme.spacing(1),
  lineHeight: 'normal',
  whiteSpace: 'nowrap',
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
      props: { fullWidth: true },
      style: {
        width: '100%',
      },
    },
    {
      props: { size: 'small' },
      style: {
        padding: 8,
        fontSize: theme.typography.pxToRem(13),
      },
    },
    {
      props: { size: 'large' },
      style: {
        padding: 16,
        fontSize: theme.typography.pxToRem(15),
      },
    },
  ],
}));

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  function ToolbarButton(props, ref) {
    const { size = 'medium', focusRipple = true, ...other } = props;
    const rootProps = useGridRootProps();

    const ownerState = {
      ...rootProps,
      size,
    };

    const classes = useUtilityClasses(ownerState);

    return (
      <StyledToolbarButton
        ref={ref}
        className={classes.button}
        ownerState={ownerState}
        focusRipple={focusRipple}
        size={size}
        {...other}
      />
    );
  },
);

export { ToolbarButton };
