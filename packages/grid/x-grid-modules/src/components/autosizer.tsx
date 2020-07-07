import * as React from 'react';
import AutoSizer from '../../lib/autosizer';

export const AutoSizerWrapper: React.FC<any> = props => (
  <AutoSizer {...props}>{(size: any) => props.children(size)}</AutoSizer>
);
