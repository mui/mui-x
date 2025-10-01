'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { HeaderToolbarProps } from './HeaderToolbar.types';
import { ViewSwitcher } from './view-switcher';
import { useTranslations } from '../../utils/TranslationsContext';
import { useEventCalendarStoreContext } from '../../../../primitives/utils/useEventCalendarStoreContext';
import { selectors } from '../../../../primitives/use-event-calendar';
import { PreferencesMenu } from './preferences-menu';
import './HeaderToolbar.css';
import { DateNavigator } from '../date-navigator';

export const HeaderToolbar = React.forwardRef(function HeaderToolbar(
  props: HeaderToolbarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;

  const store = useEventCalendarStoreContext();
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
      <div className="HeaderToolbarActions">
        <div className="PrimaryActionWrapper">
          {showViewSwitcher && <ViewSwitcher />}
          <button className="Button OutlinedNeutralButton" onClick={store.goToToday} type="button">
            {translations.today}
          </button>
        </div>
        <PreferencesMenu />
      </div>
    </header>
  );
});
