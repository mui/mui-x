"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridAiAssistantPanelSuggestions = GridAiAssistantPanelSuggestions;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var composeClasses_1 = require("@mui/utils/composeClasses");
var system_1 = require("@mui/system");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['aiAssistantPanelSuggestions'],
        list: ['aiAssistantPanelSuggestionsList'],
        item: ['aiAssistantPanelSuggestionsItem'],
        label: ['aiAssistantPanelSuggestionsLabel'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
var AiAssistantPanelSuggestionsRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'AiAssistantPanelSuggestions',
})({
    display: 'flex',
    flexDirection: 'column',
    gap: internals_1.vars.spacing(0.75),
});
var AiAssistantPanelSuggestionsList = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'AiAssistantPanelSuggestionsList',
})({
    display: 'flex',
    gap: internals_1.vars.spacing(0.75),
    overflow: 'auto',
    padding: internals_1.vars.spacing(1),
    margin: internals_1.vars.spacing(-1),
    scrollbarWidth: 'thin',
});
var AiAssistantPanelSuggestionsLabel = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'AiAssistantPanelSuggestionsLabel',
})({
    display: 'flex',
    alignItems: 'center',
    gap: internals_1.vars.spacing(1),
    font: internals_1.vars.typography.font.body,
    color: internals_1.vars.colors.foreground.muted,
    paddingLeft: internals_1.vars.spacing(0.5),
});
function GridAiAssistantPanelSuggestions(props) {
    var suggestions = props.suggestions;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var ownerState = { classes: rootProps.classes };
    var classes = useUtilityClasses(ownerState);
    return (<AiAssistantPanelSuggestionsRoot className={classes.root} ownerState={ownerState}>
      <AiAssistantPanelSuggestionsLabel className={classes.label} ownerState={ownerState}>
        {apiRef.current.getLocaleText('aiAssistantSuggestions')}
      </AiAssistantPanelSuggestionsLabel>
      <AiAssistantPanelSuggestionsList className={classes.list} ownerState={ownerState}>
        {suggestions.map(function (suggestion) { return (<rootProps.slots.baseChip key={suggestion.value} label={suggestion.value} className={classes.item} onClick={function () { return apiRef.current.aiAssistant.processPrompt(suggestion.value); }} variant="outlined"/>); })}
      </AiAssistantPanelSuggestionsList>
    </AiAssistantPanelSuggestionsRoot>);
}
