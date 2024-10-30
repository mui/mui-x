import type { FileInfo, API } from 'jscodeshift';
import { MakeOptional } from '@mui/x-internals/helpers';

type MakeRequired<Type, Key extends keyof Type> = Pick<Type, Key> & Partial<Omit<Type, Key>>;

export type JsCodeShiftFileInfo = MakeOptional<FileInfo, 'path'>;

export type JsCodeShiftAPI = MakeRequired<API, 'jscodeshift'>;
