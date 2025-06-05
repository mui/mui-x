import { useMemo } from 'react';
import { PTOData } from '../types/pto';
import { samplePTOData } from '../data/sampleData';

export const usePTOData = (currentDate: Date): PTOData => {
  return useMemo(() => {
    return samplePTOData;
  }, [currentDate]);
};
