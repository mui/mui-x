'use client';
import * as React from 'react';
import { ViewSwitcher, TimelineViews } from '../view-switcher';

export function TimelineViewSwitcher(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...other } = props;

  const views: TimelineViews[] = ['time', 'days', 'weeks', 'months', 'years'];

  return <ViewSwitcher views={views} {...other} />;
}
