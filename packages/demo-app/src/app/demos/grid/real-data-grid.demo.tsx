import React, { useEffect, useState } from 'react';
import { AppBreadcrumbs } from '../../app-breadcrumbs';
import { Grid as DataGrid } from '@material-ui-x/grid';
import { MainContainer } from './components/main-container';
import { SettingsPanel } from './components/settings-panel';
import { commodityColumns, employeeColumns } from '@material-ui-x/grid-data-generator';
import '@material-ui-x/grid-data-generator/dist/demo-style.css';
import { useTheme } from '../theme';

export const DEFAULT_DATASET = 'Employee';

const loadFile = async (file: string) => {
  const response = await fetch(file);
  const data = await response.json();

  return data;
};

export const RealDataGridDemo: React.FC<{}> = props => {
  const [size, setSize] = useState(100);
  const [type, setType] = useState('commodity');

  const [rows, setRows] = useState<any>([]);
  const [cols, setCols] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [theme, themeId, toggleTheme, isDark] = useTheme();

  useEffect(() => {
    const gridColumns = type === 'commodity' ? commodityColumns : employeeColumns;
    setRows([]);
    setCols(gridColumns);
    setLoading(true);

    loadFile(`./static-data/${type}-1000.json`).then(
      data => {
        if (size > 1000) {
          while (data.length < size) {
            data = [...data, ...data];
          }
          data = data.map((row, idx) => ({ ...row, ...{ id: idx } }));
        }
        data.length = size;

        console.log(`Setting rows with length ${data.length}`);
        setRows(data);
        setLoading(false);
      },
      err => {
        setRows([]);
      },
    );
  }, [setRows, type, size]);

  const onApplyClick = (settings: { size: number; type: string; selectedTheme: string }) => {
    if (size !== settings.size) {
      setSize(settings.size);
    }
    if (type !== settings.type) {
      setType(settings.type.toLowerCase());
    }
    if (settings.selectedTheme !== themeId) {
      toggleTheme();
    }
  };

  return (
    <>
      <AppBreadcrumbs name={'NEW* Material-UI X Grid'} />
      <SettingsPanel onApply={onApplyClick} size={size} type={type} />

      <MainContainer>
        <div style={{ display: 'flex', boxSizing: 'border-box' }} className={'fill-space'}>
          <div className={'grow'}>
            <DataGrid
              rows={rows as any}
              columns={cols as any}
              loading={loading}
              options={{ checkboxSelection: true }}
            />
          </div>
        </div>
      </MainContainer>
    </>
  );
};
