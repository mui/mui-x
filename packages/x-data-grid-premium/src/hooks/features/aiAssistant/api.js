"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridDefaultPromptResolver = gridDefaultPromptResolver;
/**
 * Prompt resolver for the <DataGridPremium /> component.
 * @param {string} url The URL to send the request to.
 * @param {string} query The query to be processed.
 * @param {string} context The prompt context containing necessary information about the current columns definition.
 * Either use the `context` parameter of the `onPrompt` callback or the return value of the `unstable_getPromptContext()` API method.
 * @param {string} conversationId The id of the conversation the prompt is part of. If not passed, prompt response will return a new conversation id that can be used to continue the newly started conversation.
 * @param {string | PromptResolverOptions} optionsOrAdditionalContext Optional, includes settings to extend and customize the prompt resolver's behaviour, or additional context string for backward compatibility.
 * @returns {Promise<PromptResponse>} The grid state updates to be applied.
 */
function gridDefaultPromptResolver(url, query, context, conversationId, optionsOrAdditionalContext) {
    if (optionsOrAdditionalContext === void 0) { optionsOrAdditionalContext = ''; }
    // Handle backward compatibility: if string is passed, treat it as additionalContext
    var options = typeof optionsOrAdditionalContext === 'string'
        ? { additionalContext: optionsOrAdditionalContext }
        : optionsOrAdditionalContext;
    return fetch(url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            context: context,
            query: query,
            conversationId: conversationId,
            options: options,
        }),
    })
        .then(function (result) { return result.json(); })
        .then(function (result) {
        if (result.ok === false) {
            return Promise.reject(new Error(result.message));
        }
        return result.data;
    });
}
