import { GridGetRowsParamsPremium } from './models';

export function getKeyPremium(params: GridGetRowsParamsPremium) {
  return JSON.stringify([
    params.filterModel,
    params.sortModel,
    params.groupKeys,
    params.groupFields,
    params.start,
    params.end,
    params.aggregationModel,
  ]);
}
