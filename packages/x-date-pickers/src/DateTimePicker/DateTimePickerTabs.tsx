import * as React from 'react';
import PropTypes from 'prop-types';
import Tab from '@mui/material/Tab';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { Time, DateRange } from '../internals/components/icons';
import {
  WrapperVariantContext,
  WrapperVariant,
} from '../internals/components/wrappers/WrapperVariantContext';
import { CalendarOrClockPickerView } from '../internals/models';
import { useLocaleText } from '../internals/hooks/useUtils';
import {
  DateTimePickerTabsClasses,
  getDateTimePickerTabsUtilityClass,
} from './dateTimePickerTabsClasses';

type TabValue = 'date' | 'time';

const viewToTab = (openView: CalendarOrClockPickerView): TabValue => {
  if (['day', 'month', 'year'].includes(openView)) {
    return 'date';
  }

  return 'time';
};

const tabToView = (tab: TabValue): CalendarOrClockPickerView => {
  if (tab === 'date') {
    return 'day';
  }

  return 'hours';
};

export interface DateTimePickerTabsProps {
  /**
   * Date tab icon.
   * @default DateRange
   */
  dateRangeIcon?: React.ReactNode;
  /**
   * Callback called when tab is clicked
   * @param {CalendarOrClockPickerView} view Picker view that was clicked
   */
  onChange: (view: CalendarOrClockPickerView) => void;
  /**
   * Time tab icon.
   * @default Time
   */
  timeIcon?: React.ReactNode;
  /**
   * Open picker view
   */
  view: CalendarOrClockPickerView;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DateTimePickerTabsClasses>;
}

type OwnerState = DateTimePickerTabsProps & { wrapperVariant: WrapperVariant };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getDateTimePickerTabsUtilityClass, classes);
};

const DateTimePickerTabsRoot = styled(Tabs, {
  name: 'MuiDateTimePickerTabs',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: OwnerState }>(({ ownerState, theme }) => ({
  boxShadow: `0 -1px 0 0 inset ${theme.palette.divider}`,
  ...(ownerState.wrapperVariant === 'desktop' && {
    order: 1,
    boxShadow: `0 1px 0 0 inset ${theme.palette.divider}`,
    [`& .${tabsClasses.indicator}`]: {
      bottom: 'auto',
      top: 0,
    },
  }),
}));

const DateTimePickerTabs = function DateTimePickerTabs(inProps: DateTimePickerTabsProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiDateTimePickerTabs' });
  const { dateRangeIcon = <DateRange />, onChange, timeIcon = <Time />, view } = props;

  const localeText = useLocaleText();
  const wrapperVariant = React.useContext(WrapperVariantContext);
  const ownerState = { ...props, wrapperVariant };
  const classes = useUtilityClasses(ownerState);

  const handleChange = (event: React.SyntheticEvent, value: TabValue) => {
    onChange(tabToView(value));
  };

  return (
    <DateTimePickerTabsRoot
      ownerState={ownerState}
      variant="fullWidth"
      value={viewToTab(view)}
      onChange={handleChange}
      className={classes.root}
    >
      <Tab
        value="date"
        aria-label={localeText.dateTableLabel}
        icon={<React.Fragment>{dateRangeIcon}</React.Fragment>}
      />
      <Tab
        value="time"
        aria-label={localeText.timeTableLabel}
        icon={<React.Fragment>{timeIcon}</React.Fragment>}
      />
    </DateTimePickerTabsRoot>
  );
};

DateTimePickerTabs.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * Date tab icon.
   * @default DateRange
   */
  dateRangeIcon: PropTypes.node,
  /**
   * Callback called when tab is clicked
   * @param {CalendarOrClockPickerView} view Picker view that was clicked
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Time tab icon.
   * @default Time
   */
  timeIcon: PropTypes.node,
  /**
   * Open picker view
   */
  view: PropTypes.oneOf(['day', 'hours', 'minutes', 'month', 'seconds', 'year']).isRequired,
} as any;

export { DateTimePickerTabs };
