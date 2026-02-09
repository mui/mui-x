import type { PromptResponse, PromptResolverOptions } from './gridAiAssistantInterfaces';

type Result<T> = { ok: false; message: string } | { ok: true; data: T };

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
export function gridDefaultPromptResolver(
  url: string,
  query: string,
  context: string,
  conversationId?: string,
  optionsOrAdditionalContext: string | PromptResolverOptions = '',
) {
  // Handle backward compatibility: if string is passed, treat it as additionalContext
  const options: PromptResolverOptions =
    typeof optionsOrAdditionalContext === 'string'
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
      context,
      query,
      conversationId,
      options,
    }),
  })
    .then((result) => result.json())
    .then((result: Result<PromptResponse>) => {
      if (result.ok === false) {
        return Promise.reject(new Error(result.message));
      }
      return result.data;
    });
}
