import * as React from 'react';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { generateUtilityClasses } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import IconButton from '@mui/material/IconButton';
import { ArrowLeft, ArrowRight } from '../icons';
import { PickersArrowSwitcherProps } from './PickersArrowSwitcher.types';
import { useLocaleText } from '../../hooks/useUtils';

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
    isNextDisabled,
    isNextHidden,
    goToNext,
    isPreviousDisabled,
    isPreviousHidden,
    goToPrevious,
    ...other
  } = props;

  const localeText = useLocaleText();
  const theme = useTheme();
  const ownerState = props;

  const nextProps = {
    isDisabled: isNextDisabled,
    isHidden: isNextHidden,
    goTo: goToNext,
    text: localeText.openNextView,
  };

  const previousProps = {
    isDisabled: isPreviousDisabled,
    isHidden: isPreviousHidden,
    goTo: goToPrevious,
    text: localeText.openPreviousView,
  };

  const [leftProps, rightProps] =
    theme.direction === 'rtl' ? [nextProps, previousProps] : [previousProps, nextProps];

  const LeftArrowButton = components.LeftArrowButton ?? PickersArrowSwitcherButton;
  const leftArrowButtonProps = useSlotProps({
    elementType: LeftArrowButton,
    externalSlotProps: componentsProps.leftArrowButton,
    additionalProps: {
      size: 'small',
      'aria-label': leftProps.text,
      title: leftProps.text,
      disabled: leftProps.isDisabled,
      edge: 'end',
      onClick: leftProps.goTo,
    },
    ownerState: { ...ownerState, hidden: leftProps.isHidden },
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
      'aria-label': rightProps.text,
      title: rightProps.text,
      disabled: rightProps.isDisabled,
      edge: 'start',
      onClick: rightProps.goTo,
    },
    ownerState: { ...ownerState, hidden: rightProps.isHidden },
    className: classes.button,
  });

  const RightArrowIcon = components?.RightArrowIcon ?? ArrowRight;
  const { ownerState: rightArrowIconOwnerState, ...rightArrowIconProps } = useSlotProps({
    elementType: RightArrowIcon,
    externalSlotProps: componentsProps.rightArrowIcon,
    ownerState: undefined,
  });

  return (
    <PickersArrowSwitcherRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      {...other}
    >
      <LeftArrowButton {...leftArrowButtonProps}>
        <LeftArrowIcon {...leftArrowIconProps} />
      </LeftArrowButton>
      {children ? (
        <Typography variant="subtitle1" component="span">
          {children}
        </Typography>
      ) : (
        <PickersArrowSwitcherSpacer className={classes.spacer} ownerState={ownerState} />
      )}
      <RightArrowButton {...rightArrowButtonProps}>
        <RightArrowIcon {...rightArrowIconProps} />
      </RightArrowButton>
    </PickersArrowSwitcherRoot>
  );
});
