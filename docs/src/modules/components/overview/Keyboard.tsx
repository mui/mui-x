import * as React from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import SectionHeadline from 'docs/src/components/typography/SectionHeadline';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { styled, alpha, createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { FieldSelectedSections } from '@mui/x-date-pickers/models';

type KeyType = {
  label: string;
  showLabel?: boolean;
  width?: number;
  displayedLabel?: string;
  location?: number;
  shouldSelect?: boolean;
  code?: string;
  keyCode?: number;
  height?: number;
  x?: number;
  y?: number;
  keyType?: 'navigate-left' | 'navigate-right' | 'input';
};

const keys: KeyType[][] = [
  [
    { label: 'Escape', width: 43, showLabel: true, displayedLabel: 'Esc', shouldSelect: true },
    { label: 'f1', width: 23, showLabel: false },
    { label: 'f2', width: 23, showLabel: false },
    { label: 'f3', width: 23, showLabel: false },
    { label: 'f4', width: 23, showLabel: false },
    { label: 'f5', width: 23, showLabel: false },
    { label: 'f6', width: 23, showLabel: false },
    { label: 'f7', width: 23, showLabel: false },
    { label: 'f8', width: 23, showLabel: false },
    { label: 'f9', width: 23, showLabel: false },
    { label: 'f10', width: 23, showLabel: false },
    { label: 'f11', width: 23, showLabel: false },
    { label: 'f12', width: 23, showLabel: false },
    { label: 'Delete', width: 23, showLabel: true, shouldSelect: true, displayedLabel: 'Del' },
  ],
  [
    { label: '`', width: 23, showLabel: true },
    {
      label: '1',
      width: 23,
      showLabel: true,
      shouldSelect: true,
      code: 'Digit1',
      keyCode: 49,
      keyType: 'input',
    },
    {
      label: '2',
      width: 23,
      showLabel: true,
      shouldSelect: true,
      code: 'Digit2',
      keyCode: 50,
      keyType: 'input',
    },
    {
      label: '3',
      width: 23,
      showLabel: true,
      shouldSelect: true,
      code: 'Digit3',
      keyCode: 51,
      keyType: 'input',
    },
    {
      label: '4',
      width: 23,
      showLabel: true,
      shouldSelect: true,
      code: 'Digit4',
      keyCode: 52,
      keyType: 'input',
    },
    {
      label: '5',
      width: 23,
      showLabel: true,
      shouldSelect: true,
      code: 'Digit5',
      keyCode: 53,
      keyType: 'input',
    },
    {
      label: '6',
      width: 23,
      showLabel: true,
      shouldSelect: true,
      code: 'Digit6',
      keyCode: 54,
      keyType: 'input',
    },
    {
      label: '7',
      width: 23,
      showLabel: true,
      shouldSelect: true,
      code: 'Digit7',
      keyCode: 55,
      keyType: 'input',
    },
    {
      label: '8',
      width: 23,
      showLabel: true,
      shouldSelect: true,
      code: 'Digit8',
      keyCode: 56,
      keyType: 'input',
    },
    {
      label: '9',
      width: 23,
      showLabel: true,
      shouldSelect: true,
      code: 'Digit9',
      keyCode: 57,
      keyType: 'input',
    },
    {
      label: '0',
      width: 23,
      showLabel: true,
      shouldSelect: true,
      code: 'Digit0',
      keyCode: 58,
      keyType: 'input',
    },
    { label: '-', width: 23, showLabel: false },
    { label: '=', width: 23, showLabel: false },
    {
      label: 'Backspace',
      displayedLabel: 'Back',
      width: 43,
      showLabel: true,
      code: 'Backspace',
      keyCode: 8,
      shouldSelect: true,
    },
  ],
  [
    { label: 'Tab', width: 43, showLabel: true, shouldSelect: true },
    { label: 'q', width: 23, showLabel: false },
    { label: 'w', width: 23, showLabel: false },
    { label: 'e', width: 23, showLabel: false },
    { label: 'r', width: 23, showLabel: false },
    { label: 't', width: 23, showLabel: false },
    { label: 'y', width: 23, showLabel: false },
    { label: 'u', width: 23, showLabel: false },
    { label: 'i', width: 23, showLabel: false },
    { label: 'o', width: 23, showLabel: false },
    { label: 'p', width: 23, showLabel: false },
    { label: '[', width: 23, showLabel: false },
    { label: ']', width: 23, showLabel: false },
    { label: '\\', width: 23, showLabel: false },
  ],
  [
    { label: 'CapsLock', width: 49, showLabel: true, displayedLabel: 'Caps', shouldSelect: true },
    { label: 'a', width: 23, showLabel: false },
    { label: 's', width: 23, showLabel: false },
    { label: 'd', width: 23, showLabel: false },
    { label: 'f', width: 23, showLabel: false },
    { label: 'g', width: 23, showLabel: false },
    { label: 'h', width: 23, showLabel: false },
    { label: 'j', width: 23, showLabel: false },
    { label: 'k', width: 23, showLabel: false },
    { label: 'l', width: 23, showLabel: false },
    { label: ';', width: 23, showLabel: false },
    { label: "'", width: 23, showLabel: false },
    { label: 'Enter', width: 45, showLabel: true, shouldSelect: true },
  ],
  [
    { label: 'Shift', width: 59, showLabel: true, location: 1 },
    { label: 'z', width: 23, showLabel: false },
    { label: 'x', width: 23, showLabel: false },
    { label: 'c', width: 23, showLabel: false },
    { label: 'v', width: 23, showLabel: false },
    { label: 'b', width: 23, showLabel: false },
    { label: 'n', width: 23, showLabel: false },
    { label: 'm', width: 23, showLabel: false },
    { label: ',', width: 23, showLabel: false },
    { label: '.', width: 23, showLabel: false },
    { label: '/', width: 23, showLabel: true },
    { label: 'Shift', width: 63, showLabel: true, location: 2 },
  ],
  [
    { label: 'Control', width: 43, showLabel: true, location: 1, displayedLabel: 'Ctrl' },
    { label: 'Meta', width: 29, showLabel: false },
    { label: 'Alt', width: 42, showLabel: true, location: 1 },
    { label: ' ', width: 119, showLabel: false, displayedLabel: 'Space' },
    { label: 'Alt', width: 42, showLabel: true, location: 2 },
    { label: 'Control', width: 23, showLabel: true, location: 2, displayedLabel: 'Ctrl' },
  ],
];

const arrowKeys: KeyType[] = [
  {
    label: 'ArrowLeft',
    width: 23,
    height: 9,
    showLabel: false,
    shouldSelect: true,
    x: 340.5,
    y: 166.5,
    keyType: 'navigate-left',
  },
  {
    label: 'ArrowUp',
    width: 23,
    height: 9,
    showLabel: false,
    shouldSelect: true,
    x: 368.5,
    y: 152.5,
  },
  {
    label: 'ArrowDown',
    width: 23,
    height: 9,
    showLabel: false,
    shouldSelect: true,
    x: 368.5,
    y: 166.5,
  },
  {
    label: 'ArrowRight',
    width: 23,
    height: 9,
    showLabel: false,
    shouldSelect: true,
    x: 396.5,
    y: 166.5,
    keyType: 'navigate-right',
  },
];

const RootRectangle = styled('rect')(({ theme }) => ({
  fill: 'white',
  stroke: theme.palette.grey[500],
  ...theme.applyStyles('dark', {
    stroke: theme.palette.grey[600],
    fill: theme.palette.background.paper,
  }),
}));
const KeyRoot = styled('g')(({ theme }) => ({
  cursor: 'pointer',
  '&:not(.selected):hover ': { '& .key-rect': { fill: theme.palette.action.hover } },
  '&.selected': { '& .key-rect': { fill: alpha(theme.palette.primary.main, 0.2) } },
}));
const KeyRectangle = styled('rect')(({ theme }) => ({
  fill: 'white',
  stroke: theme.palette.grey[500],
  ...theme.applyStyles('dark', {
    stroke: theme.palette.grey[600],
    fill: theme.palette.background.paper,
  }),
}));
const KeyText = styled('text')(({ theme }) => ({
  fill: theme.palette.grey[800],
  fontSize: 9,
  fontFamily: 'IBM Plex Sans',
  ...theme.applyStyles('dark', { fill: theme.palette.text.primary }),
}));

type KeyboardSvgProps = {
  handleKeySelection: HandleKeySelection;
  selectedKey: SelectedKey | null;
};

export function KeyboardSvg({ selectedKey, handleKeySelection }: KeyboardSvgProps) {
  return (
    <svg viewBox="0 0 432 188" fill="none" xmlns="http://www.w3.org/2000/svg" tabIndex={-1}>
      <g className="root">
        <RootRectangle x="0.5" y="0.5" width="431" height="187" rx="7.5" />
      </g>

      {keys.map((row, rowIndex) => {
        let xPosition = 12.5;
        const yPosition = 12.5 + rowIndex * 28;
        return (
          <g key={`row-${rowIndex}`}>
            {row.map(
              (
                {
                  label,
                  displayedLabel,
                  showLabel,
                  width = 23,
                  location = 0,
                  shouldSelect = false,
                  code,
                  keyCode,
                },
                keyIndex,
              ) => {
                const textXPosition = xPosition + width / 2;
                const textYPosition = yPosition + 11.5;
                const keyComponent = (
                  <KeyRoot
                    key={`key-${rowIndex}-${keyIndex}`}
                    className={clsx(label, 'key-root', {
                      selected:
                        shouldSelect &&
                        selectedKey &&
                        selectedKey.key.toLowerCase() === label.toLowerCase() &&
                        selectedKey.location === location,
                    })}
                    onMouseDown={(event) => {
                      if (shouldSelect) {
                        event.preventDefault();

                        handleKeySelection(event, {
                          key: label,
                          location: location || 0,
                          code: code || label,
                          keyCode: keyCode || 0,
                        });
                      }
                    }}
                    onMouseUp={(event) => {
                      if (shouldSelect) {
                        handleKeySelection(event, null);
                      }
                    }}
                  >
                    <KeyRectangle
                      x={xPosition}
                      y={yPosition}
                      width={width}
                      height="23"
                      rx="3.5"
                      className={clsx(label, 'key-rect')}
                    />
                    {showLabel && (
                      <KeyText
                        x={textXPosition}
                        y={textYPosition}
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {displayedLabel || label}
                      </KeyText>
                    )}
                  </KeyRoot>
                );
                xPosition = xPosition + width + 5;

                return keyComponent;
              },
            )}
          </g>
        );
      })}
      {arrowKeys.map(
        ({ label: key, location = 0, code = key, keyCode, width, height, x, y }, keyIndex) => {
          return (
            <KeyRoot
              key={`arrow-${keyIndex}`}
              className={clsx(key, 'key-root', {
                selected: selectedKey && selectedKey.key.toLowerCase() === key.toLowerCase(),
              })}
              onMouseDown={(event) => {
                event.preventDefault();
                handleKeySelection(event, { key, location, code, keyCode });
              }}
              onMouseUp={(event) => {
                handleKeySelection(event, null);
              }}
            >
              <KeyRectangle
                x={x}
                y={y}
                width={width}
                height={height}
                rx="2.5"
                className={clsx(key, 'key-rect')}
              />
            </KeyRoot>
          );
        },
      )}
    </svg>
  );
}

type SelectedKey = {
  key: string;
  location?: number;
  code?: string;
  keyCode?: number;
};
type HandleKeySelection = (event: React.SyntheticEvent, key: SelectedKey | null) => void;

export default function Keyboard() {
  const [selectedKey, setSelectedKey] = React.useState<SelectedKey | null>(null);
  const ref = React.useRef(null);
  const selectedSection = React.useRef<FieldSelectedSections>(0);

  const brandingTheme = useTheme();
  const theme = createTheme({ palette: { mode: brandingTheme.palette.mode } });

  const handleKeySelection = (e: React.SyntheticEvent, key: SelectedKey | null) => {
    const sectionContent = (ref.current as any).querySelector(
      `.MuiPickersSectionList-section[data-sectionindex="${selectedSection.current || 0}"] .MuiPickersSectionList-sectionContent`,
    );
    sectionContent.focus();

    if (key) {
      const event = new KeyboardEvent('keydown', {
        ...key,
        bubbles: true,
        cancelable: true,
      });

      sectionContent.dispatchEvent(event);

      if (key.key === 'Backspace') {
        sectionContent.textContent = '';
        const inputEvent = new InputEvent('input', {
          data: '',
          inputType: 'insertText',
          bubbles: true,
          cancelable: true,
        });

        sectionContent.dispatchEvent(inputEvent);
      } else if (key?.keyCode && key?.keyCode >= 49 && key?.keyCode <= 58) {
        sectionContent.textContent = key.key;
        const inputEvent = new InputEvent('input', {
          data: key.key,
          inputType: 'insertText',
          bubbles: true,
          cancelable: true,
        });
        sectionContent.dispatchEvent(inputEvent);
      }
    }
    setSelectedKey(key);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Divider />
      <Stack direction={{ md: 'row', xs: 'column' }} alignItems={'center'} spacing={6} py={8}>
        <Stack sx={{ maxWidth: { xs: '500px', md: '100%' } }}>
          <SectionHeadline
            overline="Accessibility"
            title={
              <Typography variant="h2" fontSize="1.625rem">
                Assistive technology support
              </Typography>
            }
            description="The MUI X Date Pickers feature advanced keyboard support that's compliant with WCAG and WAI-ARIA standards, so users who require assistive technology can navigate your interface with ease."
          />
          <Button
            size="small"
            href="/x/react-date-pickers/accessibility/"
            endIcon={<ArrowForwardIcon />}
            sx={{ width: 'fit-content' }}
          >
            More info
          </Button>
        </Stack>
        <Stack spacing={2} sx={{ width: '100%', maxWidth: '500px' }}>
          <ThemeProvider theme={theme}>
            <DateField
              defaultValue={dayjs('12/12/2023')}
              ref={ref}
              onKeyDown={(event: React.KeyboardEvent) => {
                setSelectedKey({
                  key: event.key,
                  code: event.code,
                  location: event.location,
                });
              }}
              onKeyUp={() => {
                setSelectedKey(null);
              }}
              enableAccessibleFieldDOMStructure
              onSelectedSectionsChange={(newSelectedSection) => {
                selectedSection.current = newSelectedSection;
              }}
            />
          </ThemeProvider>
          <KeyboardSvg handleKeySelection={handleKeySelection} selectedKey={selectedKey} />
        </Stack>
      </Stack>
    </LocalizationProvider>
  );
}
