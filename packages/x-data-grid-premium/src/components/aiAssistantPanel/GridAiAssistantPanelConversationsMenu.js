"use strict";
'use client';
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
exports.GridAiAssistantPanelConversationsMenu = GridAiAssistantPanelConversationsMenu;
var jsx_runtime_1 = require("react/jsx-runtime");
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
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('aiAssistantPanelConversationHistory'), enterDelay: 500, children: (0, jsx_runtime_1.jsx)("span", { children: (0, jsx_runtime_1.jsx)(rootProps.slots.baseIconButton, __assign({}, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseIconButton, { disabled: conversations.length === 0, id: triggerId, "aria-haspopup": "true", "aria-controls": open ? menuId : undefined, "aria-expanded": open ? 'true' : undefined, "aria-label": apiRef.current.getLocaleText('aiAssistantPanelConversationHistory'), onClick: handleOpen, ref: triggerRef, children: (0, jsx_runtime_1.jsx)(rootProps.slots.aiAssistantPanelHistoryIcon, { fontSize: "small" }) })) }) }), (0, jsx_runtime_1.jsx)(x_data_grid_pro_1.GridMenu, { target: triggerRef.current, open: open, onClose: handleClose, position: "bottom-end", children: (0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuList, __assign({ id: menuId, "aria-labelledby": triggerId, autoFocusItem: true }, (_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseMenuList, { children: sortedConversations.map(function (conversation, sortedIndex) {
                        var conversationIndex = conversations.findIndex(function (c) { return c === conversation; });
                        return ((0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuItem, { selected: conversationIndex === activeConversationIndex, onClick: function () {
                                apiRef.current.aiAssistant.setActiveConversationIndex(conversationIndex);
                                handleClose();
                            }, children: conversation.title }, "".concat(conversation.id, "-").concat(sortedIndex)));
                    }) })) })] }));
}
