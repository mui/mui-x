import './style/real-data-stories.css';
import {GeneratableColDef, random, randomArrayItem, randomInt} from './services/';
import faker from 'faker';
import React from 'react';
import {Country, EmailRenderer, Link} from "./renderer";
import {Avatar} from "@material-ui/core";
import {COUNTRY_ISO_OPTIONS, COUNTRY_OPTIONS} from "./services/static-data";
import {Rating} from "@material-ui/lab";

console.log('---------****----uUUUUUSER->', faker.helpers.userCard());
console.log('---------****----avatar->', faker.image.avatar());
/*
address:
city: "Douglasstad"
geo: {lat: "48.1940", lng: "-72.8628"}
street: "Kiana Crest"
suite: "Apt. 793"
zipcode: "87863"
__proto__: Object
company:
bs: "virtual unleash schemas"
catchPhrase: "Adaptive discrete complexity"
name: "Dibbert - Will"
__proto__: Object
email: "Ollie_Gutkowski83@gmail.com"
name: "Addie Breitenberg"
phone: "409-038-4522 x7231"
username: "Laurianne30"
website: "rachel.org"


* */
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
    generateData: () => faker.image.avatar(),
    // eslint-disable-next-line react/display-name
    cellRenderer: params => <Avatar src={params.value!.toString()} />
  },
  {
    field: 'name',
    headerName: 'Name',
    generateData: () => faker.name.findName(),
    sortDirection:'asc',
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
    width: 200,
  },
  {
    field: 'rating',
    headerName: 'Rating',
    generateData: () => randomInt(0, 5),
    // eslint-disable-next-line react/display-name
    cellRenderer: params => <Rating value={Number(params.value)} />,
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
    sortDirection: 'desc',
    sortIndex: 0,
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
