import React, { useEffect, useState } from 'react';
import { AppBreadcrumbs } from '../../app-breadcrumbs';
import { Grid as DataGrid } from '@material-ui-x/grid';
import { MainContainer } from './components/main-container';
import { SettingsPanel } from './components/settings-panel';
import { commodityColumns, employeeColumns } from '@material-ui-x/grid-data-generator';
import '@material-ui-x/grid-data-generator/dist/demo-style.css';
import set = Reflect.set;

export const DEFAULT_DATASET = 'Employee';

const loadFile = async (file: string) => {
  const response = await fetch(file);
  const data = await response.json();
  console.log(data);

  return data;
};

export const CommodityGridDemo: React.FC<{}> = props => {
  const [size, setSize] = useState(100);
  const [type, setType] = useState('commodity');

  const [rows, setRows] = useState<any>([]);
  const [cols, setCols] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const gridColumns = type === 'commodity' ? commodityColumns : employeeColumns;
    setRows([]);
    setCols(gridColumns);
    setLoading(true);

    loadFile(`./static-data/${type}-${size}.json`).then(
      data => {
        setRows(data);
        setLoading(false);
      },
      err => {
        setRows([]);
      },
    );
  }, [setRows, type, size]);

  const onApplyClick = (settings: { size: number; type: string }) => {
    setSize(settings.size);
    setType(settings.type.toLowerCase());
  };

  return (
    <>
      {/*<AppBreadcrumbs name={'NEW* Material-UI Grid'} />*/}
      <SettingsPanel onApply={onApplyClick} size={size} type={type} />

      <MainContainer>
        <div style={{ display: 'flex', boxSizing: 'border-box' }} className={'fill-space'}>
          <div className={'grow'}>
            <DataGrid rows={rows as any} columns={cols as any} loading={loading} />
          </div>
        </div>
      </MainContainer>
    </>
  );
};
