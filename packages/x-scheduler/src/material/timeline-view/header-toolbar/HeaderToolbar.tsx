'use client';
import * as React from 'react';
import clsx from 'clsx';
import { ViewSwitcher } from './view-switcher';
import './HeaderToolbar.css';
import { TimelineView } from '../TimelineView.types';

interface HeaderToolbarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const HeaderToolbar = React.forwardRef(function HeaderToolbar(
  props: HeaderToolbarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;

  const [view, setView] = React.useState<TimelineView>('days');
  const views: TimelineView[] = ['time', 'days', 'weeks', 'months', 'years'];

  const handleViewChange = (view: TimelineView, _e: React.MouseEvent<HTMLElement>) => {
    setView(view);
  };

  return (
    <header ref={forwardedRef} className={clsx('HeaderToolbarContainer', className)} {...other}>
      <ViewSwitcher<TimelineView>
        views={views}
        currentView={view}
        onViewChange={handleViewChange}
      />
    </header>
  );
});
