'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { useEventCalendarContext } from '../../../hooks/useEventCalendarContext';
import { selectors } from '../../../../../primitives/use-event-calendar';
import { ViewSwitcher } from '../view-switcher';

export function TimelineViewSwitcher(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...other } = props;

  const { store } = useEventCalendarContext();
  const views = useStore(store, selectors.timelineViews);

  return <ViewSwitcher views={views} {...other} />;
}
