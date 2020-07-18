import * as React from 'react';
import { CellParams } from '@material-ui/x-grid';
import { Link } from './link-renderer';

const EmailLink: React.FC<{ label?: string; email: string }> = React.memo(({ label, email }) => {
  return <Link href={`mailto:${email}`}>{label || email}</Link>;
});
EmailLink.displayName = 'EmailRenderer';

export function EmailRenderer(params: CellParams) {
  const email = params.value?.toString();
  return <EmailLink email={email || ''} label={email} />;
}
