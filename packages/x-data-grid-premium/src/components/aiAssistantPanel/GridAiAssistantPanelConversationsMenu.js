"use strict";
'use client';
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
exports.GridAiAssistantPanelConversationsMenu = GridAiAssistantPanelConversationsMenu;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var useId_1 = require("@mui/utils/useId");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var gridAiAssistantSelectors_1 = require("../../hooks/features/aiAssistant/gridAiAssistantSelectors");
function GridAiAssistantPanelConversationsMenu() {
    var _a, _b;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var activeConversationIndex = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridAiAssistantSelectors_1.gridAiAssistantActiveConversationIndexSelector);
    var conversations = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridAiAssistantSelectors_1.gridAiAssistantConversationsSelector);
    var _c = React.useState(false), open = _c[0], setOpen = _c[1];
    var menuId = (0, useId_1.default)();
    var triggerId = (0, useId_1.default)();
    var triggerRef = React.useRef(null);
    var handleOpen = function () {
        setOpen(!open);
    };
    var handleClose = function () {
        setOpen(false);
    };
    // Ordered by most recent prompt in conversations
    var sortedConversations = React.useMemo(function () {
        return __spreadArray([], conversations, true).sort(function (a, b) {
            if (!a.prompts.length) {
                return -1;
            }
            // New conversations should be at the top
            if (!b.prompts.length) {
                return 1;
            }
            return (b.prompts[b.prompts.length - 1].createdAt.getTime() -
                a.prompts[a.prompts.length - 1].createdAt.getTime());
        });
    }, [conversations]);
    return (<React.Fragment>
      <rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('aiAssistantPanelConversationHistory')} enterDelay={500}>
        <span>
          <rootProps.slots.baseIconButton {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseIconButton} disabled={conversations.length === 0} id={triggerId} aria-haspopup="true" aria-controls={open ? menuId : undefined} aria-expanded={open ? 'true' : undefined} aria-label={apiRef.current.getLocaleText('aiAssistantPanelConversationHistory')} onClick={handleOpen} ref={triggerRef}>
            <rootProps.slots.aiAssistantPanelHistoryIcon fontSize="small"/>
          </rootProps.slots.baseIconButton>
        </span>
      </rootProps.slots.baseTooltip>
      <x_data_grid_pro_1.GridMenu target={triggerRef.current} open={open} onClose={handleClose} position="bottom-end">
        <rootProps.slots.baseMenuList id={menuId} aria-labelledby={triggerId} autoFocusItem {...(_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseMenuList}>
          {sortedConversations.map(function (conversation, sortedIndex) {
            var conversationIndex = conversations.findIndex(function (c) { return c === conversation; });
            return (<rootProps.slots.baseMenuItem key={"".concat(conversation.id, "-").concat(sortedIndex)} selected={conversationIndex === activeConversationIndex} onClick={function () {
                    apiRef.current.aiAssistant.setActiveConversationIndex(conversationIndex);
                    handleClose();
                }}>
                {conversation.title}
              </rootProps.slots.baseMenuItem>);
        })}
        </rootProps.slots.baseMenuList>
      </x_data_grid_pro_1.GridMenu>
    </React.Fragment>);
}
