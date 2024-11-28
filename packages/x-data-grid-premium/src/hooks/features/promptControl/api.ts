import { PromptResponse } from './types';

type Result<T> = { ok: false; message: string } | { ok: true; data: T };

export function gridDefaultPromptResolver(url: string, context: string, query: string) {
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
    }),
  })
    .then((result) => result.json())
    .then((result: Result<PromptResponse>) => {
      if (result.ok === false) {
        return Promise.reject(new Error(result.message));
      }
      if (result.data.error) {
        return Promise.reject(new Error(result.data.error));
      }
      return result.data;
    });
}
