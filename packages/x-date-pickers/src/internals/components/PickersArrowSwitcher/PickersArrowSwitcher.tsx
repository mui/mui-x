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
  const theme = useTheme();
  const isRTL = theme.direction === 'rtl';

  const {
    children,
    className,
    components = {},
    componentsProps = {},
    isNextDisabled,
    isNextHidden,
    onGoToNext,
    nextLabel,
    isPreviousDisabled,
    isPreviousHidden,
    onGoToPrevious,
    previousLabel,
    ...other
  } = props;

  const ownerState = props;

  const nextProps = {
    target: 'next' as const,
    isDisabled: isNextDisabled,
    isHidden: isNextHidden,
    goTo: onGoToNext,
    label: nextLabel,
  };

  const previousProps = {
    target: 'previous' as const,
    isDisabled: isPreviousDisabled,
    isHidden: isPreviousHidden,
    goTo: onGoToPrevious,
    label: previousLabel,
  };

  const [leftProps, rightProps] = isRTL ? [nextProps, previousProps] : [previousProps, nextProps];

  const LeftArrowButton = components.LeftArrowButton ?? PickersArrowSwitcherButton;
  const leftArrowButtonProps = useSlotProps({
    elementType: LeftArrowButton,
    externalSlotProps: componentsProps.leftArrowButton,
    additionalProps: {
      size: 'small',
      title: leftProps.label,
      'aria-label': leftProps.label,
      disabled: leftProps.isDisabled,
      edge: 'end',
      onClick: leftProps.goTo,
    },
    ownerState: { ...ownerState, hidden: leftProps.isHidden, target: leftProps.target },
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
      title: rightProps.label,
      'aria-label': rightProps.label,
      disabled: rightProps.isDisabled,
      edge: 'start',
      onClick: rightProps.goTo,
    },
    ownerState: { ...ownerState, hidden: rightProps.isHidden, target: rightProps.target },
    className: classes.button,
  });

  const RightArrowIcon = components?.RightArrowIcon ?? ArrowRight;
  const { ownerState: rightArrowIconOwnerState, ...rightArrowIconProps } = useSlotProps({
    elementType: RightArrowIcon,
    externalSlotProps: componentsProps.rightArrowIcon,
    ownerState: undefined,
  });

  const leftPart = (
    <LeftArrowButton {...leftArrowButtonProps}>
      <LeftArrowIcon {...leftArrowIconProps} />
    </LeftArrowButton>
  );

  const rightPart = (
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
      {isRTL ? rightPart : leftPart}
      {children ? (
        <Typography variant="subtitle1" component="span">
          {children}
        </Typography>
      ) : (
        <PickersArrowSwitcherSpacer className={classes.spacer} ownerState={ownerState} />
      )}
      {isRTL ? leftPart : rightPart}
    </PickersArrowSwitcherRoot>
  );
});
