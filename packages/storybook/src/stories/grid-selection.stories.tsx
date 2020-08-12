import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { XGrid, GridOptionsProp, useApiRef } from '@material-ui/x-grid';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { getData, GridData } from '../data/data-service';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/Selection',
  component: XGrid,
  decorators: [withKnobs, withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

export const ApiPreSelectedRows = () => {
  const apiRef = useApiRef();
  const [data, setData] = React.useState<GridData>({ rows: [], columns: [] });

  React.useEffect(() => {
    if (data.rows.length > 0) {
      apiRef.current.selectRows([1, 3, 5]);
      apiRef.current.selectRow(8, true, true);
    }
  }, [data, apiRef]);

  const loadData = async () => {
    const newData = await getData(50, 5);
    setData(newData);
  };

  React.useEffect(() => {
    loadData();
  }, []);

  return <XGrid rows={data.rows} columns={data.columns} apiRef={apiRef} />;
};

export const EventsMapped = () => {
  const data = useData(200, 200);

  const options: GridOptionsProp = {
    onSelectionChange: (params) => action('onSelectionChange', { depth: 1 })(params),
    onRowSelected: (params) => action('onRowSelected')(params),
  };

  return <XGrid rows={data.rows} columns={data.columns} {...options} />;
};

export const SingleSelect = () => {
  const data = useData(200, 200);
  const options: GridOptionsProp = {
    enableMultipleSelection: false,
  };

  return <XGrid rows={data.rows} columns={data.columns} {...options} />;
};

export const MultipleSelect = () => {
  const data = useData(200, 200);
  const options: GridOptionsProp = {
    enableMultipleSelection: true,
  };

  return <XGrid rows={data.rows} columns={data.columns} {...options} />;
};
export const MultipleSelectWithCheckbox = () => {
  const data = useData(200, 200);
  const options: GridOptionsProp = {
    checkboxSelection: true,
  };

  return <XGrid rows={data.rows} columns={data.columns} {...options} />;
};
export const MultipleSelectWithCheckboxNoClick = () => {
  const data = useData(200, 200);
  const options: GridOptionsProp = {
    checkboxSelection: true,
    disableSelectionOnClick: true,
  };

  return <XGrid rows={data.rows} columns={data.columns} {...options} />;
};
