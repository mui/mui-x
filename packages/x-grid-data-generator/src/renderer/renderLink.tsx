import * as React from 'react';
import { CellParams } from '@material-ui/x-grid';
import { makeStyles } from '@material-ui/core/styles';

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

  const handleClick = (event) => {
    event.preventDefault();
  };

  return (
    <a className={classes.root} onClick={handleClick} href={props.href}>
      {props.children}
    </a>
  );
});

export function renderLink(params: CellParams) {
  return <DemoLink href={params.value!.toString()}>{params.value!.toString()}</DemoLink>;
}
