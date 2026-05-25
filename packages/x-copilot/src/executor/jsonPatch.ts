import type { JsonPatchOp } from './types';

/** Decode a single JSON Pointer reference token per RFC 6901. */
export function decodePointerToken(token: string): string {
  return token.replace(/~1/g, '/').replace(/~0/g, '~');
}

/** Split a JSON Pointer into reference tokens, decoding each. */
export function tokenize(path: string): string[] {
  if (path === '') {
    return [];
  }
  if (!path.startsWith('/')) {
    throw new Error(`MUI X Copilot: JSON Pointer must start with '/' — received '${path}'.`);
  }
  return path.split('/').slice(1).map(decodePointerToken);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cloneAlong(root: unknown, tokens: string[]): unknown {
  if (tokens.length === 0) {
    return root;
  }
  const head = tokens[0];
  const rest = tokens.slice(1);
  if (Array.isArray(root)) {
    const next = root.slice();
    const idx = head === '-' ? root.length : Number(head);
    if (rest.length > 0) {
      next[idx] = cloneAlong(root[idx], rest);
    }
    return next;
  }
  if (isPlainObject(root)) {
    const next: Record<string, unknown> = { ...root };
    if (rest.length > 0) {
      next[head] = cloneAlong(root[head], rest);
    }
    return next;
  }
  return root;
}

function getAt(root: unknown, tokens: string[]): unknown {
  let current: any = root;
  for (const token of tokens) {
    if (current == null) {
      return undefined;
    }
    if (Array.isArray(current)) {
      current = current[Number(token)];
    } else if (isPlainObject(current)) {
      current = current[token];
    } else {
      return undefined;
    }
  }
  return current;
}

function setAt(root: unknown, tokens: string[], value: unknown): unknown {
  if (tokens.length === 0) {
    return value;
  }
  const cloned = cloneAlong(root, tokens);
  let cursor: any = cloned;
  for (let i = 0; i < tokens.length - 1; i += 1) {
    const token = tokens[i];
    if (Array.isArray(cursor)) {
      cursor = cursor[Number(token)];
    } else {
      cursor = cursor[token];
    }
  }
  const last = tokens[tokens.length - 1];
  if (Array.isArray(cursor)) {
    cursor[Number(last)] = value;
  } else {
    cursor[last] = value;
  }
  return cloned;
}

function addAt(root: unknown, tokens: string[], value: unknown): unknown {
  if (tokens.length === 0) {
    return value;
  }
  const cloned = cloneAlong(root, tokens);
  let cursor: any = cloned;
  for (let i = 0; i < tokens.length - 1; i += 1) {
    const token = tokens[i];
    if (Array.isArray(cursor)) {
      cursor = cursor[Number(token)];
    } else {
      cursor = cursor[token];
    }
  }
  const last = tokens[tokens.length - 1];
  if (Array.isArray(cursor)) {
    if (last === '-') {
      cursor.push(value);
    } else {
      cursor.splice(Number(last), 0, value);
    }
  } else {
    cursor[last] = value;
  }
  return cloned;
}

function removeAt(root: unknown, tokens: string[]): unknown {
  if (tokens.length === 0) {
    return undefined;
  }
  const cloned = cloneAlong(root, tokens);
  let cursor: any = cloned;
  for (let i = 0; i < tokens.length - 1; i += 1) {
    const token = tokens[i];
    if (Array.isArray(cursor)) {
      cursor = cursor[Number(token)];
    } else {
      cursor = cursor[token];
    }
  }
  const last = tokens[tokens.length - 1];
  if (Array.isArray(cursor)) {
    cursor.splice(Number(last), 1);
  } else {
    delete cursor[last];
  }
  return cloned;
}

/**
 * Apply a single RFC 6902 patch op (replace/add/remove only).
 * Returns a new document; the input is never mutated.
 */
export function applyJsonPatch<T>(doc: T, op: JsonPatchOp): T {
  if (op.op !== 'replace' && op.op !== 'add' && op.op !== 'remove') {
    throw new Error(`MUI X Copilot: unsupported JSON Patch op '${op.op}'.`);
  }
  const tokens = tokenize(op.path);
  switch (op.op) {
    case 'replace':
      return setAt(doc, tokens, op.value) as T;
    case 'add':
      return addAt(doc, tokens, op.value) as T;
    case 'remove':
      return removeAt(doc, tokens) as T;
    default:
      return doc;
  }
}

/** Read the value at a JSON Pointer. Returns `undefined` for missing paths. */
export function readAt<T = unknown>(doc: unknown, path: string): T | undefined {
  return getAt(doc, tokenize(path)) as T | undefined;
}
