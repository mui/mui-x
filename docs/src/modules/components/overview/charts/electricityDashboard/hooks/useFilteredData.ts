import * as React from 'react';
import type { Dayjs } from 'dayjs';
import { electricityGeneration2024Hourly } from 'docsx/data/charts/dataset/electricityGeneration2024Hourly';
import { carbonEmissions2024Hourly } from 'docsx/data/charts/dataset/carbonEmissions2024Hourly';
import { filterAndTransformData } from '../utils/dataTransformers';
import type { FilteredData } from '../types/electricity';

export function useFilteredData(startDate: Dayjs | null, endDate: Dayjs | null): FilteredData {
  return React.useMemo(
    () =>
      filterAndTransformData(
        electricityGeneration2024Hourly,
        carbonEmissions2024Hourly,
        startDate,
        endDate,
      ),
    [startDate, endDate],
  );
}
