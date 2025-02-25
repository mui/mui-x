import * as React from 'react';
import { useClockRootContext } from '../root/ClockRootContext';
import { ClockSection } from './types';

export function useClockOptionList(parameters) {
  const { section } = parameters;

  const rootContext = useClockRootContext();
  const registerSection = rootContext.registerSection;

  React.useEffect(() => {
    return registerSection({ type: section, value: rootContext.referenceDate });
  }, [registerSection, section, rootContext.referenceDate]);
}

export namespace useClockOptionList {
  export interface Parameters {
    section: ClockSection;
  }
}
