'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { useEventCalendarContext } from '../../../hooks/useEventCalendarContext';
import { selectors } from '../../../../../primitives/use-event-calendar';
import { ViewSwitcher } from '../view-switcher';

export function CalendarViewSwitcher(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...other } = props;

  const { store } = useEventCalendarContext();
  const views = useStore(store, selectors.views);
  // TODO: Remove once we decide how to integrate the Timeline in the top level component
  const viewsWithoutTimeline = views.filter((view) => view !== 'timeline');

  return <ViewSwitcher views={viewsWithoutTimeline} {...other} />;
}
