import { useMemo } from 'react';
import { isWithinDemoYear } from '../utils/dateUtils';
import { PTOData } from '../types/pto';
import { samplePTOData } from '../data/sampleData';

export const usePTOData = (currentDate: Date): PTOData => {
  return useMemo(() => {
    if (!isWithinDemoYear(currentDate)) {
      return {};
    }
    return samplePTOData;
  }, [currentDate]);
}; 