import { selectedGridRowsSelector, selectedGridRowsCountSelector, useGridApiRef } from '@mui/x-data-grid';
import {
  selectedGridRowsSelector as selectedGridRowsSelectorPro,
  selectedGridRowsCountSelector as selectedGridRowsCountSelectorPro,
} from '@mui/x-data-grid-pro';
import {
  selectedGridRowsSelector as selectedGridRowsSelectorPremium,
  selectedGridRowsCountSelector as selectedGridRowsCountSelectorPremium,
} from '@mui/x-data-grid-premium';

const apiRef = useGridApiRef();
const selectedRowIdsCommunity = selectedGridRowsSelector(apiRef);
const selectedRowIdsPro = selectedGridRowsSelectorPro(apiRef);
const selectedRowIdsPremium = selectedGridRowsSelectorPremium(apiRef);
const selectedRowCountCommunity = selectedGridRowsCountSelector(apiRef);
const selectedRowCountPro = selectedGridRowsCountSelectorPro(apiRef);
const selectedRowCountPremium = selectedGridRowsCountSelectorPremium(apiRef);
