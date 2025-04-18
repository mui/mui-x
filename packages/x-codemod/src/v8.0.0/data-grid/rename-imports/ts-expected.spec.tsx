// @ts-nocheck
import { gridRowSelectionIdsSelector, gridRowSelectionCountSelector } from '@mui/x-data-grid-pro';
import {
  gridRowSelectionIdsSelector as selectedGridRowsSelectorPremium,
  gridRowSelectionCountSelector as selectedGridRowsCountSelectorPremium,
} from '@mui/x-data-grid-premium';

// prettier-ignore
const apiRef = useGridApiRef();
const selectedRowIdsPro = gridRowSelectionIdsSelector(apiRef);
const selectedRowIdsPremium = selectedGridRowsSelectorPremium(apiRef);
const selectedRowCountPro = gridRowSelectionCountSelector(apiRef);
const selectedRowCountPremium = selectedGridRowsCountSelectorPremium(apiRef);
