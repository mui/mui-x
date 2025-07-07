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
      {adapter.format(visibleDate, 'monthShort')} {adapter.format(visibleDate, 'year')}
      <button onClick={onPreviousClick} type="button">
        <ChevronLeft size={16} strokeWidth={2} />
      </button>
      <button onClick={onNextClick} type="button">
        <ChevronRight size={16} strokeWidth={2} />
      </button>
    </header>
  );
});
