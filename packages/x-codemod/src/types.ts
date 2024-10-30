import type { FileInfo, API } from 'jscodeshift';
import { MakeOptional, MakeRequired } from '@mui/x-internals/helpers';

export type JsCodeShiftFileInfo = MakeOptional<FileInfo, 'path'>;

export type JsCodeShiftAPI = MakeRequired<API, 'jscodeshift'>;
