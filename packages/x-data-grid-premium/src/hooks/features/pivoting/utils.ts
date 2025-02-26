import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

export const isPivotingEnabled = (
  props: Pick<DataGridPremiumProcessedProps, 'experimentalFeatures' | 'disablePivoting'>,
) => {
  return props.experimentalFeatures?.pivoting && !props.disablePivoting;
};
