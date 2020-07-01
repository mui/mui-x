import React from 'react';
import styled from 'styled-components';

export const LogoContainer = styled.div`
  position: absolute;
  display: inline-flex;
  right: 20px;
  min-width: 60px;
`;
export const Logo = styled.img`
  padding: 3px;
  margin-right: 10px;
`;

export const MuiLogo: React.FC = () => (
  <Logo src="./mui-logo_raw.svg" alt="" className={'logo mui'} />
);
