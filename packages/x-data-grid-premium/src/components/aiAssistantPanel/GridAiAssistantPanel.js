"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridAiAssistantPanel = GridAiAssistantPanel;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var composeClasses_1 = require("@mui/utils/composeClasses");
var system_1 = require("@mui/system");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var gridAiAssistantSelectors_1 = require("../../hooks/features/aiAssistant/gridAiAssistantSelectors");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var GridAiAssistantPanelConversation_1 = require("./GridAiAssistantPanelConversation");
var GridPromptField_1 = require("../promptField/GridPromptField");
var GridAiAssistantPanelSuggestions_1 = require("./GridAiAssistantPanelSuggestions");
var GridAiAssistantPanelConversationsMenu_1 = require("./GridAiAssistantPanelConversationsMenu");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['aiAssistantPanel'],
        header: ['aiAssistantPanelHeader'],
        title: ['aiAssistantPanelTitle'],
        titleContainer: ['aiAssistantPanelTitleContainer'],
        conversationTitle: ['aiAssistantPanelConversationTitle'],
        body: ['aiAssistantPanelBody'],
        emptyText: ['aiAssistantPanelEmptyText'],
        footer: ['aiAssistantPanelFooter'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
var AiAssistantPanelRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'AiAssistantPanel',
})({
    flexDirection: 'column',
    width: 380,
    maxHeight: 'none',
    overflow: 'hidden',
});
var AiAssistantPanelHeader = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'AiAssistantPanelHeader',
})({
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
    borderBottom: "1px solid ".concat(internals_1.vars.colors.border.base),
    height: 52,
    padding: internals_1.vars.spacing(0, 0.75, 0, 2),
});
var AiAssistantPanelTitleContainer = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'AiAssistantPanelTitleContainer',
})({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
});
var AiAssistantPanelTitle = (0, system_1.styled)('span', {
    name: 'MuiDataGrid',
    slot: 'AiAssistantPanelTitle',
})({
    font: internals_1.vars.typography.font.body,
    fontWeight: internals_1.vars.typography.fontWeight.medium,
    marginTop: internals_1.vars.spacing(0.25),
});
var AiAssistantPanelConversationTitle = (0, system_1.styled)('span', {
    name: 'MuiDataGrid',
    slot: 'AiAssistantPanelConversationTitle',
})({
    font: internals_1.vars.typography.font.small,
    color: internals_1.vars.colors.foreground.muted,
    marginTop: internals_1.vars.spacing(-0.25),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
});
var AiAssistantPanelBody = (0, system_1.styled)('div', {
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
var AiAssistantPanelEmptyText = (0, system_1.styled)('span', {
    name: 'MuiDataGrid',
    slot: 'AiAssistantPanelEmptyText',
})({
    font: internals_1.vars.typography.font.body,
    color: internals_1.vars.colors.foreground.muted,
});
var AiAssistantPanelFooter = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'AiAssistantPanelFooter',
})({
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: internals_1.vars.spacing(1),
    borderTop: "1px solid ".concat(internals_1.vars.colors.border.base),
    padding: internals_1.vars.spacing(1),
});
function GridAiAssistantPanel() {
    var _a, _b;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var classes = useUtilityClasses(rootProps);
    var activeConversation = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridAiAssistantSelectors_1.gridAiAssistantActiveConversationSelector);
    var conversations = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridAiAssistantSelectors_1.gridAiAssistantConversationsSelector);
    var conversationTitle = (activeConversation === null || activeConversation === void 0 ? void 0 : activeConversation.title) || apiRef.current.getLocaleText('aiAssistantPanelNewConversation');
    var createConversation = React.useCallback(function () {
        var newConversation = conversations.findIndex(function (conversation) { return !conversation.prompts.length; });
        if (newConversation !== -1) {
            apiRef.current.aiAssistant.setActiveConversationIndex(newConversation);
        }
        else {
            apiRef.current.aiAssistant.setConversations(function (newConversations) { return __spreadArray(__spreadArray([], newConversations, true), [
                {
                    title: apiRef.current.getLocaleText('aiAssistantPanelNewConversation'),
                    prompts: [],
                },
            ], false); });
            apiRef.current.aiAssistant.setActiveConversationIndex(conversations.length);
        }
    }, [apiRef, conversations]);
    return (<AiAssistantPanelRoot className={classes.root} ownerState={rootProps}>
      <AiAssistantPanelHeader className={classes.header} ownerState={rootProps}>
        <AiAssistantPanelTitleContainer className={classes.titleContainer} ownerState={rootProps}>
          <AiAssistantPanelTitle className={classes.title} ownerState={rootProps}>
            {apiRef.current.getLocaleText('aiAssistantPanelTitle')}
          </AiAssistantPanelTitle>
          <AiAssistantPanelConversationTitle className={classes.conversationTitle} ownerState={rootProps} title={conversationTitle}>
            {conversationTitle}
          </AiAssistantPanelConversationTitle>
        </AiAssistantPanelTitleContainer>
        <rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('aiAssistantPanelNewConversation')} enterDelay={500}>
          <span>
            <rootProps.slots.baseIconButton {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseIconButton} disabled={!conversations.length || !(activeConversation === null || activeConversation === void 0 ? void 0 : activeConversation.prompts.length)} onClick={createConversation}>
              <rootProps.slots.aiAssistantPanelNewConversationIcon fontSize="small"/>
            </rootProps.slots.baseIconButton>
          </span>
        </rootProps.slots.baseTooltip>
        <GridAiAssistantPanelConversationsMenu_1.GridAiAssistantPanelConversationsMenu />
        <rootProps.slots.baseIconButton {...(_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseIconButton} aria-label={apiRef.current.getLocaleText('aiAssistantPanelClose')} onClick={apiRef.current.hidePreferences}>
          <rootProps.slots.aiAssistantPanelCloseIcon fontSize="small"/>
        </rootProps.slots.baseIconButton>
      </AiAssistantPanelHeader>
      <AiAssistantPanelBody className={classes.body} ownerState={rootProps}>
        {activeConversation && activeConversation.prompts.length > 0 ? (<GridAiAssistantPanelConversation_1.GridAiAssistantPanelConversation conversation={activeConversation}/>) : (<AiAssistantPanelEmptyText ownerState={rootProps} className={classes.emptyText}>
            {apiRef.current.getLocaleText('aiAssistantPanelEmptyConversation')}
          </AiAssistantPanelEmptyText>)}
      </AiAssistantPanelBody>
      <AiAssistantPanelFooter className={classes.footer} ownerState={rootProps}>
        <GridPromptField_1.GridPromptField onSubmit={apiRef.current.aiAssistant.processPrompt}/>
        {rootProps.aiAssistantSuggestions && rootProps.aiAssistantSuggestions.length > 0 && (<GridAiAssistantPanelSuggestions_1.GridAiAssistantPanelSuggestions suggestions={rootProps.aiAssistantSuggestions}/>)}
      </AiAssistantPanelFooter>
    </AiAssistantPanelRoot>);
}
