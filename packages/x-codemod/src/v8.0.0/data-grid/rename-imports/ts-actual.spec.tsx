// @ts-nocheck
import { selectedGridRowsSelector, selectedGridRowsCountSelector } from '@mui/x-data-grid-pro';
import {
  selectedGridRowsSelector as selectedGridRowsSelectorPremium,
  selectedGridRowsCountSelector as selectedGridRowsCountSelectorPremium,
} from '@mui/x-data-grid-premium';

// prettier-ignore
const apiRef = useGridApiRef();
const selectedRowIdsPro = selectedGridRowsSelector(apiRef);
const selectedRowIdsPremium = selectedGridRowsSelectorPremium(apiRef);
const selectedRowCountPro = selectedGridRowsCountSelector(apiRef);
const selectedRowCountPremium = selectedGridRowsCountSelectorPremium(apiRef);
