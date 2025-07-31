'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useSelector } from '@base-ui-components/utils/store';
import { HeaderToolbarProps } from './HeaderToolbar.types';
import { ViewSwitcher } from './view-switcher';
import { useTranslations } from '../../utils/TranslationsContext';
import { useEventCalendarContext } from '../../hooks/useEventCalendarContext';
import { selectors } from '../../../event-calendar/store';
import './HeaderToolbar.css';

export const HeaderToolbar = React.forwardRef(function HeaderToolbar(
  props: HeaderToolbarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;

  const { store, instance } = useEventCalendarContext();
  const translations = useTranslations();
  const views = useSelector(store, selectors.views);
  const showViewSwitcher = views.length > 1;

  return (
    <header
      ref={forwardedRef}
      className={clsx(
        'HeaderToolbarContainer',
        !showViewSwitcher && 'SinglePrimaryAction',
        className,
      )}
      {...other}
    >
      {showViewSwitcher && <ViewSwitcher />}
      <button className="HeaderToolbarButton" onClick={instance.goToToday} type="button">
        {translations.today}
      </button>
    </header>
  );
});
