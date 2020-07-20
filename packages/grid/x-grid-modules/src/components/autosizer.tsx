import * as React from 'react';
import AutoSizer from '../../lib/autosizer';

export function AutoSizerWrapper(props: any) {
  return <AutoSizer {...props}>{(size: any) => props.children(size)}</AutoSizer>;
}
