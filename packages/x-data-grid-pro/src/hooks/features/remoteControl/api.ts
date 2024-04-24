import { Response } from './apiTypes';

type Result<T> = { ok: false; message: string } | { ok: true; data: T };

const REMOTE_ENDPOINT = process.env.NODE_ENV === 'development' ? 'http://localhost:3006' : '';

export function controls(context: string, query: string) {
  return fetch(`${REMOTE_ENDPOINT}/api/v1`, {
    mode: 'cors',
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
    credentials: 'include',
    redirect: 'follow',
    body: JSON.stringify({
      context: JSON.stringify(context),
      query,
    }),
  })
    .then((result) => result.json())
    .then((result: Result<Response>) => {
      if (result.ok === false) {
        return Promise.reject(new Error(result.message));
      }
      if (result.data.error) {
        return Promise.reject(new Error(result.data.error));
      }
      return result.data;
    });
}
