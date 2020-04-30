import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;

  .country-flag {
    margin-right: 5px;
    margin-top: 10px;
    height: 32px;
    width: 32px;
  }
  .country-name {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const Country: React.FC<{ value: string }> = React.memo(({ value }) => {
  return (
    <Container>
      <img src={`/country-icons/32/${value.replace(' ', '-')}.png`} className={'country-flag'} />
      <span className={'country-name'}>{value}</span>
    </Container>
  );
});
