"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridAiAssistantPanelConversation = GridAiAssistantPanelConversation;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var composeClasses_1 = require("@mui/utils/composeClasses");
var system_1 = require("@mui/system");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var prompt_1 = require("../prompt");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['aiAssistantPanelConversation'],
        list: ['aiAssistantPanelConversationList'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
var AiAssistantPanelConversationRoot = (0, system_1.styled)(x_data_grid_pro_1.GridShadowScrollArea, {
    name: 'MuiDataGrid',
    slot: 'AiAssistantPanelConversation',
})({
    flexShrink: 0,
    height: '100%',
});
var AiAssistantPanelConversationList = (0, system_1.styled)('ol', {
    name: 'MuiDataGrid',
    slot: 'AiAssistantPanelConversationList',
})({
    flex: 1,
    padding: 0,
    margin: 0,
});
function GridAiAssistantPanelConversation(props) {
    var conversation = props.conversation;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var classes = useUtilityClasses(rootProps);
    var ref = React.useRef(null);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    // Scroll to the bottom of the conversation when the prompt list changes
    React.useEffect(function () {
        var _a, _b;
        (_a = ref.current) === null || _a === void 0 ? void 0 : _a.scrollTo({
            top: (_b = ref.current) === null || _b === void 0 ? void 0 : _b.scrollHeight,
            behavior: 'smooth',
        });
    }, [conversation]);
    return (<AiAssistantPanelConversationRoot className={classes.root} ownerState={rootProps} ref={ref}>
      <AiAssistantPanelConversationList className={classes.list} ownerState={rootProps}>
        {conversation.prompts.map(function (item) { return (<prompt_1.GridPrompt key={item.createdAt.toISOString()} {...item} onRerun={function () { return apiRef.current.aiAssistant.processPrompt(item.value); }}/>); })}
      </AiAssistantPanelConversationList>
    </AiAssistantPanelConversationRoot>);
}
