import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { DIALOG_WIDTH } from '../../constants/dimensions';
import { WrapperVariantContext } from '../wrappers/WrapperVariantContext';

import {
  getStaticWrapperUtilityClass,
  PickerStaticWrapperClasses,
} from './pickerStaticWrapperClasses';
import { PickersActionBar, PickersActionBarProps } from '../../../PickersActionBar';
import { PickerStateWrapperProps } from '../../hooks/usePickerState';

const useUtilityClasses = (ownerState: PickerStaticWrapperProps) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getStaticWrapperUtilityClass, classes);
};

export interface PickersStaticWrapperSlotsComponent {
  ActionBar: React.ElementType<PickersActionBarProps>;
}

export interface PickersStaticWrapperSlotsComponentsProps {
  actionBar: Omit<PickersActionBarProps, 'onAccept' | 'onClear' | 'onCancel' | 'onSetToday'>;
}

export interface PickerStaticWrapperProps extends PickerStateWrapperProps {
  children?: React.ReactNode;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<PickerStaticWrapperClasses>;
  /**
   * Force static wrapper inner components to be rendered in mobile or desktop mode.
   */
  displayStaticWrapperAs: 'desktop' | 'mobile';
  /**
   * Overrideable components.
   * @default {}
   */
  components?: Partial<PickersStaticWrapperSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: Partial<PickersStaticWrapperSlotsComponentsProps>;
}

const PickerStaticWrapperRoot = styled('div', {
  name: 'MuiPickerStaticWrapper',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  overflow: 'hidden',
  minWidth: DIALOG_WIDTH,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
}));

export function PickerStaticWrapper(inProps: PickerStaticWrapperProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickerStaticWrapper' });
  const {
    displayStaticWrapperAs,
    onAccept,
    onClear,
    onCancel,
    onDismiss,
    onSetToday,
    open,
    components,
    componentsProps,
    ...other
  } = props;

  const classes = useUtilityClasses(props);
  const ActionBar = components?.ActionBar ?? PickersActionBar;

  return (
    <WrapperVariantContext.Provider value={displayStaticWrapperAs}>
      <PickerStaticWrapperRoot className={classes.root} {...other} />
      <ActionBar
        onAccept={onAccept}
        onClear={onClear}
        onCancel={onCancel}
        onSetToday={onSetToday}
        actions={['cancel', 'accept']}
        {...componentsProps?.actionBar}
      />
    </WrapperVariantContext.Provider>
  );
}
