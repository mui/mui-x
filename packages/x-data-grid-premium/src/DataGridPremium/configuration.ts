import { useGridSelector } from '@mui/x-data-grid-pro';
import { GridConfiguration, configurationPro } from '@mui/x-data-grid-pro/internals';
import { useGridAriaAttributes } from '../hooks/utils/useGridAriaAttributes';
import { useGridRowAriaAttributes } from '../hooks/features/rows/useGridRowAriaAttributes';
import { gridCellAggregationResultSelector } from '../hooks/features/aggregation/gridAggregationSelectors';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';

export type { GridPremiumSlotsComponent as GridSlots } from '../models';

export const configuration: GridConfiguration = {
  ...configurationPro,
  hooks: {
    ...configurationPro.hooks,
    useGridAriaAttributes,
    useGridRowAriaAttributes,
    useCellAggregationResult: (id, field) => {
      const apiRef = useGridApiContext();
      return useGridSelector(apiRef, gridCellAggregationResultSelector, { id, field }) as any;
    },
  },
};
