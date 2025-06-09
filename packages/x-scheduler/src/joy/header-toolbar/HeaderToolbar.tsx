'use client';
import * as React from 'react';
import clsx from 'clsx';
import { HeaderToolbarProps } from './HeaderToolbar.types';
import { ViewSwitcher } from './view-switcher';
import { useTranslations } from '../utils/TranslationsContext';
import './HeaderToolbar.css';

export const HeaderToolbar = React.forwardRef(function HeaderToolbar(
  props: HeaderToolbarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, views, onTodayClick, selectedView, setSelectedView, ...other } = props;
  const translations = useTranslations();

  return (
    <header ref={forwardedRef} className={clsx('HeaderToolbarContainer', className)} {...other}>
      <ViewSwitcher views={views} selectedView={selectedView} setSelectedView={setSelectedView} />
      <button className="HeaderToolbarButton" onClick={onTodayClick} type="button">
        {translations.today}
      </button>
    </header>
  );
});
