import * as React from 'react';
import MUIButtonBase, { ButtonBaseProps as MUIButtonBaseProps } from '@mui/material/ButtonBase';
import { alpha, styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { capitalize } from '@mui/material/utils';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { getDataGridToolbarButtonUtilityClass } from './gridToolbarButtonClasses';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

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

type OwnerState = Pick<ToolbarButtonProps, 'size' | 'disabled'> & DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes, size, disabled } = ownerState;

  const slots = {
    root: ['root', disabled && 'disabled', size && `size${capitalize(size)}`],
  };

  return composeClasses(slots, getDataGridToolbarButtonUtilityClass, classes);
};

const StyledToolbarButton = styled(MUIButtonBase, {
  name: 'MuiDataGridToolbarButton',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const { ownerState } = props;

    return [styles.root, styles[`size${capitalize(ownerState.size)}`]];
  },
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
    const { size = 'medium', focusRipple = true, disabled, ...other } = props;
    const rootProps = useGridRootProps();

    const ownerState = {
      ...rootProps,
      disabled,
      size,
    };

    const classes = useUtilityClasses(ownerState);

    return (
      <StyledToolbarButton
        ref={ref}
        className={classes.root}
        ownerState={ownerState}
        focusRipple={focusRipple}
        disabled={disabled}
        size={size}
        {...other}
      />
    );
  },
);

export { ToolbarButton };
