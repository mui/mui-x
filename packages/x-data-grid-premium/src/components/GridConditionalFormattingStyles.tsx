'use client';
import * as React from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import { useGridSelector } from '@mui/x-data-grid-pro';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { gridConditionalFormattingSelector } from '../hooks/features/conditionalFormatting/gridConditionalFormattingSelectors';
import { getConditionalFormattingStyles } from '../hooks/features/conditionalFormatting/gridConditionalFormattingUtils';

/**
 * The styles of the conditional formatting rules, kept out of the root styles
 * so a change of the rules only replaces them.
 */
export function GridConditionalFormattingStyles() {
  const apiRef = useGridPrivateApiContext();
  const model = useGridSelector(apiRef, gridConditionalFormattingSelector);
  const styles = React.useMemo(
    () => getConditionalFormattingStyles(model, apiRef.current.instanceId.id),
    [apiRef, model],
  );
  if (Object.keys(styles).length === 0) {
    return null;
  }
  return <GlobalStyles styles={styles} />;
}
