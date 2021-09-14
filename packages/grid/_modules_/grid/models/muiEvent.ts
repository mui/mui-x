import * as React from 'react';

type BaseEvent = React.SyntheticEvent | DocumentEventMap[keyof DocumentEventMap] | {};

export type MuiEvent<E extends BaseEvent = BaseEvent> = E & {
  defaultMuiPrevented?: boolean;
};
