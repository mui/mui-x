'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { getDataGridUtilityClass, GridShadowScrollArea } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridPrompt } from '../prompt';
const useUtilityClasses = (ownerState) => {
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
})({
    flexShrink: 0,
    height: '100%',
});
const AiAssistantPanelConversationList = styled('ol', {
    name: 'MuiDataGrid',
    slot: 'AiAssistantPanelConversationList',
})({
    flex: 1,
    padding: 0,
    margin: 0,
});
function GridAiAssistantPanelConversation(props) {
    const { conversation } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    const ref = React.useRef(null);
    const apiRef = useGridApiContext();
    // Scroll to the bottom of the conversation when the prompt list changes
    React.useEffect(() => {
        ref.current?.scrollTo({
            top: ref.current?.scrollHeight,
            behavior: 'smooth',
        });
    }, [conversation]);
    return (_jsx(AiAssistantPanelConversationRoot, { className: classes.root, ownerState: rootProps, ref: ref, children: _jsx(AiAssistantPanelConversationList, { className: classes.list, ownerState: rootProps, children: conversation.prompts.map((item) => (_jsx(GridPrompt, { ...item, onRerun: () => apiRef.current.aiAssistant.processPrompt(item.value) }, item.createdAt.toISOString()))) }) }));
}
export { GridAiAssistantPanelConversation };
