import type { FileInfo, API } from 'jscodeshift';

type MakeRequired<Type, Key extends keyof Type> = Pick<Type, Key> & Partial<Omit<Type, Key>>;

type MakeOptional<Type, Key extends keyof Type> = Omit<Type, Key> & Partial<Pick<Type, Key>>;

export type JsCodeShiftFileInfo = MakeOptional<FileInfo, 'path'>;

export type JsCodeShiftAPI = MakeRequired<API, 'jscodeshift'>;
