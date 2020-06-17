import React from 'react';
import AutoSizer from '../../lib/autosizer/index';
import { AutoSizerProps, Size } from '../../lib/autosizer/types';

export const AutoSizerWrapper: React.FC<AutoSizerProps> = p => (
  <AutoSizer {...p}>{(size: Size) => p.children(size)}</AutoSizer>
);
