import * as React from 'react';
import {
  DataGridPremium,
  GridAiAssistantPanel,
  GridPreferencePanelsValue,
  unstable_gridDefaultPromptResolver as promptResolver,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import {
  randomBoolean,
  randomCompanyName,
  randomCountry,
  randomCreatedDate,
  randomEmail,
  randomInt,
  randomJobTitle,
  randomPhoneNumber,
  randomTraderName,
  useDemoData,
} from '@mui/x-data-grid-generator';

function createExamples(column) {
  switch (column) {
    case 'name':
      return Array.from({ length: 5 }, () => randomTraderName());
    case 'email':
      return Array.from({ length: 5 }, () => randomEmail());
    case 'position':
      return Array.from({ length: 5 }, () => randomJobTitle());
    case 'company':
      return Array.from({ length: 5 }, () => randomCompanyName());
    case 'salary':
      return Array.from({ length: 5 }, () => randomInt(30000, 80000));
    case 'phone':
      return Array.from({ length: 5 }, () => randomPhoneNumber());
    case 'country':
      return Array.from({ length: 5 }, () => randomCountry());
    case 'dateCreated':
      return Array.from({ length: 5 }, () => randomCreatedDate());
    case 'isAdmin':
      return Array.from({ length: 5 }, () => randomBoolean());
    default:
      return [];
  }
}

function processPrompt(prompt, context, conversationId) {
  return promptResolver(
    'https://backend.mui.com/api/datagrid/prompt',
    prompt,
    context,
    conversationId,
  );
}

const VISIBLE_FIELDS = [
  'id',
  'avatar',
  'name',
  'website',
  'rating',
  'email',
  'phone',
  'username',
  'position',
  'company',
  'salary',
  'country',
  'city',
  'lastUpdated',
  'dateCreated',
  'isAdmin',
];

export default function AssistantWithExamples() {
  const apiRef = useGridApiRef();
  const demoRef = React.useRef(null);
  const shouldClosePanelRef = React.useRef(true);
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 1000,
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((column) => ({
        ...column,
        examples: createExamples(column.field),
      })),
    [data.columns],
  );

  // Keep the initially open panel visible when interacting with the surrounding docs page.
  React.useEffect(() => {
    const handlePointerUp = (event) => {
      const target = event.target;
      const demoElement = demoRef.current;
      let targetElement = null;

      if (target instanceof Element) {
        targetElement = target;
      } else if (target instanceof Node) {
        targetElement = target.parentElement;
      }

      shouldClosePanelRef.current =
        target instanceof Node &&
        demoElement !== null &&
        demoElement.contains(target) &&
        !targetElement?.closest('[role="toolbar"]');
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        shouldClosePanelRef.current = true;
      }
    };

    document.addEventListener('pointerup', handlePointerUp, true);
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('pointerup', handlePointerUp, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  const handlePanelClose = React.useCallback(() => {
    if (shouldClosePanelRef.current) {
      apiRef.current.hidePreferences();
    }
    shouldClosePanelRef.current = true;
  }, [apiRef]);

  return (
    <div ref={demoRef} style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        apiRef={apiRef}
        {...data}
        columns={columns}
        initialState={{
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.aiAssistant,
          },
        }}
        aiAssistantSuggestions={[
          { value: 'Sort by name' },
          { value: 'Show people from the EU' },
          { value: 'Sort by company name and employee name' },
          { value: 'Order companies by amount of people' },
        ]}
        aiAssistant
        onPrompt={processPrompt}
        showToolbar
        sx={{
          '& [aria-label="AI Assistant"] .MuiSvgIcon-root': {
            color: 'primary.main',
          },
        }}
        slots={{
          aiAssistantPanel: GridAiAssistantPanel,
        }}
        slotProps={{
          panel: {
            onClose: handlePanelClose,
          },
          baseTextField: {
            material: {
              autoFocus: false,
            },
          },
        }}
      />
    </div>
  );
}
