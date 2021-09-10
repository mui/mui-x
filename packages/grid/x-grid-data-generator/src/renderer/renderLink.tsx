import * as React from 'react';
import { GridCellParams } from '@mui/x-data-grid-pro';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    color: 'inherit',
  },
});

interface DemoLinkProps {
  href: string;
  children: string;
}

export const DemoLink = React.memo(function DemoLink(props: DemoLinkProps) {
  const classes = useStyles();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <a tabIndex={-1} className={classes.root} onClick={handleClick} href={props.href}>
      {props.children}
    </a>
  );
});

export function renderLink(params: GridCellParams) {
  return <DemoLink href={params.value!.toString()}>{params.value!.toString()}</DemoLink>;
}
