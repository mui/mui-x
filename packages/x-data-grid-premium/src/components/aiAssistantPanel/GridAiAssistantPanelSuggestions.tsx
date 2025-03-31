import * as React from 'react';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

type GridAiAssistantPanelSuggestionsProps = {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
};

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['aiAssistantPanelSuggestions'],
    list: ['aiAssistantPanelSuggestionsList'],
    item: ['aiAssistantPanelSuggestionsItem'],
    label: ['aiAssistantPanelSuggestionsLabel'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const AiAssistantPanelSuggestionsRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelSuggestions',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.spacing(0.75),
});

const AiAssistantPanelSuggestionsList = styled('div', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelSuggestionsList',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.spacing(0.75),
  padding: 0,
  margin: 0,
});

const AiAssistantPanelSuggestionsLabel = styled('div', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelSuggestionsLabel',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing(1),
  font: vars.typography.font.body,
  color: vars.colors.foreground.muted,
  paddingLeft: vars.spacing(0.5),
});

function GridAiAssistantPanelSuggestions(props: GridAiAssistantPanelSuggestionsProps) {
  const { suggestions, onSuggestionClick } = props;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const apiRef = useGridApiContext();

  return (
    <AiAssistantPanelSuggestionsRoot className={classes.root} ownerState={rootProps}>
      <AiAssistantPanelSuggestionsLabel className={classes.label} ownerState={rootProps}>
        <rootProps.slots.promptIcon fontSize="1rem" />
        {apiRef.current.getLocaleText('aiAssistantSuggestions')}
      </AiAssistantPanelSuggestionsLabel>
      <AiAssistantPanelSuggestionsList className={classes.list} ownerState={rootProps}>
        {suggestions.map((suggestion) => (
          <rootProps.slots.baseChip
            key={suggestion}
            label={suggestion}
            className={classes.item}
            onClick={() => onSuggestionClick(suggestion)}
          />
        ))}
      </AiAssistantPanelSuggestionsList>
    </AiAssistantPanelSuggestionsRoot>
  );
}

export { GridAiAssistantPanelSuggestions };
