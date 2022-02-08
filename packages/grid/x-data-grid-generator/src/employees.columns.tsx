import { gridStringOrNumberComparator } from '@mui/x-data-grid';
import {
  randomCity,
  randomCompanyName,
  randomCountry,
  randomCreatedDate,
  randomEmail,
  randomId,
  randomJobTitle,
  randomPhoneNumber,
  randomRating,
  randomUpdatedDate,
  randomUrl,
  randomUserName,
  randomBoolean,
  randomName,
  randomColor,
  randomInt,
} from './services';
import {
  renderAvatar,
  renderCountry,
  renderEmail,
  renderLink,
  renderRating,
  renderEditRating,
  renderEditCountry,
} from './renderer';
import { COUNTRY_ISO_OPTIONS_SORTED } from './services/static-data';
import { GridColDefGenerator } from './services/gridColDefGenerator';

export const getEmployeeColumns = (): GridColDefGenerator[] => [
  {
    field: 'id',
    generateData: randomId,
    hide: true,
  },
  {
    field: 'avatar',
    headerName: 'Avatar',
    sortable: false,
    generateData: randomColor,
    renderCell: renderAvatar,
    filterable: false,
  },
  {
    field: 'name',
    headerName: 'Name',
    generateData: randomName,
    dataGeneratorUniquenessEnabled: true,
    width: 120,
    editable: true,
  },
  {
    field: 'website',
    headerName: 'Website',
    generateData: randomUrl,
    renderCell: renderLink,
    width: 160,
    editable: true,
  },
  {
    field: 'rating',
    headerName: 'Rating',
    generateData: randomRating,
    renderCell: renderRating,
    renderEditCell: renderEditRating,
    width: 180,
    type: 'number',
    editable: true,
  },
  {
    field: 'email',
    headerName: 'Email',
    generateData: randomEmail,
    renderCell: renderEmail,
    width: 150,
    editable: true,
  },
  {
    field: 'phone',
    headerName: 'Phone',
    generateData: randomPhoneNumber,
    width: 150,
    editable: true,
  },
  {
    field: 'username',
    headerName: 'Username',
    generateData: randomUserName,
    width: 150,
    editable: true,
  },
  {
    field: 'city',
    headerName: 'City',
    generateData: randomCity,
    editable: true,
  },
  {
    field: 'country',
    headerName: 'Country',
    generateData: randomCountry,
    renderCell: renderCountry,
    renderEditCell: renderEditCountry,
    type: 'singleSelect',
    valueOptions: COUNTRY_ISO_OPTIONS_SORTED,
    valueExportFormatter: ({ value }) => (value as typeof COUNTRY_ISO_OPTIONS_SORTED[number]).label,
    sortComparator: (v1, v2, param1, param2) =>
      gridStringOrNumberComparator(
        (v1 as typeof COUNTRY_ISO_OPTIONS_SORTED[number]).label,
        (v2 as typeof COUNTRY_ISO_OPTIONS_SORTED[number]).label,
        param1,
        param2,
      ),
    width: 150,
    editable: true,
  },
  {
    field: 'company',
    headerName: 'Company',
    generateData: randomCompanyName,
    width: 180,
    editable: true,
  },
  {
    field: 'position',
    headerName: 'Position',
    generateData: randomJobTitle,
    width: 180,
    editable: true,
  },
  {
    field: 'lastUpdated',
    headerName: 'Updated on',
    generateData: randomUpdatedDate,
    type: 'dateTime',
    width: 180,
    editable: true,
  },
  {
    field: 'dateCreated',
    headerName: 'Created on',
    generateData: randomCreatedDate,
    type: 'date',
    width: 120,
    editable: true,
  },
  {
    field: 'isAdmin',
    headerName: 'Is admin?',
    generateData: randomBoolean,
    type: 'boolean',
    width: 150,
    editable: true,
  },
  {
    field: 'salary',
    headerName: 'Salary',
    generateData: () => randomInt(30000, 80000),
  },
];
