import * as React from 'react';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { PromptSuggestion } from '../../hooks/features/aiAssistant/gridAiAssistantInterfaces';

type GridAiAssistantPanelSuggestionsProps = {
  suggestions: PromptSuggestion[];
};

type OwnerState = Pick<DataGridPremiumProcessedProps, 'classes'>;

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
  gap: vars.spacing(0.75),
  overflow: 'auto',
  padding: vars.spacing(1),
  margin: vars.spacing(-1),
  scrollbarWidth: 'thin',
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
  const { suggestions } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  return (
    <AiAssistantPanelSuggestionsRoot className={classes.root} ownerState={ownerState}>
      <AiAssistantPanelSuggestionsLabel className={classes.label} ownerState={ownerState}>
        {apiRef.current.getLocaleText('aiAssistantSuggestions')}
      </AiAssistantPanelSuggestionsLabel>
      <AiAssistantPanelSuggestionsList className={classes.list} ownerState={ownerState}>
        {suggestions.map((suggestion) => (
          <rootProps.slots.baseChip
            key={suggestion.value}
            label={suggestion.value}
            className={classes.item}
            onClick={() => apiRef.current.aiAssistant.processPrompt(suggestion.value)}
            variant="outlined"
          />
        ))}
      </AiAssistantPanelSuggestionsList>
    </AiAssistantPanelSuggestionsRoot>
  );
}

export { GridAiAssistantPanelSuggestions };
