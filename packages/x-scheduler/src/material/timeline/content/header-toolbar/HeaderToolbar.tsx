'use client';
import * as React from 'react';
import clsx from 'clsx';
import './HeaderToolbar.css';
import { TimelineView } from '../../Timeline.types';
import { ViewSwitcher } from '../../../internals/components/header-toolbar/view-switcher';

interface HeaderToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  views: TimelineView[];
  currentView: TimelineView;
  onViewChange: (view: TimelineView, event: React.MouseEvent<HTMLElement>) => void;
}

export const HeaderToolbar = React.forwardRef(function HeaderToolbar(
  props: HeaderToolbarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, views, currentView, onViewChange, ...other } = props;

  return (
    <header ref={forwardedRef} className={clsx('HeaderToolbarContainer', className)} {...other}>
      <ViewSwitcher views={views} currentView={currentView} onViewChange={onViewChange as any} />
    </header>
  );
});
