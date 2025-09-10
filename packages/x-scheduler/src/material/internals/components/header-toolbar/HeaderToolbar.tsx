'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { HeaderToolbarProps } from './HeaderToolbar.types';
import { ViewSwitcher } from './view-switcher';
import { useTranslations } from '../../utils/TranslationsContext';
import { useEventCalendarContext } from '../../../../primitives/utils/useEventCalendarContext';
import { selectors } from '../../../../primitives/use-event-calendar';
import { PreferencesMenu } from './preferences-menu';
import './HeaderToolbar.css';

export const HeaderToolbar = React.forwardRef(function HeaderToolbar(
  props: HeaderToolbarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;

  const { store, instance } = useEventCalendarContext();
  const translations = useTranslations();
  const views = useStore(store, selectors.views);
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
      <div className="PrimaryActionWrapper">
        {showViewSwitcher && <ViewSwitcher />}
        <button className="Button OutlinedNeutralButton" onClick={instance.goToToday} type="button">
          {translations.today}
        </button>
      </div>
      <PreferencesMenu />
    </header>
  );
});
