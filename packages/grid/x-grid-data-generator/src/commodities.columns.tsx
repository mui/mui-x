// import './style/real-data-stories.css';
import {
  generateTotalPrice,
  randomCommodity,
  randomDesk,
  randomEmail,
  generateFeeAmount,
  randomFeeRate,
  generateFilledQuantity,
  randomId,
  randomIncoterm,
  generateIsFilled,
  randomQuantity,
  generateSubTotal,
  randomTraderName,
  randomUnitPrice,
  randomUnitPriceCurrency,
  randomStatusOptions,
  randomPnL,
  randomTradeDate,
  randomMaturityDate,
  randomBrokerId,
  randomCompanyName,
  randomCountry,
  randomCurrency,
  randomAddress,
  randomCity,
  randomUpdatedDate,
  randomCreatedDate,
  randomRateType,
  randomContractType,
  randomTaxCode,
} from './services';
import {
  CountryRenderer,
  DoneRenderer,
  EmailRenderer,
  IncotermRenderer,
  ProgressRenderer,
  StatusRenderer,
} from './renderer';

const totalPriceFormatter = ({ value }) => `$ ${Number(value).toLocaleString()}`;
const pnlFormatter = (params) =>
  Number(params.value!) < 0
    ? `(${Math.abs(Number(params.value!)).toLocaleString()})`
    : Number(params.value).toLocaleString();

export const commodityColumns: any[] = [
  {
    field: 'id',
    generateData: randomId,
    hide: true,
  },
  {
    field: 'desk',
    headerName: 'Desk',
    generateData: randomDesk,
  },
  {
    field: 'commodity',
    headerName: 'Commodity',
    generateData: randomCommodity,
    width: 120,
  },
  {
    field: 'traderName',
    headerName: 'Trader Name',
    generateData: randomTraderName,
    width: 120,
  },
  {
    field: 'traderEmail',
    headerName: 'Trader Email',
    generateData: randomEmail,
    renderCell: EmailRenderer,
    disableClickEventBubbling: true,
    width: 150,
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    type: 'number',
    width: 110,
    generateData: randomQuantity,
  },
  {
    field: 'filledQuantity',
    headerName: 'Filled Quantity',
    generateData: generateFilledQuantity,
    renderCell: ProgressRenderer,
    type: 'number',
    width: 120,
  },
  {
    field: 'isFilled',
    headerName: 'Is Filled',
    renderCell: DoneRenderer,
    align: 'center',
    generateData: generateIsFilled,
    width: 80,
  },
  {
    field: 'status',
    headerName: 'Status',
    generateData: randomStatusOptions,
    renderCell: StatusRenderer,
    width: 150,
  },
  {
    field: 'unitPrice',
    headerName: 'Unit Price',
    generateData: randomUnitPrice,
    type: 'number',
  },
  {
    field: 'unitPriceCurrency',
    headerName: 'Unit Price Currency',
    generateData: randomUnitPriceCurrency,
    width: 70,
  },
  {
    field: 'subTotal',
    headerName: 'Sub Total',
    generateData: generateSubTotal,
    type: 'number',
    width: 120,
  },
  {
    field: 'feeRate',
    headerName: 'Fee Rate',
    generateData: randomFeeRate,
    type: 'number',
    width: 80,
  },
  {
    field: 'feeAmount',
    headerName: 'Fee Amount',
    generateData: generateFeeAmount,
    type: 'number',
    width: 120,
  },
  {
    field: 'incoTerm',
    generateData: randomIncoterm,
    renderCell: IncotermRenderer,
  },
  {
    field: 'totalPrice',
    headerName: 'Total in USD',
    generateData: generateTotalPrice,
    valueFormatter: totalPriceFormatter,
    cellClassRules: {
      good: ({ value }) => Number(value) > 1000000,
      bad: ({ value }) => Number(value) < 1000000,
    },
    type: 'number',
    width: 120,
  },
  {
    field: 'pnl',
    headerName: 'PnL',
    generateData: randomPnL,
    valueFormatter: pnlFormatter,
    cellClassRules: {
      positive: ({ value }) => Number(value) > 0,
      negative: ({ value }) => Number(value) < 0,
    },
    type: 'number',
    width: 120,
  },
  {
    field: 'maturityDate',
    headerName: 'Maturity Date',
    generateData: randomMaturityDate,
    type: 'date',
  },
  {
    field: 'tradeDate',
    headerName: 'Trade Date',
    generateData: randomTradeDate,
    type: 'date',
  },
  {
    field: 'brokerId',
    headerName: 'Broker Id',
    generateData: randomBrokerId,
    hide: true,
  },
  {
    field: 'brokerName',
    headerName: 'Broker Name',
    generateData: randomCompanyName,
    width: 140,
  },
  {
    field: 'counterPartyName',
    headerName: 'Counterparty',
    generateData: randomCompanyName,
    width: 180,
  },
  {
    field: 'counterPartyCountry',
    headerName: 'Counterparty Country',
    generateData: randomCountry,
    renderCell: CountryRenderer,
    width: 120,
  },
  {
    field: 'counterPartyCurrency',
    headerName: 'Counterparty Currency',
    generateData: randomCurrency,
  },
  {
    field: 'counterPartyAddress',
    headerName: 'Counterparty Address',
    generateData: randomAddress,
    width: 200,
  },
  {
    field: 'counterPartyCity',
    headerName: 'Counterparty City',
    generateData: randomCity,
    width: 120,
  },
  {
    field: 'taxCode',
    headerName: 'Tax Code',
    generateData: randomTaxCode,
  },
  {
    field: 'contractType',
    headerName: 'Contract Type',
    generateData: randomContractType,
  },
  {
    field: 'rateType',
    headerName: 'Rate Type',
    generateData: randomRateType,
  },
  {
    field: 'lastUpdated',
    headerName: 'Updated on',
    generateData: randomUpdatedDate,
    type: 'dateTime',
    width: 180,
  },
  {
    field: 'dateCreated',
    headerName: 'Created on',
    generateData: randomCreatedDate,
    type: 'date',
    width: 150,
  },
];
