import * as React from 'react';
import { getDataGridUtilityClass, GridShadowScrollArea } from '@mui/x-data-grid-pro';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled } from '@mui/system';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { PromptHistory } from '../../hooks/features/aiAssistant/gridAiAssistantInterfaces';
import { GridPrompt } from '../prompt';

type GridAiAssistantPanelHistoryProps = {
  open: boolean;
  history: PromptHistory;
  onRerunPrompt: (value: string) => void;
};

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['aiAssistantPanelHistory'],
    list: ['aiAssistantPanelHistoryList'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const AiAssistantPanelHistoryRoot = styled(GridShadowScrollArea, {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelHistory',
})<{ ownerState: OwnerState; ref: React.RefObject<HTMLDivElement | null> }>({
  flexShrink: 0,
  height: '100%',
});

const AiAssistantPanelHistoryList = styled('ol', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelHistoryList',
})<{ ownerState: OwnerState }>({
  padding: 0,
  margin: 0,
});

function GridAiAssistantPanelHistory(props: GridAiAssistantPanelHistoryProps) {
  const { open, history, onRerunPrompt } = props;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const ref = React.useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the prompt history when the panel opens
  React.useEffect(() => {
    if (open) {
      ref.current?.scrollTo({
        top: ref.current?.scrollHeight,
        behavior: 'instant',
      });
    }
  }, [open]);

  // Scroll to the bottom of the prompt history when the prompt history changes
  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [history]);

  return (
    <AiAssistantPanelHistoryRoot className={classes.root} ownerState={rootProps} ref={ref}>
      <AiAssistantPanelHistoryList className={classes.list} ownerState={rootProps}>
        {history.map((item) => (
          <GridPrompt
            key={item.createdAt.toISOString()}
            {...item}
            onRerun={() => onRerunPrompt(item.value)}
          />
        ))}
      </AiAssistantPanelHistoryList>
    </AiAssistantPanelHistoryRoot>
  );
}

export { GridAiAssistantPanelHistory };
