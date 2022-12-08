import * as React from 'react';
import PropTypes from 'prop-types';
import { useSlotProps } from '@mui/base/utils';
import { styled, Theme, useThemeProps } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import clsx from 'clsx';
import { DIALOG_WIDTH } from '../../constants/dimensions';
import { WrapperVariantContext } from '../wrappers/WrapperVariantContext';
import {
  getStaticWrapperUtilityClass,
  PickerStaticWrapperClasses,
} from './pickerStaticWrapperClasses';
import { PickersActionBar, PickersActionBarAction } from '../../../PickersActionBar';
import { PickerStateWrapperProps } from '../../hooks/usePickerState';
import { PickersInputLocaleText } from '../../../locales/utils/pickersLocaleTextApi';
import { LocalizationProvider } from '../../../LocalizationProvider';
import { PickersSlotsComponent, PickersSlotsComponentsProps } from '../wrappers/WrapperProps';

const useUtilityClasses = <TDate extends unknown>(ownerState: PickerStaticWrapperProps<TDate>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    content: ['content'],
  };

  return composeClasses(slots, getStaticWrapperUtilityClass, classes);
};

export interface PickersStaticWrapperSlotsComponent
  extends Pick<PickersSlotsComponent, 'ActionBar' | 'PaperContent'> {}

export interface PickersStaticWrapperSlotsComponentsProps
  extends Pick<PickersSlotsComponentsProps, 'actionBar' | 'paperContent'> {}

export interface ExportedPickerStaticWrapperProps {
  /**
   * Force static wrapper inner components to be rendered in mobile or desktop mode.
   * @default "mobile"
   */
  displayStaticWrapperAs?: 'desktop' | 'mobile';
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}

export interface PickerStaticWrapperProps<TDate>
  extends PickerStateWrapperProps,
    ExportedPickerStaticWrapperProps {
  className?: string;
  children?: React.ReactNode;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<PickerStaticWrapperClasses>;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: PickersStaticWrapperSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: PickersStaticWrapperSlotsComponentsProps;
  /**
   * Locale for components texts
   */
  localeText?: PickersInputLocaleText<TDate>;
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
  backgroundColor: (theme.vars || theme).palette.background.paper,
}));

function PickerStaticWrapper<TDate>(inProps: PickerStaticWrapperProps<TDate>) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickerStaticWrapper' });
  const {
    displayStaticWrapperAs = 'mobile',
    onAccept,
    onClear,
    onCancel,
    onSetToday,
    children,
    onDismiss,
    open,
    components,
    componentsProps,
    localeText,
    className,
    ...other
  } = props;

  const classes = useUtilityClasses(props);

  const ActionBar = components?.ActionBar ?? PickersActionBar;
  const actionBarProps = useSlotProps({
    elementType: ActionBar,
    externalSlotProps: componentsProps?.actionBar,
    additionalProps: {
      onAccept,
      onClear,
      onCancel,
      onSetToday,
      actions:
        displayStaticWrapperAs === 'desktop'
          ? []
          : (['cancel', 'accept'] as PickersActionBarAction[]),
    },
    ownerState: { wrapperVariant: displayStaticWrapperAs },
  });

  const PaperContent = components?.PaperContent ?? React.Fragment;

  return (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value={displayStaticWrapperAs}>
        <PickerStaticWrapperRoot className={clsx(classes.root, className)} {...other}>
          <PickerStaticWrapperContent className={classes.content}>
            <PaperContent {...componentsProps?.paperContent}>{children}</PaperContent>
          </PickerStaticWrapperContent>
          <ActionBar {...actionBarProps} />
        </PickerStaticWrapperRoot>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
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
  className: PropTypes.string,
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
   * @default "mobile"
   */
  displayStaticWrapperAs: PropTypes.oneOf(['desktop', 'mobile']),
  /**
   * Locale for components texts
   */
  localeText: PropTypes.object,
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onSetToday: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { PickerStaticWrapper };
