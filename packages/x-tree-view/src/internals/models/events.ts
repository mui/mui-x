import { MuiEvent } from '@mui/x-internals/types';

export interface TreeViewEventLookupElement {
  params: object;
}

export type TreeViewEventListener<E extends TreeViewEventLookupElement> = (
  params: E['params'],
  event: MuiEvent<{}>,
) => void;
