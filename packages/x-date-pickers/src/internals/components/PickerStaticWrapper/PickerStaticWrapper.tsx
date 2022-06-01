import * as React from 'react';
import PropTypes from 'prop-types';
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
    content: ['content'],
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
})({
  display: 'flex',
  flexDirection: 'column',
});

const PickerStaticWrapperContent = styled('div', {
  name: 'MuiPickerStaticWrapper',
  slot: 'Content',
  overridesResolver: (props, styles) => styles.content,
})(({ theme }) => ({
  overflow: 'hidden',
  minWidth: DIALOG_WIDTH,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
}));

function PickerStaticWrapper(inProps: PickerStaticWrapperProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickerStaticWrapper' });
  const {
    displayStaticWrapperAs,
    onAccept,
    onClear,
    onCancel,
    onDismiss,
    onSetToday,
    open,
    children,
    components,
    componentsProps,
    ...other
  } = props;

  const classes = useUtilityClasses(props);
  const ActionBar = components?.ActionBar ?? PickersActionBar;

  return (
    <WrapperVariantContext.Provider value={displayStaticWrapperAs}>
      <PickerStaticWrapperRoot className={classes.root} {...other}>
        <PickerStaticWrapperContent className={classes.content}>
          {children}
        </PickerStaticWrapperContent>
        <ActionBar
          onAccept={onAccept}
          onClear={onClear}
          onCancel={onCancel}
          onSetToday={onSetToday}
          actions={displayStaticWrapperAs === 'desktop' ? [] : ['cancel', 'accept']}
          {...componentsProps?.actionBar}
        />
      </PickerStaticWrapperRoot>
    </WrapperVariantContext.Provider>
  );
}

PickerStaticWrapper.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * Overrideable components.
   * @default {}
   */
  components: PropTypes.object,
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps: PropTypes.object,
  /**
   * Force static wrapper inner components to be rendered in mobile or desktop mode.
   */
  displayStaticWrapperAs: PropTypes.oneOf(['desktop', 'mobile']).isRequired,
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onSetToday: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
} as any;

export { PickerStaticWrapper };
