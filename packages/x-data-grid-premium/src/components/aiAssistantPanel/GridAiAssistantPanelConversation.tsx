'use client';
import * as React from 'react';
import { getDataGridUtilityClass, GridShadowScrollArea } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/system';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { Conversation } from '../../hooks/features/aiAssistant/gridAiAssistantInterfaces';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridPrompt } from '../prompt';

type GridAiAssistantPanelConversationProps = {
  conversation: Conversation;
};

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['aiAssistantPanelConversation'],
    list: ['aiAssistantPanelConversationList'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const AiAssistantPanelConversationRoot = styled(GridShadowScrollArea, {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelConversation',
})<{ ownerState: OwnerState; ref: React.RefObject<HTMLDivElement | null> }>({
  flexShrink: 0,
  height: '100%',
});

const AiAssistantPanelConversationList = styled('ol', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelConversationList',
})<{ ownerState: OwnerState }>({
  flex: 1,
  padding: 0,
  margin: 0,
});

function GridAiAssistantPanelConversation(props: GridAiAssistantPanelConversationProps) {
  const { conversation } = props;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const ref = React.useRef<HTMLDivElement>(null);
  const apiRef = useGridApiContext();

  // Scroll to the bottom of the conversation when the prompt list changes
  React.useEffect(() => {
    ref.current?.scrollTo({
      top: ref.current?.scrollHeight,
      behavior: 'smooth',
    });
  }, [conversation]);

  return (
    <AiAssistantPanelConversationRoot className={classes.root} ownerState={rootProps} ref={ref}>
      <AiAssistantPanelConversationList className={classes.list} ownerState={rootProps}>
        {conversation.prompts.map((item) => (
          <GridPrompt
            key={item.createdAt.toISOString()}
            {...item}
            onRerun={() => apiRef.current.aiAssistant.processPrompt(item.value)}
          />
        ))}
      </AiAssistantPanelConversationList>
    </AiAssistantPanelConversationRoot>
  );
}

export { GridAiAssistantPanelConversation };
