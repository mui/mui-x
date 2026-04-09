'use client';
import * as React from 'react';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { useRtl } from '@mui/system/RtlProvider';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import useForkRef from '@mui/utils/useForkRef';
import useSlotProps from '@mui/utils/useSlotProps';
import IconButton from '@mui/material/IconButton';
import { ArrowLeftIcon, ArrowRightIcon } from '../../../icons';
import {
  PickersArrowSwitcherOwnerState,
  PickersArrowSwitcherProps,
} from './PickersArrowSwitcher.types';
import {
  getPickersArrowSwitcherUtilityClass,
  PickersArrowSwitcherClasses,
} from './pickersArrowSwitcherClasses';
import { usePickerPrivateContext } from '../../hooks/usePickerPrivateContext';
import { PickerOwnerState } from '../../../models';

const PickersArrowSwitcherRoot = styled('div', {
  name: 'MuiPickersArrowSwitcher',
  slot: 'Root',
})<{
  ownerState: PickerOwnerState;
}>({
  display: 'flex',
});

const PickersArrowSwitcherSpacer = styled('div', {
  name: 'MuiPickersArrowSwitcher',
  slot: 'Spacer',
})<{
  ownerState: PickerOwnerState;
}>(({ theme }) => ({
  width: theme.spacing(3),
}));

const PickersArrowSwitcherButton = styled(IconButton, {
  name: 'MuiPickersArrowSwitcher',
  slot: 'Button',
})<{
  ownerState: PickersArrowSwitcherOwnerState;
}>({
  variants: [
    {
      props: { isButtonHidden: true },
      style: { visibility: 'hidden' },
    },
  ],
});

const useUtilityClasses = (classes: Partial<PickersArrowSwitcherClasses> | undefined) => {
  const slots = {
    root: ['root'],
    spacer: ['spacer'],
    button: ['button'],
    previousIconButton: ['previousIconButton'],
    nextIconButton: ['nextIconButton'],
    leftArrowIcon: ['leftArrowIcon'],
    rightArrowIcon: ['rightArrowIcon'],
  };

  return composeClasses(slots, getPickersArrowSwitcherUtilityClass, classes);
};

