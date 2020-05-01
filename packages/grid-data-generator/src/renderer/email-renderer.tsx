import React from 'react';

export const EmailRenderer: React.FC<{ label?: string; email: string }> = ({ label, email }) => {
  return (
    <a href={`mailto:${email}`} className={'ellipsis'}>
      {label || email}
    </a>
  );
};
EmailRenderer.displayName = 'EmailRenderer';
