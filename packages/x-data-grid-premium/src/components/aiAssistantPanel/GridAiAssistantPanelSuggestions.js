import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import { vars } from '@mui/x-data-grid-pro/internals';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['aiAssistantPanelSuggestions'],
        list: ['aiAssistantPanelSuggestionsList'],
        item: ['aiAssistantPanelSuggestionsItem'],
        label: ['aiAssistantPanelSuggestionsLabel'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const AiAssistantPanelSuggestionsRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'AiAssistantPanelSuggestions',
})({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing(0.75),
});
const AiAssistantPanelSuggestionsList = styled('div', {
    name: 'MuiDataGrid',
    slot: 'AiAssistantPanelSuggestionsList',
})({
    display: 'flex',
    gap: vars.spacing(0.75),
    overflow: 'auto',
    padding: vars.spacing(1),
    margin: vars.spacing(-1),
    scrollbarWidth: 'thin',
});
const AiAssistantPanelSuggestionsLabel = styled('div', {
    name: 'MuiDataGrid',
    slot: 'AiAssistantPanelSuggestionsLabel',
})({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing(1),
    font: vars.typography.font.body,
    color: vars.colors.foreground.muted,
    paddingLeft: vars.spacing(0.5),
});
function GridAiAssistantPanelSuggestions(props) {
    const { suggestions } = props;
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();
    const ownerState = { classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);
    return (_jsxs(AiAssistantPanelSuggestionsRoot, { className: classes.root, ownerState: ownerState, children: [_jsx(AiAssistantPanelSuggestionsLabel, { className: classes.label, ownerState: ownerState, children: apiRef.current.getLocaleText('aiAssistantSuggestions') }), _jsx(AiAssistantPanelSuggestionsList, { className: classes.list, ownerState: ownerState, children: suggestions.map((suggestion) => (_jsx(rootProps.slots.baseChip, { label: suggestion.value, className: classes.item, onClick: () => apiRef.current.aiAssistant.processPrompt(suggestion.value), variant: "outlined" }, suggestion.value))) })] }));
}
export { GridAiAssistantPanelSuggestions };
