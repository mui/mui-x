import * as React from 'react';
import styled from 'styled-components';
import { CellParams } from '@material-ui/x-grid';

const Container = styled.div`
  display: flex;

  .country-flag {
    margin-right: 5px;
    margin-top: 5px;
    height: 32px;
    width: 32px;
    font-size: 32px;
  }
  .country-name {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
function countryToFlag(isoCode: string) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

export const Country: React.FC<{ value: { code: string; label: string } }> = React.memo(
  ({ value }) => {
    return (
      <Container>
        <span className={'country-flag'}>{countryToFlag(value.code)}</span>
        <span className={'country-name'}>{value.label}</span>
      </Container>
    );
  },
);
Country.displayName = 'Country';

export function CountryRenderer(params: CellParams) {
  return <Country value={params.value! as any} />;
}
