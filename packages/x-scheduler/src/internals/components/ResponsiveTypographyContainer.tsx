'use client';
import { styled } from '@mui/material/styles';
import { EVENT_CALENDAR_CONTAINER_NAME, responsiveTokens } from '../constants/responsiveTypography';

// Establishes the @container ancestor (named EVENT_CALENDAR_CONTAINER_NAME)
// and declares the tier/effective CSS custom properties. Wraps either
// EventCalendarContent (inside EventCalendarRoot) or the view rendered by a
// Standalone*View — its descendants host the @container queries that
// retarget the effective vars at each tier.
export const ResponsiveTypographyContainer = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'ResponsiveTypographyContainer',
})({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  width: '100%',
  height: '100%',
  minHeight: 0,
  minWidth: 0,
  containerType: 'inline-size',
  containerName: EVENT_CALENDAR_CONTAINER_NAME,
  ...responsiveTokens,
});
