import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import {
  pickersLayoutClasses,
  PickersLayoutContentWrapper,
  PickersLayoutRoot,
  usePickerLayout,
} from '@mui/x-date-pickers/PickersLayout';
import { Unstable_MobileNextDatePicker as MobileNextDatePicker } from '@mui/x-date-pickers/MobileNextDatePicker';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DatePickerToolbar } from '@mui/x-date-pickers/DatePicker';

function LayoutWithKeyboardView(props) {
  const { value, onChange } = props;
  const [showKeyboardView, setShowKeyboardView] = React.useState(false);

  const { toolbar, tabs, content, actionBar } = usePickerLayout({
    ...props,
    slotProps: {
      ...props.slotProps,
      toolbar: {
        ...props.slotProps?.toolbar,
        // @ts-ignore
        showKeyboardViewSwitch: props.wrapperVariant === 'mobile',
        showKeyboardView,
        setShowKeyboardView,
      },
    },
  });

  return (
    <PickersLayoutRoot ownerState={props}>
      {toolbar}
      {actionBar}
      <PickersLayoutContentWrapper className={pickersLayoutClasses.contentWrapper}>
        {tabs}
        {showKeyboardView ? (
          <Box sx={{ mx: 3, my: 2, width: 272 }}>
            <DateField value={value} onChange={onChange} sx={{ width: '100%' }} />
          </Box>
        ) : (
          content
        )}
      </PickersLayoutContentWrapper>
    </PickersLayoutRoot>
  );
}

LayoutWithKeyboardView.propTypes = {
  onChange: PropTypes.func.isRequired,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.shape({
    /**
     * Props passed down to the action bar component.
     */
    actionBar: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    /**
     * Props passed down to the layoutRoot component.
     */
    layout: PropTypes.shape({
      children: PropTypes.node,
      classes: PropTypes.object,
      className: PropTypes.string,
      /**
       * Overrideable components.
       * @default {}
       * @deprecated Please use `slots`.
       */
      components: PropTypes.shape({
        /**
         * Custom component for the action bar, it is placed bellow the picker views.
         * @default PickersActionBar
         */
        ActionBar: PropTypes.elementType,
        /**
         * Custom component for wrapping the layout.
         * It wraps the toolbar, views, and action bar.
         */
        Layout: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        /**
         * Tabs enabling toggling between views.
         */
        Tabs: PropTypes.elementType,
        /**
         * Custom component for the toolbar.
         * It is placed above the picker views.
         */
        Toolbar: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
      }),
      /**
       * The props used for each component slot.
       * @default {}
       * @deprecated Please use `slotProps`.
       */
      componentsProps: PropTypes.object,
      disabled: PropTypes.bool,
      isLandscape: PropTypes.bool,
      onAccept: PropTypes.func,
      onCancel: PropTypes.func,
      onChange: PropTypes.func,
      onClear: PropTypes.func,
      onClose: PropTypes.func,
      onDismiss: PropTypes.func,
      onOpen: PropTypes.func,
      onSetToday: PropTypes.func,
      onViewChange: PropTypes.func,
      /**
       * Force rendering in particular orientation.
       */
      orientation: PropTypes.oneOf(['landscape', 'portrait']),
      readOnly: PropTypes.bool,
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps: PropTypes.object,
      /**
       * Overrideable component slots.
       * @default {}
       */
      slots: PropTypes.any,
      sx: PropTypes.oneOfType([
        PropTypes.arrayOf(
          PropTypes.oneOfType([
            PropTypes.oneOf([null]),
            PropTypes.func,
            PropTypes.object,
            PropTypes.bool,
          ]),
        ),
        PropTypes.func,
        PropTypes.object,
      ]),
      value: PropTypes.any,
      view: PropTypes.oneOf([
        'day',
        'hours',
        'minutes',
        'month',
        'seconds',
        'year',
        null,
      ]).isRequired,
      views: PropTypes.arrayOf(PropTypes.oneOf(['day', 'month', 'year'])),
      wrapperVariant: PropTypes.oneOf(['desktop', 'mobile']),
    }),
    /**
     * Props passed down to the tabs component.
     */
    tabs: PropTypes.object,
    /**
     * Props passed down to the toolbar component.
     */
    toolbar: PropTypes.shape({
      /**
       * className applied to the root component.
       */
      className: PropTypes.string,
      /**
       * If `true`, show the toolbar even in desktop mode.
       * @default `true` for Desktop, `false` for Mobile.
       */
      hidden: PropTypes.bool,
      /**
       * Toolbar date format.
       */
      toolbarFormat: PropTypes.string,
      /**
       * Toolbar value placeholder—it is displayed when the value is empty.
       * @default "––"
       */
      toolbarPlaceholder: PropTypes.node,
    }),
  }),
  value: PropTypes.any,
  wrapperVariant: PropTypes.oneOf(['desktop', 'mobile', null]).isRequired,
};

function ToolbarWithKeyboardViewSwitch(props) {
  const { showKeyboardViewSwitch, showKeyboardView, setShowKeyboardView, ...other } =
    props;

  if (showKeyboardViewSwitch) {
    return (
      <Stack
        spacing={2}
        direction={other.isLandscape ? 'column' : 'row'}
        alignItems="center"
        sx={
          other.isLandscape
            ? {
                gridColumn: 1,
                gridRow: '1 / 3',
              }
            : { gridColumn: '1 / 4', gridRow: 1, mr: 1 }
        }
      >
        <DatePickerToolbar {...other} sx={{ flex: '1 1 100%' }} />
        <IconButton
          color="inherit"
          onClick={() => setShowKeyboardView((prev) => !prev)}
        >
          {showKeyboardView ? <CalendarMonthIcon /> : <ModeEditIcon />}
        </IconButton>
      </Stack>
    );
  }

  return <DatePickerToolbar {...other} />;
}

ToolbarWithKeyboardViewSwitch.propTypes = {
  isLandscape: PropTypes.bool.isRequired,
  setShowKeyboardView: PropTypes.func,
  showKeyboardView: PropTypes.bool,
  showKeyboardViewSwitch: PropTypes.bool,
};

export default function MobileKeyboardView() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileNextDatePicker
        components={{
          Layout: LayoutWithKeyboardView,
          Toolbar: ToolbarWithKeyboardViewSwitch,
        }}
      />
    </LocalizationProvider>
  );
}
