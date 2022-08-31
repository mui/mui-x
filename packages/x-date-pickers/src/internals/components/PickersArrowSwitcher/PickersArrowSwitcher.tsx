import * as React from 'react';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { generateUtilityClasses } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import IconButton from '@mui/material/IconButton';
import { ArrowLeft, ArrowRight } from '../icons';
import { PickersArrowSwitcherProps } from './PickersArrowSwitcher.types';

const classes = generateUtilityClasses('MuiPickersArrowSwitcher', ['root', 'spacer', 'button']);

const PickersArrowSwitcherRoot = styled('div', {
  name: 'MuiPickersArrowSwitcher',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{
  ownerState: PickersArrowSwitcherProps;
}>({
  display: 'flex',
});

const PickersArrowSwitcherSpacer = styled('div', {
  name: 'MuiPickersArrowSwitcher',
  slot: 'Spacer',
  overridesResolver: (props, styles) => styles.spacer,
})<{
  ownerState: PickersArrowSwitcherProps;
}>(({ theme }) => ({
  width: theme.spacing(3),
}));

const PickersArrowSwitcherButton = styled(IconButton, {
  name: 'MuiPickersArrowSwitcher',
  slot: 'Button',
  overridesResolver: (props, styles) => styles.button,
})<{
  ownerState: PickersArrowSwitcherProps;
}>(({ ownerState }) => ({
  ...(ownerState.hidden && {
    visibility: 'hidden',
  }),
}));

export const PickersArrowSwitcher = React.forwardRef(function PickersArrowSwitcher(
  props: PickersArrowSwitcherProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    children,
    className,
    components = {},
    componentsProps = {},
    isLeftDisabled,
    isLeftHidden,
    isRightDisabled,
    isRightHidden,
    leftArrowButtonText,
    onLeftClick,
    onRightClick,
    rightArrowButtonText,
    ...other
  } = props;
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const ownerState = props;

  const LeftArrowButton = components.LeftArrowButton ?? PickersArrowSwitcherButton;
  const leftArrowButtonProps = useSlotProps({
    elementType: LeftArrowButton,
    externalSlotProps: componentsProps.leftArrowButton,
    additionalProps: {
      size: 'small',
      'aria-label': leftArrowButtonText,
      title: leftArrowButtonText,
      disabled: isLeftDisabled,
      edge: 'end',
      onClick: onLeftClick,
    },
    ownerState: { ...ownerState, hidden: isLeftHidden },
    className: classes.button,
  });

  const LeftArrowIcon = components?.LeftArrowIcon ?? ArrowLeft;
  const { ownerState: leftArrowIconOwnerState, ...leftArrowIconProps } = useSlotProps({
    elementType: LeftArrowIcon,
    externalSlotProps: componentsProps.leftArrowIcon,
    ownerState: undefined,
  });

  const RightArrowButton = components.RightArrowButton ?? PickersArrowSwitcherButton;
  const rightArrowButtonProps = useSlotProps({
    elementType: RightArrowButton,
    externalSlotProps: componentsProps.rightArrowButton,
    additionalProps: {
      size: 'small',
      'aria-label': rightArrowButtonText,
      title: rightArrowButtonText,
      disabled: isRightDisabled,
      edge: 'start',
      onClick: onRightClick,
    },
    ownerState: { ...ownerState, hidden: isRightHidden },
    className: classes.button,
  });

  const RightArrowIcon = components?.RightArrowIcon ?? ArrowRight;
  const { ownerState: rightArrowIconOwnerState, ...rightArrowIconProps } = useSlotProps({
    elementType: RightArrowIcon,
    externalSlotProps: componentsProps.rightArrowIcon,
    ownerState: undefined,
  });

  const leftArrowButton = (
    <LeftArrowButton {...leftArrowButtonProps}>
      <LeftArrowIcon {...leftArrowIconProps} />
    </LeftArrowButton>
  );

  const rightArrowButton = (
    <RightArrowButton {...rightArrowButtonProps}>
      <RightArrowIcon {...rightArrowIconProps} />
    </RightArrowButton>
  );

  return (
    <PickersArrowSwitcherRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      {...other}
    >
      {isRtl ? rightArrowButton : leftArrowButton}
      {children ? (
        <Typography variant="subtitle1" component="span">
          {children}
        </Typography>
      ) : (
        <PickersArrowSwitcherSpacer className={classes.spacer} ownerState={ownerState} />
      )}
      {isRtl ? leftArrowButton : rightArrowButton}
    </PickersArrowSwitcherRoot>
  );
});
