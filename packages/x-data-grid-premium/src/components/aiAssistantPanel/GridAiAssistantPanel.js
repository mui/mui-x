import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { useGridSelector, getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { vars } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridAiAssistantActiveConversationSelector, gridAiAssistantConversationsSelector, } from '../../hooks/features/aiAssistant/gridAiAssistantSelectors';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridAiAssistantPanelConversation } from './GridAiAssistantPanelConversation';
import { GridPromptField } from '../promptField/GridPromptField';
import { GridAiAssistantPanelSuggestions } from './GridAiAssistantPanelSuggestions';
import { GridAiAssistantPanelConversationsMenu } from './GridAiAssistantPanelConversationsMenu';
const useUtilityClasses = (ownerState) => {
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
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();
    const classes = useUtilityClasses(rootProps);
    const activeConversation = useGridSelector(apiRef, gridAiAssistantActiveConversationSelector);
    const conversations = useGridSelector(apiRef, gridAiAssistantConversationsSelector);
    const conversationTitle = activeConversation?.title || apiRef.current.getLocaleText('aiAssistantPanelNewConversation');
    const createConversation = React.useCallback(() => {
        const newConversation = conversations.findIndex((conversation) => !conversation.prompts.length);
        if (newConversation !== -1) {
            apiRef.current.aiAssistant.setActiveConversationIndex(newConversation);
        }
        else {
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
    return (_jsxs(AiAssistantPanelRoot, { className: classes.root, ownerState: rootProps, children: [_jsxs(AiAssistantPanelHeader, { className: classes.header, ownerState: rootProps, children: [_jsxs(AiAssistantPanelTitleContainer, { className: classes.titleContainer, ownerState: rootProps, children: [_jsx(AiAssistantPanelTitle, { className: classes.title, ownerState: rootProps, children: apiRef.current.getLocaleText('aiAssistantPanelTitle') }), _jsx(AiAssistantPanelConversationTitle, { className: classes.conversationTitle, ownerState: rootProps, title: conversationTitle, children: conversationTitle })] }), _jsx(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('aiAssistantPanelNewConversation'), enterDelay: 500, children: _jsx("span", { children: _jsx(rootProps.slots.baseIconButton, { ...rootProps.slotProps?.baseIconButton, disabled: !conversations.length || !activeConversation?.prompts.length, onClick: createConversation, children: _jsx(rootProps.slots.aiAssistantPanelNewConversationIcon, { fontSize: "small" }) }) }) }), _jsx(GridAiAssistantPanelConversationsMenu, {}), _jsx(rootProps.slots.baseIconButton, { ...rootProps.slotProps?.baseIconButton, "aria-label": apiRef.current.getLocaleText('aiAssistantPanelClose'), onClick: apiRef.current.hidePreferences, children: _jsx(rootProps.slots.aiAssistantPanelCloseIcon, { fontSize: "small" }) })] }), _jsx(AiAssistantPanelBody, { className: classes.body, ownerState: rootProps, children: activeConversation && activeConversation.prompts.length > 0 ? (_jsx(GridAiAssistantPanelConversation, { conversation: activeConversation })) : (_jsx(AiAssistantPanelEmptyText, { ownerState: rootProps, className: classes.emptyText, children: apiRef.current.getLocaleText('aiAssistantPanelEmptyConversation') })) }), _jsxs(AiAssistantPanelFooter, { className: classes.footer, ownerState: rootProps, children: [_jsx(GridPromptField, { onSubmit: apiRef.current.aiAssistant.processPrompt }), rootProps.aiAssistantSuggestions && rootProps.aiAssistantSuggestions.length > 0 && (_jsx(GridAiAssistantPanelSuggestions, { suggestions: rootProps.aiAssistantSuggestions }))] })] }));
}
export { GridAiAssistantPanel };
