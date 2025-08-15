import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import InventoryDashboard from 'docsx/src/modules/components/demos/data-grid/Inventory/InventoryDashboard';

interface CSSVariableUsage {
  variable: string;
  elements: Element[];
  properties: string[];
}

export default function DataGridThemeVisualizer() {
  const [cssVariables, setCssVariables] = React.useState<CSSVariableUsage[]>([]);
  const [selectedVariable, setSelectedVariable] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [highlightedElements, setHighlightedElements] = React.useState<Element[]>([]);
  const gridContainerRef = React.useRef<HTMLDivElement>(null);

  const collectCSSVariables = React.useCallback(() => {
    if (!gridContainerRef.current) {
      return;
    }

    const variableUsageMap = new Map<string, CSSVariableUsage>();
    const allElements = gridContainerRef.current.querySelectorAll('*');

    // Method 1: Check computed styles for CSS variable usage
    // Get all CSS variables that are actually being used by checking computed styles
    allElements.forEach((element) => {
      const computedStyles = window.getComputedStyle(element);

      // Get all CSS properties for this element
      for (let i = 0; i < computedStyles.length; i += 1) {
        const property = computedStyles[i];

        // Check if property starts with --DataGrid
        if (property.startsWith('--DataGrid-')) {
          const value = computedStyles.getPropertyValue(property);

          // This variable is defined on this element
          if (value && !value.includes('var(')) {
            if (!variableUsageMap.has(property)) {
              variableUsageMap.set(property, {
                variable: property,
                elements: [],
                properties: ['definition'],
              });
            }

            const usage = variableUsageMap.get(property)!;
            if (!usage.elements.includes(element)) {
              usage.elements.push(element);
            }
          }
        }
      }
    });

    // Method 2: Check stylesheets for where CSS variables are used via var()
    const stylesheets = Array.from(document.styleSheets);

    // Helper function to process CSS rules recursively (handles layers)
    const processRules = (rules: CSSRuleList | CSSRule[]) => {
      Array.from(rules).forEach((rule) => {
        // Handle CSS layers
        if (rule instanceof CSSLayerBlockRule) {
          processRules(rule.cssRules);
        }
        // Handle media queries
        else if (rule instanceof CSSMediaRule) {
          processRules(rule.cssRules);
        }
        // Handle supports rules
        else if (rule instanceof CSSSupportsRule) {
          processRules(rule.cssRules);
        }
        // Handle regular style rules
        else if (rule instanceof CSSStyleRule) {
          const style = rule.style;
          const cssText = rule.cssText;

          // Check the entire CSS text for DataGrid variables
          const matches = cssText.match(/var\((--DataGrid-[^,)]+)/g);

          if (matches) {
            // Find elements that match this selector within our grid
            const matchingElements = Array.from(allElements).filter((el) => {
              try {
                return el.matches(rule.selectorText);
              } catch {
                return false;
              }
            });

            // Process each CSS property
            for (let i = 0; i < style.length; i += 1) {
              const property = style[i];
              const value = style.getPropertyValue(property);

              // Check if this property uses a DataGrid variable
              const propMatches = value.match(/var\((--DataGrid-[^,)]+)/g);

              if (propMatches) {
                propMatches.forEach((match) => {
                  const variable = match.replace('var(', '').replace(')', '').trim();

                  if (!variableUsageMap.has(variable)) {
                    variableUsageMap.set(variable, {
                      variable,
                      elements: [],
                      properties: [],
                    });
                  }

                  const usage = variableUsageMap.get(variable)!;

                  matchingElements.forEach((element) => {
                    if (!usage.elements.includes(element)) {
                      usage.elements.push(element);
                    }
                  });

                  if (!usage.properties.includes(property)) {
                    usage.properties.push(property);
                  }
                });
              }
            }
          }
        }
      });
    };

    stylesheets.forEach((stylesheet) => {
      try {
        processRules(stylesheet.cssRules);
      } catch {
        // Skip stylesheets we can't access due to CORS
      }
    });

    // Also check inline styles
    allElements.forEach((element) => {
      const inlineStyle = element.getAttribute('style') || '';
      const matches = inlineStyle.match(/var\((--DataGrid-[^,)]+)/g);

      if (matches) {
        matches.forEach((match) => {
          const variable = match.replace('var(', '').replace(')', '').trim();

          if (!variableUsageMap.has(variable)) {
            variableUsageMap.set(variable, {
              variable,
              elements: [],
              properties: [],
            });
          }

          const usage = variableUsageMap.get(variable)!;
          if (!usage.elements.includes(element)) {
            usage.elements.push(element);
          }
        });
      }
    });

    const sortedVariables = Array.from(variableUsageMap.values()).sort((a, b) =>
      a.variable.localeCompare(b.variable),
    );

    setCssVariables(sortedVariables);
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      collectCSSVariables();
    }, 500);

    return () => clearTimeout(timer);
  }, [collectCSSVariables]);

  const handleVariableSelect = (variable: string) => {
    setSelectedVariable(variable);

    highlightedElements.forEach((el) => {
      (el as HTMLElement).style.outline = '';
      (el as HTMLElement).style.backgroundColor = '';
    });

    const usage = cssVariables.find((v) => v.variable === variable);
    if (usage) {
      usage.elements.forEach((el) => {
        (el as HTMLElement).style.outline = '2px solid #1976d2';
        (el as HTMLElement).style.backgroundColor = alpha('#1976d2', 0.1);
      });
      setHighlightedElements(usage.elements);

      if (usage.elements[0]) {
        usage.elements[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const clearHighlights = () => {
    highlightedElements.forEach((el) => {
      (el as HTMLElement).style.outline = '';
      (el as HTMLElement).style.backgroundColor = '';
    });
    setHighlightedElements([]);
    setSelectedVariable(null);
  };

  const filteredVariables = cssVariables.filter((v) =>
    v.variable.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getCategoryFromVariable = (variable: string): string => {
    if (variable.includes('spacing')) {
      return 'Spacing';
    }
    if (variable.includes('color-border')) {
      return 'Borders';
    }
    if (variable.includes('color-foreground')) {
      return 'Text';
    }
    if (variable.includes('color-background')) {
      return 'Background';
    }
    if (variable.includes('color-interactive')) {
      return 'Interactive';
    }
    if (variable.includes('header')) {
      return 'Headers';
    }
    if (variable.includes('cell')) {
      return 'Cells';
    }
    if (variable.includes('radius')) {
      return 'Border Radius';
    }
    if (variable.includes('typography')) {
      return 'Typography';
    }
    if (variable.includes('transition')) {
      return 'Transitions';
    }
    if (variable.includes('shadow')) {
      return 'Shadows';
    }
    if (variable.includes('z-index')) {
      return 'Z-Index';
    }
    return 'Other';
  };

  const groupedVariables = filteredVariables.reduce(
    (acc, variable) => {
      const category = getCategoryFromVariable(variable.variable);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(variable);
      return acc;
    },
    {} as Record<string, CSSVariableUsage[]>,
  );

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 48px)' }}>
      <Box
        sx={{
          width: 320,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          borderRight: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            CSS Variables
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search variables..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 1 }}
          />
          {selectedVariable && (
            <Box sx={{ mb: 1 }}>
              <Chip
                label={`Selected: ${selectedVariable}`}
                color="primary"
                onDelete={clearHighlights}
                size="small"
                sx={{ maxWidth: '100%' }}
              />
            </Box>
          )}
        </Box>
        <Divider />
        <List sx={{ overflow: 'auto', flex: 1, p: 0, pb: 3 }}>
          {Object.entries(groupedVariables).map(([category, variables]) => (
            <Box key={category}>
              <Typography
                variant="overline"
                sx={{ px: 2, py: 1, display: 'block', bgcolor: 'grey.100' }}
              >
                {category} ({variables.length})
              </Typography>
              {variables.map((usage) => (
                <ListItemButton
                  key={usage.variable}
                  selected={selectedVariable === usage.variable}
                  onClick={() => handleVariableSelect(usage.variable)}
                  sx={{ py: 0.5 }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {usage.variable}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {usage.elements.length} element{usage.elements.length !== 1 ? 's' : ''} •{' '}
                        {usage.properties.length} propert
                        {usage.properties.length !== 1 ? 'ies' : 'y'}
                      </Typography>
                    }
                  />
                </ListItemButton>
              ))}
            </Box>
          ))}
        </List>
      </Box>

      <Paper sx={{ flex: 1, p: 3, overflow: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          DataGrid Preview
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Click on a CSS variable to highlight elements using it
        </Typography>
        <Box ref={gridContainerRef} sx={{ height: 500, mt: 2 }}>
          <InventoryDashboard />
        </Box>
      </Paper>
    </Box>
  );
}
