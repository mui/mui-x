import React from 'react';
import { Link } from './link-renderer';

export const EmailRenderer: React.FC<{ label?: string; email: string }> = ({ label, email }) => {
  return <Link href={`mailto:${email}`}>{label || email}</Link>;
};
EmailRenderer.displayName = 'EmailRenderer';
