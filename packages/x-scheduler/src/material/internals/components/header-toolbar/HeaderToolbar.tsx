'use client';
import * as React from 'react';
import clsx from 'clsx';
import { HeaderToolbarProps } from './HeaderToolbar.types';
import { ViewSwitcher } from './view-switcher';
import { useTranslations } from '../../utils/TranslationsContext';
import { useEventCalendarContext } from '../../hooks/useEventCalendarContext';
import { useSelector } from '../../../../base-ui-copy/utils/store';
import { selectors } from '../../../../primitives/use-event-calendar';
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
