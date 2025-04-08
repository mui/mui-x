import * as React from 'react';
import { useGridSelector, getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { vars } from '@mui/x-data-grid-pro/internals';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled } from '@mui/system';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import {
  gridAiAssistantSuggestionsSelector,
  gridAiAssistantActiveConversationSelector,
  gridAiAssistantConversationsSelector,
} from '../../hooks/features/aiAssistant/gridAiAssistantSelectors';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { GridAiAssistantPanelConversation } from './GridAiAssistantPanelConversation';
import { GridPromptField } from '../promptField/GridPromptField';
import { GridAiAssistantPanelSuggestions } from './GridAiAssistantPanelSuggestions';
import { GridAiAssistantPanelConversationsMenu } from './GridAiAssistantPanelConversationsMenu';

type OwnerState = DataGridPremiumProcessedProps;

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
})<{ ownerState: OwnerState }>({
  flexDirection: 'column',
  width: 380,
  maxHeight: 'none',
  overflow: 'hidden',
});

const AiAssistantPanelHeader = styled('div', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelHeader',
})<{ ownerState: OwnerState }>({
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
})<{ ownerState: OwnerState }>({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflow: 'hidden',
});

const AiAssistantPanelTitle = styled('span', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelTitle',
})<{ ownerState: OwnerState }>({
  font: vars.typography.font.body,
  fontWeight: vars.typography.fontWeight.medium,
  marginTop: vars.spacing(0.25),
});

const AiAssistantPanelConversationTitle = styled('span', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelConversationTitle',
})<{ ownerState: OwnerState }>({
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
})<{ ownerState: OwnerState }>({
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
})<{ ownerState: OwnerState }>({
  font: vars.typography.font.body,
  color: vars.colors.foreground.muted,
});

const AiAssistantPanelFooter = styled('div', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelFooter',
})<{ ownerState: OwnerState }>({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.spacing(1),
  borderTop: `1px solid ${vars.colors.border.base}`,
  padding: vars.spacing(1),
});

function GridAiAssistantPanel() {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses(rootProps);
  const activeConversation = useGridSelector(apiRef, gridAiAssistantActiveConversationSelector);
  const conversations = useGridSelector(apiRef, gridAiAssistantConversationsSelector);
  const suggestions = useGridSelector(apiRef, gridAiAssistantSuggestionsSelector);
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
    <AiAssistantPanelRoot className={classes.root} ownerState={rootProps}>
      <AiAssistantPanelHeader className={classes.header} ownerState={rootProps}>
        <AiAssistantPanelTitleContainer className={classes.titleContainer} ownerState={rootProps}>
          <AiAssistantPanelTitle className={classes.title} ownerState={rootProps}>
            {apiRef.current.getLocaleText('aiAssistantPanelTitle')}
          </AiAssistantPanelTitle>
          <AiAssistantPanelConversationTitle
            className={classes.conversationTitle}
            ownerState={rootProps}
            title={conversationTitle}
          >
            {conversationTitle}
          </AiAssistantPanelConversationTitle>
        </AiAssistantPanelTitleContainer>
        <rootProps.slots.baseTooltip
          title={apiRef.current.getLocaleText('aiAssistantPanelNewConversation')}
        >
          <span>
            <rootProps.slots.baseIconButton
              {...rootProps.slotProps?.baseIconButton}
              disabled={!conversations.length || !activeConversation?.prompts.length}
              onClick={createConversation}
            >
              <rootProps.slots.aiAssistantPanelNewConversationIcon fontSize="small" />
            </rootProps.slots.baseIconButton>
          </span>
        </rootProps.slots.baseTooltip>
        <GridAiAssistantPanelConversationsMenu />
        <rootProps.slots.baseIconButton
          {...rootProps.slotProps?.baseIconButton}
          aria-label={apiRef.current.getLocaleText('aiAssistantPanelClose')}
          onClick={apiRef.current.hidePreferences}
        >
          <rootProps.slots.aiAssistantPanelCloseIcon fontSize="small" />
        </rootProps.slots.baseIconButton>
      </AiAssistantPanelHeader>
      <AiAssistantPanelBody className={classes.body} ownerState={rootProps}>
        {activeConversation && activeConversation.prompts.length > 0 ? (
          <GridAiAssistantPanelConversation conversation={activeConversation} />
        ) : (
          <AiAssistantPanelEmptyText ownerState={rootProps} className={classes.emptyText}>
            {apiRef.current.getLocaleText('aiAssistantPanelEmptyConversation')}
          </AiAssistantPanelEmptyText>
        )}
      </AiAssistantPanelBody>
      <AiAssistantPanelFooter className={classes.footer} ownerState={rootProps}>
        <GridPromptField onSubmit={apiRef.current.aiAssistant.processPrompt} />
        {suggestions.length > 0 && <GridAiAssistantPanelSuggestions suggestions={suggestions} />}
      </AiAssistantPanelFooter>
    </AiAssistantPanelRoot>
  );
}

export { GridAiAssistantPanel };