export const PickersArrowSwitcher = React.forwardRef(function PickersArrowSwitcher(
  inProps: PickersArrowSwitcherProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const isRtl = useRtl();
  const props = useThemeProps({ props: inProps, name: 'MuiPickersArrowSwitcher' });

  const {
    children,
    className,
    slots,
    slotProps,
    isNextDisabled,
    isNextHidden,
    onGoToNext,
    nextLabel,
    isPreviousDisabled,
    isPreviousHidden,
    onGoToPrevious,
    previousLabel,
    labelId,
    classes: classesProp,
    ...other
  } = props;

  const { ownerState } = usePickerPrivateContext();

  const classes = useUtilityClasses(classesProp);

  const nextProps = {
    isDisabled: isNextDisabled,
    isHidden: isNextHidden,
    goTo: onGoToNext,
    label: nextLabel,
  };

  const previousProps = {
    isDisabled: isPreviousDisabled,
    isHidden: isPreviousHidden,
    goTo: onGoToPrevious,
    label: previousLabel,
  };

  // Keep refs to the buttons so we can redirect focus when a button
  // transitions from enabled to disabled while it's the active element.
  // Without this, the now-disabled button stays in `document.activeElement`,
  // which swallows follow-up keyboard events (notably the picker's Escape
  // dismiss handler).
  const previousButtonRef = React.useRef<HTMLButtonElement>(null);
  const nextButtonRef = React.useRef<HTMLButtonElement>(null);

  const PreviousIconButton = slots?.previousIconButton ?? PickersArrowSwitcherButton;
  const previousIconButtonProps = useSlotProps({
    elementType: PreviousIconButton,
    externalSlotProps: slotProps?.previousIconButton,
    additionalProps: {
      size: 'medium',
      title: previousProps.label,
      'aria-label': previousProps.label,
      disabled: previousProps.isDisabled,
      edge: 'end',
      onClick: previousProps.goTo,
    },
    ownerState: { ...ownerState, isButtonHidden: previousProps.isHidden ?? false },
    className: clsx(classes.button, classes.previousIconButton),
  });
  const handlePreviousButtonRef = useForkRef<HTMLButtonElement>(
    previousButtonRef,
    (previousIconButtonProps as { ref?: React.Ref<HTMLButtonElement> }).ref,
  );

  const NextIconButton = slots?.nextIconButton ?? PickersArrowSwitcherButton;
  const nextIconButtonProps = useSlotProps({
    elementType: NextIconButton,
    externalSlotProps: slotProps?.nextIconButton,
    additionalProps: {
      size: 'medium',
      title: nextProps.label,
      'aria-label': nextProps.label,
      disabled: nextProps.isDisabled,
      edge: 'start',
      onClick: nextProps.goTo,
    },
    ownerState: { ...ownerState, isButtonHidden: nextProps.isHidden ?? false },
    className: clsx(classes.button, classes.nextIconButton),
  });
  const handleNextButtonRef = useForkRef<HTMLButtonElement>(
    nextButtonRef,
    (nextIconButtonProps as { ref?: React.Ref<HTMLButtonElement> }).ref,
  );

  // When a button becomes disabled while focused, move focus to its
  // still-enabled sibling so keyboard interactions (e.g. Escape to dismiss
  // the containing picker) aren't trapped on the disabled element. Falls
  // back to blurring when both buttons are disabled.
  const wasPreviousDisabledRef = React.useRef(previousProps.isDisabled);
  const wasNextDisabledRef = React.useRef(nextProps.isDisabled);
  React.useEffect(() => {
    const previousButton = previousButtonRef.current;
    const nextButton = nextButtonRef.current;
    if (
      previousProps.isDisabled &&
      !wasPreviousDisabledRef.current &&
      previousButton != null &&
      document.activeElement === previousButton
    ) {
      if (!nextProps.isDisabled && nextButton != null) {
        nextButton.focus();
      } else {
        previousButton.blur();
      }
    }
    if (
      nextProps.isDisabled &&
      !wasNextDisabledRef.current &&
      nextButton != null &&
      document.activeElement === nextButton
    ) {
      if (!previousProps.isDisabled && previousButton != null) {
        previousButton.focus();
      } else {
        nextButton.blur();
      }
    }
    wasPreviousDisabledRef.current = previousProps.isDisabled;
    wasNextDisabledRef.current = nextProps.isDisabled;
  }, [previousProps.isDisabled, nextProps.isDisabled]);

  const LeftArrowIcon = slots?.leftArrowIcon ?? ArrowLeftIcon;
  // The spread is here to avoid this bug mui/material-ui#34056
  const { ownerState: leftArrowIconOwnerState, ...leftArrowIconProps } = useSlotProps({
    elementType: LeftArrowIcon,
    externalSlotProps: slotProps?.leftArrowIcon,
    additionalProps: {
      fontSize: 'inherit',
    },
    ownerState,
    className: classes.leftArrowIcon,
  });

  const RightArrowIcon = slots?.rightArrowIcon ?? ArrowRightIcon;
  // The spread is here to avoid this bug mui/material-ui#34056
  const { ownerState: rightArrowIconOwnerState, ...rightArrowIconProps } = useSlotProps({
    elementType: RightArrowIcon,
    externalSlotProps: slotProps?.rightArrowIcon,
    additionalProps: {
      fontSize: 'inherit',
    },
    ownerState,
    className: classes.rightArrowIcon,
  });

  return (
    <PickersArrowSwitcherRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      {...other}
    >
      <PreviousIconButton {...previousIconButtonProps} ref={handlePreviousButtonRef}>
        {isRtl ? (
          <RightArrowIcon {...rightArrowIconProps} />
        ) : (
          <LeftArrowIcon {...leftArrowIconProps} />
        )}
      </PreviousIconButton>
      {children ? (
        <Typography variant="subtitle1" component="span" id={labelId}>
          {children}
        </Typography>
      ) : (
        <PickersArrowSwitcherSpacer className={classes.spacer} ownerState={ownerState} />
      )}
      <NextIconButton {...nextIconButtonProps} ref={handleNextButtonRef}>
        {isRtl ? (
          <LeftArrowIcon {...leftArrowIconProps} />
        ) : (
          <RightArrowIcon {...rightArrowIconProps} />
        )}
      </NextIconButton>
    </PickersArrowSwitcherRoot>
  );
});
