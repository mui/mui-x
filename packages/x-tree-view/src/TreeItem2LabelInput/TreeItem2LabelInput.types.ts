import * as React from 'react';
import { MuiCancellableEventHandler } from '../internals/models/MuiCancellableEvent';

export interface TreeItem2LabelInputProps {
  value?: string;
  /**
   * Used to determine if the target of keydown or blur events is the input and prevent the event from propagating to the root.
   */
  'data-element'?: 'labelInput';
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: MuiCancellableEventHandler<React.KeyboardEvent<HTMLInputElement>>;
  onBlur?: MuiCancellableEventHandler<React.FocusEvent<HTMLInputElement>>;
  autoFocus?: true;
  type?: 'text';
}
