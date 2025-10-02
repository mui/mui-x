'use client';
import * as React from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '@base-ui-components/utils/store';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { selectors } from '@mui/x-scheduler-headless/use-event-calendar';
import { DateNavigatorProps } from './DateNavigator.types';
import { useTranslations } from '../../utils/TranslationsContext';
import './DateNavigator.css';

export const DateNavigator = React.forwardRef(function DateNavigator(
  props: DateNavigatorProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;

  const adapter = useAdapter();
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
