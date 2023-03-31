import * as React from 'react';
import {
  DataGridPremium,
  GridValidRowModel,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';

const initialRows = [
  {
    id: 'e2a20b35-811b-591c-8a76-1f3fd5616c49',
    desk: 'D-3195',
    commodity: 'Soybeans',
    traderName: 'Cornelia Farmer',
    traderEmail: 'mufrukir@sonij.tv',
    quantity: 48391,
  },
  {
    id: '554328ce-7fa7-5d1b-b5b8-92b76341d66b',
    desk: 'D-9359',
    commodity: 'Robusta coffee',
    traderName: 'Lily Powers',
    traderEmail: 'emaaje@honofrut.my',
    quantity: 11711,
  },
  {
    id: '0116fdbe-5578-5fba-8040-5270033df47b',
    desk: 'D-1480',
    commodity: 'Rough Rice',
    traderName: 'Mabel Copeland',
    traderEmail: 'famul@gafkuf.am',
    quantity: 84675,
  },
  {
    id: 'ae71ff00-d8ac-5c73-b749-4322f9645532',
    desk: 'D-4179',
    commodity: 'Soybeans',
    traderName: 'Susie Bryan',
    traderEmail: 'ponnuntu@hibgelga.hn',
    quantity: 89348,
  },
  {
    id: 'e7daa7d1-c9e9-54c7-b04d-e2f19e51e3c1',
    desk: 'D-2637',
    commodity: 'Wheat',
    traderName: 'Fred Zimmerman',
    traderEmail: 'jij@lehu.fo',
    quantity: 48916,
  },
  {
    id: 'c43052d4-bfa8-5e41-a9ce-e8c2247730d0',
    desk: 'D-9171',
    commodity: 'Sugar No.11',
    traderName: 'Ophelia McDonald',
    traderEmail: 'balcubuho@biheta.ir',
    quantity: 13513,
  },
  {
    id: '15cfe69c-ad54-5d0e-9fd7-eee6d8ebaf93',
    desk: 'D-2526',
    commodity: 'Cocoa',
    traderName: 'Earl Myers',
    traderEmail: 'unse@kolsajih.uk',
    quantity: 78785,
  },
  {
    id: '48134d03-ee4c-53d9-b829-b39aa04343a0',
    desk: 'D-3248',
    commodity: 'Soybean Meal',
    traderName: 'Eleanor Hubbard',
    traderEmail: 'kipticda@fe.sk',
    quantity: 38501,
  },
  {
    id: 'a5e0ea6f-9c5d-5c1d-8677-0b9b4fb3f0a9',
    desk: 'D-387',
    commodity: 'Rapeseed',
    traderName: 'Ethel Diaz',
    traderEmail: 'mu@rezodfo.mv',
    quantity: 19641,
  },
  {
    id: '10ee61da-63f0-543f-9844-faeacc6f0135',
    desk: 'D-5067',
    commodity: 'Soybeans',
    traderName: 'Russell Dixon',
    traderEmail: 'cuedaf@arova.gp',
    quantity: 36996,
  },
  {
    id: '77bd84d0-9fd1-53a9-8337-e79b44433f85',
    desk: 'D-3597',
    commodity: 'Soybeans',
    traderName: 'Jackson Sanchez',
    traderEmail: 'duiwme@fupahah.fr',
    quantity: 96417,
  },
  {
    id: 'da108467-2286-5b9f-9591-f4a6508df7cb',
    desk: 'D-7758',
    commodity: 'Sugar No.11',
    traderName: 'Brian Chandler',
    traderEmail: 'tu@eto.cw',
    quantity: 73805,
  },
  {
    id: 'aff74566-50a7-54b8-9fd7-81330bc10c6e',
    desk: 'D-6857',
    commodity: 'Frozen Concentrated Orange Juice',
    traderName: 'Jonathan Lyons',
    traderEmail: 'mummais@poirigoc.sd',
    quantity: 87507,
  },
  {
    id: '57c0ba9a-c959-5fef-9b55-8d1f14bd1ab9',
    desk: 'D-1580',
    commodity: 'Rough Rice',
    traderName: 'William Carter',
    traderEmail: 'kugacgup@iwnepgun.ua',
    quantity: 95605,
  },
  {
    id: 'f7fabd85-230e-5a59-bca3-79363b7aea55',
    desk: 'D-62',
    commodity: 'Sugar No.11',
    traderName: 'Clayton Santos',
    traderEmail: 'epi@zen.mm',
    quantity: 72953,
  },
  {
    id: '271305a8-e127-555c-89c1-ba66514cbefe',
    desk: 'D-5089',
    commodity: 'Oats',
    traderName: 'Luke Parker',
    traderEmail: 'jeca@zeuz.be',
    quantity: 71696,
  },
  {
    id: '6df6f68c-152a-5c10-b3ea-6a053befb7f7',
    desk: 'D-5285',
    commodity: 'Cocoa',
    traderName: 'Alberta Greene',
    traderEmail: 'tudik@sivni.ch',
    quantity: 41917,
  },
  {
    id: 'eaf40294-b985-58ee-901d-4b454a86b010',
    desk: 'D-9333',
    commodity: 'Soybeans',
    traderName: 'Nancy Bush',
    traderEmail: 'witac@defjawva.ec',
    quantity: 68330,
  },
  {
    id: 'd152e01c-fac0-5666-8fe4-e409e370f41b',
    desk: 'D-5129',
    commodity: 'Soybean Meal',
    traderName: 'Earl Burns',
    traderEmail: 'bevloha@curokvas.gh',
    quantity: 47471,
  },
  {
    id: 'e0e2b8ac-0091-5c5b-89eb-cd30cc538b93',
    desk: 'D-1635',
    commodity: 'Sugar No.14',
    traderName: 'Landon Steele',
    traderEmail: 'vonvuz@rufer.kr',
    quantity: 26542,
  },
];

const useSessionStorageData = () => {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 0,
    maxColumns: 6,
    editable: true,
  });

  const [rows] = React.useState(() => {
    try {
      const lsData = sessionStorage.getItem('clipboardImportRows');
      if (lsData) {
        const parsedData = JSON.parse(lsData);
        if (Array.isArray(parsedData)) {
          return parsedData;
        }
      }
    } catch (error) {
      // session storage is not available
    }
    return initialRows;
  });

  const rowsRef = React.useRef([...rows]);

  const updateRow = React.useCallback((newRow: GridValidRowModel) => {
    const index = rowsRef.current.findIndex((row) => row.id === newRow.id);
    rowsRef.current[index] = newRow;
    sessionStorage.setItem('clipboardImportRows', JSON.stringify(rowsRef.current));
  }, []);

  return {
    data: { columns: data.columns, rows },
    updateRow,
  };
};

export default function ClipboardImport() {
  const [rowSelection, setRowSelection] = React.useState(false);
  const { data, updateRow } = useSessionStorageData();
  const [loading, setLoading] = React.useState(false);

  const apiRef = useGridApiRef();

  React.useEffect(() => {
    return apiRef.current.subscribeEvent('clipboardPasteStart', () => {
      setLoading(true);
    });
  }, [apiRef]);

  React.useEffect(() => {
    return apiRef.current.subscribeEvent('clipboardPasteEnd', () => {
      setLoading(false);
    });
  }, [apiRef]);

  return (
    <div style={{ width: '100%' }}>
      <Button sx={{ mb: 2 }} onClick={() => setRowSelection(!rowSelection)}>
        Toggle row selection
      </Button>
      <div style={{ height: 400 }}>
        <DataGridPremium
          apiRef={apiRef}
          loading={loading}
          rowSelection={rowSelection}
          checkboxSelection={rowSelection}
          unstable_cellSelection
          {...data}
          // getRowId={(row) => row.rowId}
          processRowUpdate={(newRow) => {
            updateRow(newRow);
            return newRow;
          }}
          unstable_enableClipboardPaste
        />
      </div>
    </div>
  );
}
