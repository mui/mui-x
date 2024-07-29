import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';

const initialRows = [
  {
    id: '9feb3743-fbf1-585b-ae15-25a1e91126d1',
    desk: 'D-7702',
    commodity: 'Frozen Concentrated Orange Juice',
    traderName: 'Jeffrey Nichols',
    traderEmail: 'weg@tozezew.mz',
    quantity: 22542,
    filledQuantity: 0.6027859107443883,
  },
  {
    id: '6aa80501-f0f1-50e4-95d9-94eac5536d24',
    desk: 'D-5855',
    commodity: 'Oats',
    traderName: 'Henrietta Gill',
    traderEmail: 'ha@ovuewadip.ca',
    quantity: 39244,
    filledQuantity: 0.5139893996534503,
  },
  {
    id: 'd4d49ff6-9a37-5490-94b3-c3dea5c8f787',
    desk: 'D-8853',
    commodity: 'Cocoa',
    traderName: 'Harriet Peters',
    traderEmail: 'wezbibil@meced.pt',
    quantity: 81111,
    filledQuantity: 0.24879486136282378,
  },
  {
    id: '1db4a0e5-aca2-5ae7-89f1-aca3756c6c2c',
    desk: 'D-3882',
    commodity: 'Wheat',
    traderName: 'Polly Sims',
    traderEmail: 'ujaacazas@pobgag.ye',
    quantity: 91665,
    filledQuantity: 0.7220967653957344,
  },
  {
    id: 'cc24d3fc-0d9b-56f1-8cdd-89199092e711',
    desk: 'D-94',
    commodity: 'Sugar No.14',
    traderName: 'Jim Pratt',
    traderEmail: 'irno@re.iq',
    quantity: 98763,
    filledQuantity: 0.9177019734110953,
  },
  {
    id: '181ae856-c185-5895-a996-9ed822f31721',
    desk: 'D-8570',
    commodity: 'Frozen Concentrated Orange Juice',
    traderName: 'Erik Kelley',
    traderEmail: 'pado@dawom.ar',
    quantity: 8524,
    filledQuantity: 0.5193571093383388,
  },
  {
    id: '3a199260-246e-5bb7-a20e-04d4dfae798d',
    desk: 'D-2253',
    commodity: 'Adzuki bean',
    traderName: 'Victor Howell',
    traderEmail: 'zi@orager.cl',
    quantity: 60806,
    filledQuantity: 0.9243989080024998,
  },
  {
    id: 'ad1bdfe2-4dbd-58bb-b432-f4c50b2e8de8',
    desk: 'D-6307',
    commodity: 'Soybeans',
    traderName: 'Ethan Clark',
    traderEmail: 'wij@nepocreh.tt',
    quantity: 48391,
    filledQuantity: 0.7982062780269058,
  },
  {
    id: '6040095c-da9b-507f-8bc2-5c0511019d2c',
    desk: 'D-2429',
    commodity: 'Corn',
    traderName: 'Katie Long',
    traderEmail: 'doga@raecu.gg',
    quantity: 51252,
    filledQuantity: 0.08549910247404979,
  },
  {
    id: '1f90134c-c9b0-556f-b60b-cd7d150f124c',
    desk: 'D-4598',
    commodity: 'Soybeans',
    traderName: 'Etta Marsh',
    traderEmail: 'riztuw@rol.jo',
    quantity: 59123,
    filledQuantity: 0.619099166145155,
  },
  {
    id: 'f3fb76f5-82b4-562e-b873-bec5f9a09e07',
    desk: 'D-9116',
    commodity: 'Soybean Meal',
    traderName: 'Emma Wilkerson',
    traderEmail: 'vispuhgoh@adkimac.kr',
    quantity: 4861,
    filledQuantity: 0.756222999382843,
  },
  {
    id: '468f03c0-ee5a-51d4-807e-e65b108ed7ca',
    desk: 'D-9046',
    commodity: 'Robusta coffee',
    traderName: 'Douglas Boone',
    traderEmail: 'givuce@jisalta.jp',
    quantity: 41630,
    filledQuantity: 0.5862118664424694,
  },
  {
    id: '856c6022-f062-57fe-a618-b8a044d94995',
    desk: 'D-5940',
    commodity: 'Coffee C',
    traderName: 'Delia Collins',
    traderEmail: 'ga@pukop.kg',
    quantity: 42184,
    filledQuantity: 0.17279063151905935,
  },
  {
    id: 'e67a7da2-623e-5a37-afe7-d9d61f6c6707',
    desk: 'D-166',
    commodity: 'Oats',
    traderName: 'Carl Allison',
    traderEmail: 'biviv@loucu.jm',
    quantity: 42818,
    filledQuantity: 0.24769956560325096,
  },
  {
    id: 'fde4e74d-77f8-5325-8401-8093cea3b48d',
    desk: 'D-2177',
    commodity: 'Soybean Oil',
    traderName: 'Jeffrey Stone',
    traderEmail: 'vaj@wazvi.fr',
    quantity: 66766,
    filledQuantity: 0.3001977054189258,
  },
  {
    id: '874e66e5-435d-555c-9ccf-4a776446b1c3',
    desk: 'D-1732',
    commodity: 'Oats',
    traderName: 'Jason Holland',
    traderEmail: 'lef@nameteh.com',
    quantity: 79141,
    filledQuantity: 0.3829999620929733,
  },
  {
    id: '95379b05-69e2-56da-997c-3e5c3892af8d',
    desk: 'D-5479',
    commodity: 'Rapeseed',
    traderName: 'Alfred Cortez',
    traderEmail: 'loeg@ufooni.eu',
    quantity: 77715,
    filledQuantity: 0.35680370584829185,
  },
  {
    id: 'b71a1c39-dd89-59e4-90ed-0eba4708d2bf',
    desk: 'D-7786',
    commodity: 'Frozen Concentrated Orange Juice',
    traderName: 'Eddie Olson',
    traderEmail: 'sigjap@vas.sc',
    quantity: 78507,
    filledQuantity: 0.7016953902199804,
  },
  {
    id: '8d3305fd-40a5-5b91-a677-7c3a12f42abb',
    desk: 'D-3166',
    commodity: 'Frozen Concentrated Orange Juice',
    traderName: 'Louisa Coleman',
    traderEmail: 'nezcen@mihrotab.pa',
    quantity: 47797,
    filledQuantity: 0.16090968052388224,
  },
  {
    id: '1da5290b-1990-58a5-bcba-bd0ab6a38ce9',
    desk: 'D-6935',
    commodity: 'Soybean Oil',
    traderName: 'Franklin Barrett',
    traderEmail: 'be@fejafo.au',
    quantity: 95833,
    filledQuantity: 0.47529556624544783,
  },
];

const visibleFields = [
  'commodity',
  'traderName',
  'traderEmail',
  'quantity',
  'filledQuantity',
];

const useSessionStorageData = () => {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 0,
    maxColumns: 7,
    editable: true,
    visibleFields,
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

  const updateRow = React.useCallback((newRow) => {
    const index = rowsRef.current.findIndex((row) => row.id === newRow.id);
    rowsRef.current[index] = newRow;
    sessionStorage.setItem('clipboardImportRows', JSON.stringify(rowsRef.current));
  }, []);

  return {
    data: { ...data, rows },
    updateRow,
  };
};

export default function ClipboardPastePersistence() {
  const { data, updateRow } = useSessionStorageData();

  const processRowUpdate = (newRow) => {
    updateRow(newRow);
    return newRow;
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: 8 }}>
        <Button onClick={() => sessionStorage.removeItem('clipboardImportRows')}>
          Clear session storage
        </Button>
      </div>
      <div style={{ height: 400 }}>
        <DataGridPremium
          {...data}
          disableRowSelectionOnClick
          checkboxSelection
          cellSelection
          processRowUpdate={processRowUpdate}
          ignoreValueFormatterDuringExport
        />
      </div>
    </div>
  );
}
