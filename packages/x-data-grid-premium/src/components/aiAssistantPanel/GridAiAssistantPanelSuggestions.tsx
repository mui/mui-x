import * as React from 'react';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

type GridAiAssistantPanelSuggestionsProps = {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
};

type OwnerState = Pick<DataGridPremiumProcessedProps, 'classes'> & { isMeasuring: boolean };

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
})<{ ownerState: OwnerState }>(({ ownerState }) => ({
  display: 'flex',
  flexWrap: ownerState.isMeasuring ? 'nowrap' : 'wrap',
  gap: vars.spacing(0.75),
  overflow: 'hidden',
  padding: 0,
  margin: 0,
  opacity: ownerState.isMeasuring ? 0 : 1,
}));

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
  const apiRef = useGridApiContext();
  const listRef = React.useRef<HTMLDivElement>(null);
  const showAllButtonRef = React.useRef<HTMLDivElement>(null);
  const chipRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const [isMeasuring, setIsMeasuring] = React.useState(true);
  const [visibleSuggestions, setVisibleSuggestions] = React.useState<string[]>(suggestions);
  const [moreButtonVisible, setMoreButtonVisible] = React.useState(true);

  const ownerState = { classes: rootProps.classes, isMeasuring };
  const classes = useUtilityClasses(ownerState);

  useEnhancedEffect(() => {
    const calculateVisibleChips = () => {
      if (!listRef.current) {
        return;
      }

      const containerWidth = listRef.current.offsetWidth;
      const moreButtonWidth = showAllButtonRef.current?.offsetWidth ?? 0;
      const gapWidth = parseFloat(getComputedStyle(listRef.current).gap);
      const visibleChips: string[] = [];
      const hiddenChips: string[] = [];

      let availableWidth = containerWidth - moreButtonWidth - gapWidth;

      suggestions.forEach((suggestion, index) => {
        const chipWidth = chipRefs.current[index]?.offsetWidth ?? 0;
        const totalChipSpace = chipWidth + gapWidth;

        if (totalChipSpace <= availableWidth) {
          visibleChips.push(suggestion);
          availableWidth -= totalChipSpace;
        } else {
          hiddenChips.push(suggestion);
        }
      });

      const allChipsFit = hiddenChips.length === 0 && availableWidth >= 0;

      setVisibleSuggestions(visibleChips);
      setMoreButtonVisible(!allChipsFit);
      setIsMeasuring(false);
    };

    requestAnimationFrame(() => {
      calculateVisibleChips();
    });
  }, [suggestions]);

  const showAll = () => {
    setVisibleSuggestions(suggestions);
    setMoreButtonVisible(false);
  };

  return (
    <AiAssistantPanelSuggestionsRoot className={classes.root} ownerState={ownerState}>
      <AiAssistantPanelSuggestionsLabel className={classes.label} ownerState={ownerState}>
        {apiRef.current.getLocaleText('aiAssistantSuggestions')}
      </AiAssistantPanelSuggestionsLabel>
      <AiAssistantPanelSuggestionsList
        className={classes.list}
        ownerState={ownerState}
        ref={listRef}
      >
        {visibleSuggestions.map((suggestion, index) => (
          <rootProps.slots.baseChip
            key={suggestion}
            ref={(el) => {
              chipRefs.current[index] = el;
            }}
            label={suggestion}
            className={classes.item}
            onClick={() => onSuggestionClick(suggestion)}
          />
        ))}
        {moreButtonVisible && (
          <rootProps.slots.baseChip
            ref={showAllButtonRef}
            label={apiRef.current.getLocaleText('aiAssistantSuggestionsMore')(
              suggestions.length - visibleSuggestions.length,
            )}
            icon={<rootProps.slots.detailPanelExpandIcon fontSize="small" />}
            onClick={showAll}
          />
        )}
      </AiAssistantPanelSuggestionsList>
    </AiAssistantPanelSuggestionsRoot>
  );
}

export { GridAiAssistantPanelSuggestions };
