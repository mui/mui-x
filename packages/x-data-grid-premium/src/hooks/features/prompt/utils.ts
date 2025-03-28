import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

export const isAiAssistantAvailable = (
  props: Pick<DataGridPremiumProcessedProps, 'disableAiAssistant'>,
) => {
  return !props.disableAiAssistant;
};
