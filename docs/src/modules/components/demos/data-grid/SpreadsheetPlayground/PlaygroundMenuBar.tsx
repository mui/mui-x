import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded';
import { TEMPLATES, TEMPLATE_IDS, TemplateId } from './playgroundData';
import type { RefPaletteId } from './sheetsStyles';

export interface PlaygroundToggles {
  formulasEnabled: boolean;
  a1Notation: boolean;
  autocomplete: boolean;
  formulaBar: boolean;
  fillHandle: boolean;
  sorting: boolean;
  filtering: boolean;
  customFunctions: boolean;
  refPalette: RefPaletteId;
}

export type ExportKind = 'excel-live' | 'excel-values' | 'csv' | 'print';

interface PlaygroundMenuBarProps {
  templateId: TemplateId;
  toggles: PlaygroundToggles;
  onTemplateChange: (id: TemplateId) => void;
  onToggle: (key: keyof PlaygroundToggles, value: boolean | RefPaletteId) => void;
  onAddRows: (count: number) => void;
  onAddColumn: () => void;
  onOpenFilterPanel: () => void;
  onReset: () => void;
  onExport: (kind: ExportKind) => void;
}

const menuButtonSx = {
  // Doubled specificity so the docs theme's Button color never wins over the
  // Sheets chrome color, in either light or dark mode.
  '&&': { color: 'var(--sheets-text)' },
  textTransform: 'none',
  fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
  fontSize: '14px',
  fontWeight: 400,
  minWidth: 0,
  px: 1,
  py: 0.25,
  borderRadius: '4px',
  '&:hover': { backgroundColor: 'var(--sheets-hover)' },
} as const;

function CheckItem({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <MenuItem dense onClick={onClick}>
      <ListItemIcon sx={{ visibility: checked ? 'visible' : 'hidden' }}>
        <CheckIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{label}</ListItemText>
    </MenuItem>
  );
}

function MenuButton({
  label,
  children,
  closeOnClick = true,
}: {
  label: React.ReactNode;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
  closeOnClick?: boolean;
}) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const close = React.useCallback(() => setAnchorEl(null), []);
  return (
    <React.Fragment>
      <Button size="small" sx={menuButtonSx} onClick={(event) => setAnchorEl(event.currentTarget)}>
        {label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={close}
        onClick={closeOnClick ? close : undefined}
        // The modal scroll lock puts `overflow: hidden` on the docs page's
        // scroll container, which resets its scroll position to the top.
        disableScrollLock
        slotProps={{ list: { dense: true } }}
      >
        {typeof children === 'function' ? children(close) : children}
      </Menu>
    </React.Fragment>
  );
}

const THINGS_TO_TRY = [
  'Edit the constant in row 1 (rate, income, or weights) — every dependent cell recalculates.',
  'Type = in any cell to write a formula, with autocomplete and colored references.',
  "Drag a formula cell's fill handle down (or press Ctrl+D) — relative references shift, $-pinned ones stay.",
  'The Status, Grade, and Bonus colors follow the evaluated values.',
  'Turn View → A1 notation off to see the canonical syntax the grid stores.',
  'Extensions registers the custom MARGIN() and TIER() functions.',
  'Export → Excel with live formulas recalculates inside Excel.',
];

