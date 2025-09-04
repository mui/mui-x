'use client';
import * as React from 'react';
import clsx from 'clsx';
import { ViewSwitcher } from './view-switcher';
import './HeaderToolbar.css';
import { TimelineView } from '../TimelineView.types';

interface HeaderToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  views: TimelineView[];
  currentView: TimelineView;
  onViewChange: (view: TimelineView, e: React.MouseEvent<HTMLElement>) => void;
}

export const HeaderToolbar = React.forwardRef(function HeaderToolbar(
  props: HeaderToolbarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, views, currentView, onViewChange, ...other } = props;

  return (
    <header ref={forwardedRef} className={clsx('HeaderToolbarContainer', className)} {...other}>
      <ViewSwitcher<TimelineView>
        views={views}
        currentView={currentView}
        onViewChange={onViewChange}
      />
    </header>
  );
});
