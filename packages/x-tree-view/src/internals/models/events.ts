import * as React from 'react';
import { MuiCancellableEvent } from '@mui/x-internals/cancellableEvent';

export interface TreeViewEventLookupElement {
  params: object;
}

export type TreeViewEventListener<E extends TreeViewEventLookupElement> = (
  params: E['params'],
  event: MuiEvent<{}>,
) => void;

export type MuiBaseEvent =
  | React.SyntheticEvent<HTMLElement>
  | DocumentEventMap[keyof DocumentEventMap]
  | {};

export type MuiEvent<E extends MuiBaseEvent = MuiBaseEvent> = E & MuiCancellableEvent;
