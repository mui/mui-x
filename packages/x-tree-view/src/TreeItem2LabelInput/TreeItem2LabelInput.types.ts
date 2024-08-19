import * as React from 'react';
import { MuiCancellableEventHandler } from '../internals/models/MuiCancellableEvent';

export interface TreeItem2LabelInputProps {
  value?: string;
  'data-element'?: 'labelInput';
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: MuiCancellableEventHandler<React.KeyboardEvent<HTMLInputElement>>;
  onBlur?: MuiCancellableEventHandler<React.FocusEvent<HTMLInputElement>>;
  autoFocus?: true;
  type?: 'text';
}
