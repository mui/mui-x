import { gridRowSelectionIdsSelector, gridRowSelectionCountSelector, useGridApiRef } from '@mui/x-data-grid';
import {
  gridRowSelectionIdsSelector as selectedGridRowsSelectorPro,
  gridRowSelectionCountSelector as selectedGridRowsCountSelectorPro,
} from '@mui/x-data-grid-pro';
import {
  gridRowSelectionIdsSelector as selectedGridRowsSelectorPremium,
  gridRowSelectionCountSelector as selectedGridRowsCountSelectorPremium,
} from '@mui/x-data-grid-premium';

const apiRef = useGridApiRef();
const selectedRowIdsCommunity = gridRowSelectionIdsSelector(apiRef);
const selectedRowIdsPro = selectedGridRowsSelectorPro(apiRef);
const selectedRowIdsPremium = selectedGridRowsSelectorPremium(apiRef);
const selectedRowCountCommunity = gridRowSelectionCountSelector(apiRef);
const selectedRowCountPro = selectedGridRowsCountSelectorPro(apiRef);
const selectedRowCountPremium = selectedGridRowsCountSelectorPremium(apiRef);
