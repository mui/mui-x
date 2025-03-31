import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

export const isAiAssistantAvailable = (
  props: Pick<DataGridPremiumProcessedProps, 'enableAiAssistant'>,
) => {
  return !!props.enableAiAssistant;
};
