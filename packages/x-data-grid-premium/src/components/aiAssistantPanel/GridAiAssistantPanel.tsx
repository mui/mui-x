import * as React from 'react';
import { useGridSelector, getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { vars } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/system';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import {
  gridAiAssistantActiveConversationSelector,
  gridAiAssistantConversationsSelector,
} from '../../hooks/features/aiAssistant/gridAiAssistantSelectors';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { GridAiAssistantPanelConversation } from './GridAiAssistantPanelConversation';
import { GridPromptField } from '../promptField/GridPromptField';
import { GridAiAssistantPanelSuggestions } from './GridAiAssistantPanelSuggestions';
import { GridAiAssistantPanelConversationsMenu } from './GridAiAssistantPanelConversationsMenu';

type OwnerState = Pick<DataGridPremiumProcessedProps, 'classes'>;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['aiAssistantPanel'],
    header: ['aiAssistantPanelHeader'],
    title: ['aiAssistantPanelTitle'],
    titleContainer: ['aiAssistantPanelTitleContainer'],
    conversationTitle: ['aiAssistantPanelConversationTitle'],
    body: ['aiAssistantPanelBody'],
    emptyText: ['aiAssistantPanelEmptyText'],
    footer: ['aiAssistantPanelFooter'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const AiAssistantPanelRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanel',
})({
  flexDirection: 'column',
  width: 380,
  maxHeight: 'none',
  overflow: 'hidden',
});

const AiAssistantPanelHeader = styled('div', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelHeader',
})({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  boxSizing: 'border-box',
  borderBottom: `1px solid ${vars.colors.border.base}`,
  height: 52,
  padding: vars.spacing(0, 0.75, 0, 2),
});

const AiAssistantPanelTitleContainer = styled('div', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelTitleContainer',
})({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflow: 'hidden',
});

const AiAssistantPanelTitle = styled('span', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelTitle',
})({
  font: vars.typography.font.body,
  fontWeight: vars.typography.fontWeight.medium,
  marginTop: vars.spacing(0.25),
});

const AiAssistantPanelConversationTitle = styled('span', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelConversationTitle',
})({
  font: vars.typography.font.small,
  color: vars.colors.foreground.muted,
  marginTop: vars.spacing(-0.25),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const AiAssistantPanelBody = styled('div', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelBody',
})({
  flexGrow: 0,
  flexShrink: 0,
  height: 260,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const AiAssistantPanelEmptyText = styled('span', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelEmptyText',
})({
  font: vars.typography.font.body,
  color: vars.colors.foreground.muted,
});

const AiAssistantPanelFooter = styled('div', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelFooter',
})({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.spacing(1),
  borderTop: `1px solid ${vars.colors.border.base}`,
  padding: vars.spacing(1),
});

function GridAiAssistantPanel() {
  const {
    slots,
    slotProps,
    classes: rootPropsClasses,
    aiAssistantSuggestions,
  } = useGridRootProps();
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses({ classes: rootPropsClasses });
  const activeConversation = useGridSelector(apiRef, gridAiAssistantActiveConversationSelector);
  const conversations = useGridSelector(apiRef, gridAiAssistantConversationsSelector);
  const conversationTitle =
    activeConversation?.title || apiRef.current.getLocaleText('aiAssistantPanelNewConversation');

  const createConversation = React.useCallback(() => {
    const newConversation = conversations.findIndex((conversation) => !conversation.prompts.length);
    if (newConversation !== -1) {
      apiRef.current.aiAssistant.setActiveConversationIndex(newConversation);
    } else {
      apiRef.current.aiAssistant.setConversations((newConversations) => [
        ...newConversations,
        {
          title: apiRef.current.getLocaleText('aiAssistantPanelNewConversation'),
          prompts: [],
        },
      ]);
      apiRef.current.aiAssistant.setActiveConversationIndex(conversations.length);
    }
  }, [apiRef, conversations]);

  return (
    <AiAssistantPanelRoot className={classes.root}>
      <AiAssistantPanelHeader className={classes.header}>
        <AiAssistantPanelTitleContainer className={classes.titleContainer}>
          <AiAssistantPanelTitle className={classes.title}>
            {apiRef.current.getLocaleText('aiAssistantPanelTitle')}
          </AiAssistantPanelTitle>
          <AiAssistantPanelConversationTitle
            className={classes.conversationTitle}
            title={conversationTitle}
          >
            {conversationTitle}
          </AiAssistantPanelConversationTitle>
        </AiAssistantPanelTitleContainer>
        <slots.baseTooltip
          title={apiRef.current.getLocaleText('aiAssistantPanelNewConversation')}
          enterDelay={500}
        >
          <span>
            <slots.baseIconButton
              {...slotProps?.baseIconButton}
              disabled={!conversations.length || !activeConversation?.prompts.length}
              onClick={createConversation}
            >
              <slots.aiAssistantPanelNewConversationIcon fontSize="small" />
            </slots.baseIconButton>
          </span>
        </slots.baseTooltip>
        <GridAiAssistantPanelConversationsMenu />
        <slots.baseIconButton
          {...slotProps?.baseIconButton}
          aria-label={apiRef.current.getLocaleText('aiAssistantPanelClose')}
          onClick={apiRef.current.hidePreferences}
        >
          <slots.aiAssistantPanelCloseIcon fontSize="small" />
        </slots.baseIconButton>
      </AiAssistantPanelHeader>
      <AiAssistantPanelBody className={classes.body}>
        {activeConversation && activeConversation.prompts.length > 0 ? (
          <GridAiAssistantPanelConversation conversation={activeConversation} />
        ) : (
          <AiAssistantPanelEmptyText className={classes.emptyText}>
            {apiRef.current.getLocaleText('aiAssistantPanelEmptyConversation')}
          </AiAssistantPanelEmptyText>
        )}
      </AiAssistantPanelBody>
      <AiAssistantPanelFooter className={classes.footer}>
        <GridPromptField onSubmit={apiRef.current.aiAssistant.processPrompt} />
        {aiAssistantSuggestions && aiAssistantSuggestions.length > 0 && (
          <GridAiAssistantPanelSuggestions suggestions={aiAssistantSuggestions} />
        )}
      </AiAssistantPanelFooter>
    </AiAssistantPanelRoot>
  );
}

export { GridAiAssistantPanel };
