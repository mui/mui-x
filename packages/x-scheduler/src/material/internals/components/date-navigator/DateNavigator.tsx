'use client';
import * as React from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '@base-ui-components/utils/store';
import { DateNavigatorProps } from './DateNavigator.types';
import { getAdapter } from '../../../../primitives/utils/adapter/getAdapter';
import { useTranslations } from '../../utils/TranslationsContext';
import { useEventCalendarStoreContext } from '../../../../primitives/utils/useEventCalendarStoreContext';
import { selectors } from '../../../../primitives/use-event-calendar';
import './DateNavigator.css';

const adapter = getAdapter();

export const DateNavigator = React.forwardRef(function DateNavigator(
  props: DateNavigatorProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;
  const store = useEventCalendarStoreContext();
  const translations = useTranslations();
  const view = useStore(store, selectors.view);
  const visibleDate = useStore(store, selectors.visibleDate);

  return (
    <header
      ref={forwardedRef}
      role="navigation"
      className={clsx('DateNavigatorContainer', className)}
      {...other}
    >
      <p className="DateNavigatorLabel" aria-live="polite">
        {adapter.format(visibleDate, 'month')} {adapter.format(visibleDate, 'year')}
      </p>
      <div className="DateNavigatorButtonsContainer">
        <button
          className={clsx('NeutralTextButton', 'Button', 'DateNavigatorButton')}
          onClick={store.goToPreviousVisibleDate}
          type="button"
          aria-label={translations.previousTimeSpan(view)}
        >
          <ChevronLeft size={24} strokeWidth={2} />
        </button>
        <button
          className={clsx('NeutralTextButton', 'Button', 'DateNavigatorButton')}
          onClick={store.goToNextVisibleDate}
          type="button"
          aria-label={translations.nextTimeSpan(view)}
        >
          <ChevronRight size={24} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
});
