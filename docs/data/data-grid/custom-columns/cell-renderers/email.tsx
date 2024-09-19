import * as React from 'react';
import { styled } from '@mui/material/styles';
import { GridRenderCellParams } from '@mui/x-data-grid';

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

const DemoLink = React.memo(function DemoLink(props: DemoLinkProps) {
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

export function renderEmail(params: GridRenderCellParams<any, string, any>) {
  const email = params.value ?? '';

  return (
    <DemoLink href={`mailto:${email}`} tabIndex={params.tabIndex}>
      {email}
    </DemoLink>
  );
}
