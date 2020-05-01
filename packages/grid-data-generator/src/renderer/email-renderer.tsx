import React from 'react';
import styled from 'styled-components';

const StyledLink = styled.a`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: inherit;
`;

export const EmailRenderer: React.FC<{ label?: string; email: string }> = ({ label, email }) => {
  return <StyledLink href={`mailto:${email}`}>{label || email}</StyledLink>;
};
EmailRenderer.displayName = 'EmailRenderer';
