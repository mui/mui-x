import faker from 'faker';
import {
  COLORS,
  COMMODITY_OPTIONS,
  CONTRACT_TYPE_OPTIONS,
  COUNTRY_ISO_OPTIONS,
  CURRENCY_OPTIONS,
  INCOTERM_OPTIONS,
  RATE_TYPE_OPTIONS,
  STATUS_OPTIONS,
  TAXCODE_OPTIONS,
} from './static-data';

export const random = (min: number, max: number): number => Math.random() * (max - min) + min;
export const randomInt = (min: number, max: number): number => Number(random(min, max).toFixed());
export const randomPrice = (min = 0, max = 100000): number => random(min, max);
export const randomRate = (): number => random(0, 1);
export const randomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
export const getDate = () => randomDate(new Date(2012, 0, 1), new Date());
export const randomArrayItem = (arr: any[]) => arr[random(0, arr.length - 1).toFixed()];

export const randomColor = () => randomArrayItem(COLORS);
export const randomId = () => faker.random.uuid();
export const randomDesk = () => `D-${faker.random.number()}`;
export const randomCommodity = () => randomArrayItem(COMMODITY_OPTIONS);
export const randomTraderId = () => faker.random.number();
export const randomTraderName = () => faker.name.findName();
export const randomUserName = () => faker.internet.userName();
export const randomEmail = () => faker.internet.email();
export const randomUrl = () => faker.internet.url();
export const randomPhoneNumber = () => faker.phone.phoneNumber();
export const randomUnitPrice = () => randomPrice(1, 100);
export const randomUnitPriceCurrency = () => randomArrayItem(CURRENCY_OPTIONS);
export const randomQuantity = () => randomInt(1000, 100000);
export const randomFeeRate = () => random(0.1, 0.4);
export const randomIncoterm = () => randomArrayItem(INCOTERM_OPTIONS);
export const randomStatusOptions = () => randomArrayItem(STATUS_OPTIONS);
export const randomPnL = () => random(-100000000, 100000000);
export const randomMaturityDate = () => faker.date.future();
export const randomTradeDate = () => faker.date.recent();
export const randomBrokerId = () => faker.random.uuid();
export const randomCompanyName = () => faker.company.companyName();
export const randomCountry = () => randomArrayItem(COUNTRY_ISO_OPTIONS);
export const randomCurrency = () => randomArrayItem(CURRENCY_OPTIONS);
export const randomAddress = () => faker.address.streetAddress();
export const randomCity = () => faker.address.city();
export const randomTaxCode = () => randomArrayItem(TAXCODE_OPTIONS);
export const randomContractType = () => randomArrayItem(CONTRACT_TYPE_OPTIONS);
export const randomRateType = () => randomArrayItem(RATE_TYPE_OPTIONS);
export const randomCreatedDate = () => faker.date.past();
export const randomUpdatedDate = () => faker.date.recent();
export const randomAvatar = () => ({ name: faker.name.findName(), color: randomColor() });
export const randomJobTitle = () => faker.name.jobTitle();
export const randomRating = () => random(0, 5);

export const generateName = (data) => data.avatar.name;
export const generateFilledQuantity = (data) =>
  Number((data.quantity * randomRate()).toFixed()) / data.quantity;
export const generateIsFilled = (data) => data.quantity === data.filledQuantity;
export const generateSubTotal = (data) => data.unitPrice * data.quantity;
export const generateFeeAmount = (data) => Number(data.feeRate) * data.subTotal;
export const generateTotalPrice = (data) => data.feeRate + data.subTotal;
