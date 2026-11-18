import createGenerateClassName from '../createGenerateClassName';

/**
 * Scheduler premium components that render the classes of their community counterpart,
 * mapped to the `muiName` that owns those classes.
 */
export const sharedClassNameOwners: Record<string, string> = {
  // `EventCalendarPremium` uses `useEventCalendarUtilityClasses` (`MuiEventCalendar-root`, …).
  MuiEventCalendarPremium: 'MuiEventCalendar',
  // `eventTimelinePremiumClasses` are generated with the `MuiEventTimeline` prefix.
  MuiEventTimelinePremium: 'MuiEventTimeline',
};

const generateSchedulerClassName = createGenerateClassName(sharedClassNameOwners);

export default generateSchedulerClassName;
