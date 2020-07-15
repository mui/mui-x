import styled from 'styled-components';
import { CellParams } from '@material-ui/x-grid';
import * as React from 'react';

export const Link = styled.a`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: inherit;
`;

export function LinkRenderer(params: CellParams) {
  return <Link href={params.value!.toString()}>{params.value!.toString()}</Link>;
}
