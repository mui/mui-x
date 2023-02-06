import * as React from 'react';
import { styled } from '@mui/material/styles';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';

interface DemoLinkProps {
  href: string;
  children: string;
  tabIndex: number;
}

const Link = styled('a')({
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  color: 'inherit',
});

export const DemoLink = React.memo(function DemoLink(props: DemoLinkProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Link tabIndex={props.tabIndex} onClick={handleClick} href={props.href}>
      {props.children}
    </Link>
  );
});

export function renderLink(params: GridRenderCellParams<any, string, any>) {
  if (params.value == null) {
    return '';
  }

  return (
    <DemoLink href={params.value} tabIndex={params.tabIndex}>
      {params.value}
    </DemoLink>
  );
}
