'use client';
import * as React from 'react';
import { ViewSwitcher } from '../view-switcher';

export function TimelineViewSwitcher(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...other } = props;

  const views = ['time', 'days', 'weeks', 'months', 'years'];

  return <ViewSwitcher views={views} {...other} />;
}
