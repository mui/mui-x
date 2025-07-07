'use client';
import * as React from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DateNavigatorProps } from './DateNavigator.types';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import './DateNavigator.css';

const adapter = getAdapter();

export const DateNavigator = React.forwardRef(function DateNavigator(
  props: DateNavigatorProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, visibleDate, onNextClick, onPreviousClick, ...other } = props;

  return (
    <header ref={forwardedRef} className={clsx('DateNavigatorContainer', className)} {...other}>
      <p className="DateNavigatorLabel">
        {adapter.format(visibleDate, 'monthShort')} {adapter.format(visibleDate, 'year')}
      </p>
      <div className="DateNavigatorButtonsContainer">
        <button
          className={clsx('NeutralTextButton', 'Button', 'DateNavigatorButton')}
          onClick={onPreviousClick}
          type="button"
        >
          <ChevronLeft size={24} strokeWidth={2} />
        </button>
        <button
          className={clsx('NeutralTextButton', 'Button', 'DateNavigatorButton')}
          onClick={onNextClick}
          type="button"
        >
          <ChevronRight size={24} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
});
