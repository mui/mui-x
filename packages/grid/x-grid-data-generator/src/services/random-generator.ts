import globalChance from 'chance';
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

const chanceId = globalChance();
let chance;

if (process.env.DISABLE_CHANCE_RANDOM) {
  chance = globalChance(() => 0.5);
} else {
  chance = chanceId;
}

function dateFuture(years?: number, refDate?: string) {
  let date = new Date();
  if (typeof refDate !== 'undefined') {
    date = new Date(Date.parse(refDate));
  }

  const range = {
    min: 1000,
    max: (years || 1) * 365 * 24 * 3600 * 1000,
  };

  // some time from now to N years later, in milliseconds
  const past = date.getTime() + chance.integer(range);
  date.setTime(past);

  return date;
}

function dateRecent(days?: number, refDate?: string) {
  let date = new Date();
  if (typeof refDate !== 'undefined') {
    date = new Date(Date.parse(refDate));
  }

  const range = {
    min: 1000,
    max: (days || 1) * 24 * 3600 * 1000,
  };

  // some time from now to N days ago, in milliseconds
  const past = date.getTime() - chance.integer(range);
  date.setTime(past);

  return date;
}

function datePast(years?: number, refDate?: string) {
  let date = new Date();
  if (typeof refDate !== 'undefined') {
    date = new Date(Date.parse(refDate));
  }

  const range = {
    min: 1000,
    max: (years || 1) * 365 * 24 * 3600 * 1000,
  };

  // some time from now to N years ago, in milliseconds
  const past = date.getTime() - chance.integer(range);
  date.setTime(past);

  return date;
}

export const random = (min: number, max: number): number => chance.random() * (max - min) + min;
export const randomInt = (min: number, max: number): number => Number(random(min, max).toFixed());
export const randomPrice = (min = 0, max = 100000): number => random(min, max);
export const randomRate = (): number => random(0, 1);
export const randomDate = (start, end) =>
  new Date(start.getTime() + chance.random() * (end.getTime() - start.getTime()));
export const getDate = () => randomDate(new Date(2012, 0, 1), new Date());
export const randomArrayItem = (arr: any[]) => arr[random(0, arr.length - 1).toFixed()];

export const randomColor = () => randomArrayItem(COLORS);
export const randomId = () => chanceId.guid();
export const randomDesk = () => `D-${chance.integer({ min: 0, max: 10000 })}`;
export const randomCommodity = () => randomArrayItem(COMMODITY_OPTIONS);
export const randomTraderName = () => chance.name();
export const randomUserName = () => chance.twitter();
export const randomEmail = () => chance.email();
export const randomUrl = () => chance.url();
export const randomPhoneNumber = () => chance.phone();
export const randomUnitPrice = () => randomPrice(1, 100);
export const randomUnitPriceCurrency = () => randomArrayItem(CURRENCY_OPTIONS);
export const randomQuantity = () => randomInt(1000, 100000);
export const randomFeeRate = () => random(0.1, 0.4);
export const randomIncoterm = () => randomArrayItem(INCOTERM_OPTIONS);
export const randomStatusOptions = () => randomArrayItem(STATUS_OPTIONS);
export const randomPnL = () => random(-100000000, 100000000);
export const randomMaturityDate = () => dateFuture();
export const randomTradeDate = () => dateRecent();
export const randomBrokerId = () => chance.guid();
export const randomCompanyName = () => chance.company();
export const randomCountry = () => randomArrayItem(COUNTRY_ISO_OPTIONS);
export const randomCurrency = () => randomArrayItem(CURRENCY_OPTIONS);
export const randomAddress = () => chance.address();
export const randomCity = () => chance.city();
export const randomTaxCode = () => randomArrayItem(TAXCODE_OPTIONS);
export const randomContractType = () => randomArrayItem(CONTRACT_TYPE_OPTIONS);
export const randomRateType = () => randomArrayItem(RATE_TYPE_OPTIONS);
export const randomCreatedDate = () => datePast();
export const randomUpdatedDate = () => dateRecent();
export const randomAvatar = () => ({ name: chance.name(), color: randomColor() });
export const randomJobTitle = () => chance.profession();
export const randomRating = () => Math.round(random(0, 5) * 10) / 10;

export const generateName = (data) => data.avatar.name;
export const generateFilledQuantity = (data) =>
  Number((data.quantity * randomRate()).toFixed()) / data.quantity;
export const generateIsFilled = (data) => data.quantity === data.filledQuantity;
export const generateSubTotal = (data) => data.unitPrice * data.quantity;
export const generateFeeAmount = (data) => Number(data.feeRate) * data.subTotal;
export const generateTotalPrice = (data) => data.feeRate + data.subTotal;
