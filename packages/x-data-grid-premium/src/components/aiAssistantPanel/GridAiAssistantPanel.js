"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var jsx_runtime_1 = require("react/jsx-runtime");
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
    return ((0, jsx_runtime_1.jsxs)(AiAssistantPanelRoot, { className: classes.root, ownerState: rootProps, children: [(0, jsx_runtime_1.jsxs)(AiAssistantPanelHeader, { className: classes.header, ownerState: rootProps, children: [(0, jsx_runtime_1.jsxs)(AiAssistantPanelTitleContainer, { className: classes.titleContainer, ownerState: rootProps, children: [(0, jsx_runtime_1.jsx)(AiAssistantPanelTitle, { className: classes.title, ownerState: rootProps, children: apiRef.current.getLocaleText('aiAssistantPanelTitle') }), (0, jsx_runtime_1.jsx)(AiAssistantPanelConversationTitle, { className: classes.conversationTitle, ownerState: rootProps, title: conversationTitle, children: conversationTitle })] }), (0, jsx_runtime_1.jsx)(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('aiAssistantPanelNewConversation'), enterDelay: 500, children: (0, jsx_runtime_1.jsx)("span", { children: (0, jsx_runtime_1.jsx)(rootProps.slots.baseIconButton, __assign({}, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseIconButton, { disabled: !conversations.length || !(activeConversation === null || activeConversation === void 0 ? void 0 : activeConversation.prompts.length), onClick: createConversation, children: (0, jsx_runtime_1.jsx)(rootProps.slots.aiAssistantPanelNewConversationIcon, { fontSize: "small" }) })) }) }), (0, jsx_runtime_1.jsx)(GridAiAssistantPanelConversationsMenu_1.GridAiAssistantPanelConversationsMenu, {}), (0, jsx_runtime_1.jsx)(rootProps.slots.baseIconButton, __assign({}, (_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseIconButton, { "aria-label": apiRef.current.getLocaleText('aiAssistantPanelClose'), onClick: apiRef.current.hidePreferences, children: (0, jsx_runtime_1.jsx)(rootProps.slots.aiAssistantPanelCloseIcon, { fontSize: "small" }) }))] }), (0, jsx_runtime_1.jsx)(AiAssistantPanelBody, { className: classes.body, ownerState: rootProps, children: activeConversation && activeConversation.prompts.length > 0 ? ((0, jsx_runtime_1.jsx)(GridAiAssistantPanelConversation_1.GridAiAssistantPanelConversation, { conversation: activeConversation })) : ((0, jsx_runtime_1.jsx)(AiAssistantPanelEmptyText, { ownerState: rootProps, className: classes.emptyText, children: apiRef.current.getLocaleText('aiAssistantPanelEmptyConversation') })) }), (0, jsx_runtime_1.jsxs)(AiAssistantPanelFooter, { className: classes.footer, ownerState: rootProps, children: [(0, jsx_runtime_1.jsx)(GridPromptField_1.GridPromptField, { onSubmit: apiRef.current.aiAssistant.processPrompt }), rootProps.aiAssistantSuggestions && rootProps.aiAssistantSuggestions.length > 0 && ((0, jsx_runtime_1.jsx)(GridAiAssistantPanelSuggestions_1.GridAiAssistantPanelSuggestions, { suggestions: rootProps.aiAssistantSuggestions }))] })] }));
}
