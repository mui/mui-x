import React from 'react';
import AutoSizer from '../../lib/autosizer';

export const AutoSizerWrapper: React.FC<any> = p => (
  <AutoSizer {...p}>{(size: any) => p.children(size)}</AutoSizer>
);
