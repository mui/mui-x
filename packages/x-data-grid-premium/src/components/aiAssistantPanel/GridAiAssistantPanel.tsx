import * as React from 'react';
import {
  useGridSelector,
  getDataGridUtilityClass,
  gridClasses,
  GridSlotProps,
} from '@mui/x-data-grid-pro';
import { vars, useGridPanelContext, NotRendered } from '@mui/x-data-grid-pro/internals';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled } from '@mui/system';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import {
  gridAiAssistantConversationSelector,
  gridAiAssistantPanelOpenSelector,
  gridAiAssistantSuggestionsSelector,
  gridAiAssistantActiveConversationIdSelector,
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

const AiAssistantPanelRoot = styled(NotRendered<GridSlotProps['panel']>, {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanel',
})<{ ownerState: OwnerState }>({
  [`& .${gridClasses.paper}`]: {
    flexDirection: 'column',
    width: 380,
    maxHeight: 'none',
    overflow: 'hidden',
  },
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
  const open = useGridSelector(apiRef, gridAiAssistantPanelOpenSelector);
  const activeConversationId = useGridSelector(apiRef, gridAiAssistantActiveConversationIdSelector);
  const conversation = useGridSelector(
    apiRef,
    gridAiAssistantConversationSelector,
    activeConversationId,
  );
  const conversations = useGridSelector(apiRef, gridAiAssistantConversationsSelector);
  const suggestions = useGridSelector(apiRef, gridAiAssistantSuggestionsSelector);
  const { aiAssistantPanelTriggerRef } = useGridPanelContext();
  const conversationTitle =
    conversation?.title || apiRef.current.getLocaleText('aiAssistantPanelNewConversation');

  return (
    <AiAssistantPanelRoot
      as={rootProps.slots.panel}
      open={open}
      target={aiAssistantPanelTriggerRef.current}
      className={classes.root}
      ownerState={rootProps}
      onClose={() => apiRef.current.aiAssistant.setAiAssistantPanelOpen(false)}
      {...rootProps.slotProps?.panel}
    >
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
              onClick={apiRef.current.aiAssistant.createAiAssistantConversation}
              disabled={activeConversationId === 'default' && conversations.length === 0}
            >
              <rootProps.slots.aiAssistantPanelNewConversationIcon fontSize="small" />
            </rootProps.slots.baseIconButton>
          </span>
        </rootProps.slots.baseTooltip>
        <GridAiAssistantPanelConversationsMenu />
        <rootProps.slots.baseIconButton
          {...rootProps.slotProps?.baseIconButton}
          aria-label={apiRef.current.getLocaleText('aiAssistantPanelClose')}
          onClick={() => apiRef.current.aiAssistant.setAiAssistantPanelOpen(false)}
        >
          <rootProps.slots.aiAssistantPanelCloseIcon fontSize="small" />
        </rootProps.slots.baseIconButton>
      </AiAssistantPanelHeader>
      <AiAssistantPanelBody className={classes.body} ownerState={rootProps}>
        {conversation && conversation.prompts.length > 0 ? (
          <GridAiAssistantPanelConversation open={open} conversation={conversation} />
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
