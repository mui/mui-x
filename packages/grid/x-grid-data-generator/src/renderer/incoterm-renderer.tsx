import * as React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import { CellParams, CellValue } from '@material-ui/x-grid';

export const Incoterm: React.FC<{ value: CellValue }> = React.memo(({ value }) => {
  if (!value) {
    return null;
  }
  const valueStr = value.toString();
  const tooltip = valueStr.slice(valueStr.indexOf('(') + 1, valueStr.indexOf(')'));
  const code = valueStr.slice(0, valueStr.indexOf('(')).trim();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>{code}</span>
      <Tooltip title={tooltip}>
        <InfoIcon className={'info-icon'} />
      </Tooltip>
    </div>
  );
});
Incoterm.displayName = 'Incoterm';

export function IncotermRenderer(params: CellParams) {
  return <Incoterm value={params.value!} />;
}
