import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

export const isAiAssistantAvailable = (
  props: Pick<DataGridPremiumProcessedProps, 'aiAssistant'>,
) => {
  return !!props.aiAssistant;
};
