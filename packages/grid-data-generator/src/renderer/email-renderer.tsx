import React from 'react';
import { Link } from './link-renderer';
import { CellParams } from '@material-ui-x/grid';

const EmailLink: React.FC<{ label?: string; email: string }> = ({ label, email }) => {
  return <Link href={`mailto:${email}`}>{label || email}</Link>;
};
EmailLink.displayName = 'EmailRenderer';

export function EmailRenderer(params: CellParams) {
  return <EmailLink email={params.value!.toString()} label={params.value!.toString()} />;
}
