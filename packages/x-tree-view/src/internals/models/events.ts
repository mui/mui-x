import * as React from 'react';

export interface TreeViewEventLookupElement {
  params: object;
}

// TODO: Type correctly
export type TreeViewEventListener<E extends TreeViewEventLookupElement> = (
  params: E['params'],
  event: MuiEvent<{}>,
) => void;

export type MuiBaseEvent =
  | React.SyntheticEvent<HTMLElement>
  | DocumentEventMap[keyof DocumentEventMap]
  | {};

export type MuiEvent<E extends MuiBaseEvent = MuiBaseEvent> = E & {
  defaultMuiPrevented?: boolean;
};
