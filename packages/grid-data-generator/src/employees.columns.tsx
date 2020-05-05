import './style/real-data-stories.css';
import {GeneratableColDef, randomArrayItem, randomColor, randomInt} from './services/';
import faker from 'faker';
import React from 'react';
import { Country, EmailRenderer, Link } from './renderer';
import { Avatar } from '@material-ui/core';
import { COUNTRY_ISO_OPTIONS } from './services/static-data';
import { Rating } from '@material-ui/lab';

export const employeeColumns: GeneratableColDef[] = [
  {
    field: 'id',
    generateData: () => faker.random.uuid(),
    hide: true,
  },
  {
    field: 'avatar',
    headerName: '',
    sortable: false,
    generateData: () => ({name:faker.name.findName(), color: randomColor()}),
    // eslint-disable-next-line react/display-name
    cellRenderer: params => <Avatar style={{backgroundColor: (params.value! as any).color }}>{(params.value! as any).name!.toString().substring(0,1)}</Avatar>,
  },
  {
    field: 'name',
    headerName: 'Name',
    generateData: (data) => data.avatar.name,
    // valueGetter: (params=> params.data['avatar']),
    sortDirection: 'asc',
    sortIndex: 1,
    width: 120,
  },
  {
    field: 'email',
    headerName: 'Email',
    generateData: () => faker.internet.email(),
    // eslint-disable-next-line react/display-name
    cellRenderer: params => <EmailRenderer email={params.value!.toString()} label={params.value!.toString()} />,
    disableClickEventBubbling: true,
    width: 150,
  },
  {
    field: 'phone',
    headerName: 'phone',
    generateData: () => faker.phone.phoneNumber(),
    width: 150,
  },
  {
    field: 'username',
    headerName: 'Username',
    generateData: () => faker.internet.userName(),
    width: 150,
  },
  {
    field: 'website',
    headerName: 'website',
    generateData: () => faker.internet.url(),
    // eslint-disable-next-line react/display-name
    cellRenderer: params => <Link href={params.value!.toString()}>{params.value!.toString()}</Link>,
    width: 160,
  },
  {
    field: 'rating',
    headerName: 'Rating',
    generateData: () => randomInt(0, 5),
    // eslint-disable-next-line react/display-name
    cellRenderer: params => <Rating name={params.data['id'].toString()} value={Number(params.value)} />,
    sortDirection: 'desc',
    sortIndex: 0,
    width: 180,
  },
  {
    field: 'city',
    headerName: 'City',
    generateData: () => faker.address.city(),
    width: 100,
  },
  {
    field: 'country',
    headerName: 'Country',
    generateData: () => randomArrayItem(COUNTRY_ISO_OPTIONS),
    // eslint-disable-next-line react/display-name
    cellRenderer: params => <Country value={params.value! as any} />,
    width: 150,
  },
  {
    field: 'company',
    headerName: 'Company',
    generateData: () => faker.company.companyName(),
    width: 180,
  },
  {
    field: 'position',
    headerName: 'Position',
    generateData: () => faker.name.jobTitle(),
    width: 180,
  },
  {
    field: 'lastUpdated',
    headerName: 'Updated on',
    generateData: () => faker.date.recent(),
    type: 'dateTime',
    width: 180,
  },
  {
    field: 'dateCreated',
    headerName: 'Created on',
    generateData: () => faker.date.past(),
    type: 'date',
    width: 150,
  },
];
