"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridAiAssistantActiveConversationSelector = exports.gridAiAssistantConversationsSelector = exports.gridAiAssistantActiveConversationIndexSelector = void 0;
var internals_1 = require("@mui/x-data-grid-pro/internals");
var gridAiAssistantStateSelector = (0, internals_1.createRootSelector)(function (state) { return state.aiAssistant; });
exports.gridAiAssistantActiveConversationIndexSelector = (0, internals_1.createSelector)(gridAiAssistantStateSelector, function (aiAssistant) { return aiAssistant === null || aiAssistant === void 0 ? void 0 : aiAssistant.activeConversationIndex; });
exports.gridAiAssistantConversationsSelector = (0, internals_1.createSelector)(gridAiAssistantStateSelector, function (aiAssistant) { return aiAssistant === null || aiAssistant === void 0 ? void 0 : aiAssistant.conversations; });
exports.gridAiAssistantActiveConversationSelector = (0, internals_1.createSelectorMemoized)(exports.gridAiAssistantConversationsSelector, exports.gridAiAssistantActiveConversationIndexSelector, function (conversations, index) { return conversations[index]; });