function InfoPopup() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  return (
    <React.Fragment>
      <Tooltip title="Things to try">
        <IconButton
          size="small"
          aria-label="Things to try"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{
            color: 'var(--sheets-icon)',
            '&:hover': { backgroundColor: 'var(--sheets-hover)' },
          }}
        >
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Popover
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        disableScrollLock
      >
        <Box sx={{ p: 2, maxWidth: 360 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Things to try
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { mb: 0.5 } }}>
            {THINGS_TO_TRY.map((tip) => (
              <Typography key={tip} component="li" variant="body2">
                {tip}
              </Typography>
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
            The live-formulas export disables the formula-injection guard—only use it with trusted
            data. Custom functions show #NAME? if Excel recalculates them. See the{' '}
            <Link href="/x/react-data-grid/formulas/">formula documentation</Link> for details.
          </Typography>
        </Box>
      </Popover>
    </React.Fragment>
  );
}

function PlaygroundMenuBar(props: PlaygroundMenuBarProps) {
  const {
    templateId,
    toggles,
    onTemplateChange,
    onToggle,
    onAddRows,
    onAddColumn,
    onOpenFilterPanel,
    onReset,
    onExport,
  } = props;
  const template = TEMPLATES[templateId];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1.5,
        py: 0.5,
        backgroundColor: 'var(--sheets-chrome)',
        flexWrap: 'wrap',
      }}
    >
      <TableChartRoundedIcon sx={{ color: '#188038', fontSize: 22, mr: 0.5 }} />
      <MenuButton
        label={
          <React.Fragment>
            <Typography
              component="span"
              sx={{
                fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
                fontSize: '15px',
                fontWeight: 500,
                color: 'var(--sheets-text)',
              }}
            >
              {template.label}
            </Typography>
            <ArrowDropDownIcon fontSize="small" sx={{ color: 'var(--sheets-icon)' }} />
          </React.Fragment>
        }
      >
        <ListSubheader sx={{ backgroundColor: 'transparent', lineHeight: '32px' }}>
          Template
        </ListSubheader>
        {TEMPLATE_IDS.map((id) => (
          <CheckItem
            key={id}
            checked={id === templateId}
            label={TEMPLATES[id].label}
            onClick={() => onTemplateChange(id)}
          />
        ))}
      </MenuButton>

      <Box sx={{ width: 8 }} />

      <MenuButton label="Insert">
        <MenuItem dense onClick={() => onAddRows(1)}>
          Row below
        </MenuItem>
        <MenuItem dense onClick={() => onAddRows(10)}>
          10 rows below
        </MenuItem>
        <Divider />
        <MenuItem dense onClick={onAddColumn}>
          Column…
        </MenuItem>
      </MenuButton>

      <MenuButton label="View" closeOnClick={false}>
        <CheckItem
          checked={toggles.formulaBar}
          label="Formula bar"
          onClick={() => onToggle('formulaBar', !toggles.formulaBar)}
        />
        <CheckItem
          checked={toggles.autocomplete}
          label="Formula autocomplete"
          onClick={() => onToggle('autocomplete', !toggles.autocomplete)}
        />
        <CheckItem
          checked={toggles.fillHandle}
          label="Fill handle"
          onClick={() => onToggle('fillHandle', !toggles.fillHandle)}
        />
        <CheckItem
          checked={toggles.a1Notation}
          label="A1 notation"
          onClick={() => onToggle('a1Notation', !toggles.a1Notation)}
        />
        <Divider />
        <ListSubheader sx={{ backgroundColor: 'transparent', lineHeight: '32px' }}>
          Reference colors
        </ListSubheader>
        {(['default', 'sheets', 'contrast'] as const).map((palette) => (
          <CheckItem
            key={palette}
            checked={toggles.refPalette === palette}
            label={
              { default: 'Default', sheets: 'Google Sheets', contrast: 'High contrast' }[palette]
            }
            onClick={() => onToggle('refPalette', palette)}
          />
        ))}
        <Divider />
        <CheckItem
          checked={toggles.formulasEnabled}
          label="Formulas enabled"
          onClick={() => onToggle('formulasEnabled', !toggles.formulasEnabled)}
        />
      </MenuButton>

      <MenuButton label="Data" closeOnClick={false}>
        {(close) => (
          <React.Fragment>
            <CheckItem
              checked={toggles.sorting}
              label="Column sorting"
              onClick={() => onToggle('sorting', !toggles.sorting)}
            />
            <CheckItem
              checked={toggles.filtering}
              label="Column filtering"
              onClick={() => onToggle('filtering', !toggles.filtering)}
            />
            <MenuItem
              dense
              disabled={!toggles.filtering}
              onClick={() => {
                close();
                onOpenFilterPanel();
              }}
            >
              <ListItemIcon />
              <ListItemText>Filter panel</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
              dense
              onClick={() => {
                close();
                onReset();
              }}
            >
              Reset sheet
            </MenuItem>
          </React.Fragment>
        )}
      </MenuButton>

      <MenuButton label="Extensions" closeOnClick={false}>
        <CheckItem
          checked={toggles.customFunctions}
          label="Custom functions (MARGIN, TIER)"
          onClick={() => onToggle('customFunctions', !toggles.customFunctions)}
        />
        {toggles.customFunctions && (
          <MenuItem dense disabled sx={{ whiteSpace: 'normal', maxWidth: 300 }}>
            {template.customFunctionHint}
          </MenuItem>
        )}
      </MenuButton>

      <MenuButton label="Export">
        <MenuItem dense onClick={() => onExport('excel-live')}>
          <ListItemText
            primary="Excel — live formulas"
            secondary="Formulas recalculate in Excel (trusted data only)"
          />
        </MenuItem>
        <MenuItem dense onClick={() => onExport('excel-values')}>
          <ListItemText primary="Excel — values only" />
        </MenuItem>
        <Divider />
        <MenuItem dense onClick={() => onExport('csv')}>
          <ListItemText primary="CSV" secondary="Always evaluated values" />
        </MenuItem>
        <MenuItem dense onClick={() => onExport('print')}>
          <ListItemText primary="Print" />
        </MenuItem>
      </MenuButton>

      <Box sx={{ flex: 1 }} />
      <InfoPopup />
    </Box>
  );
}

export { PlaygroundMenuBar };
