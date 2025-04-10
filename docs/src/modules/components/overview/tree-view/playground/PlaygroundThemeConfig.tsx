import * as React from 'react';
import { TreeViewSelectionPropagation } from '@mui/x-tree-view/models';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import DensityLargeIcon from '@mui/icons-material/DensityLarge';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import {
  ColorSwatch,
  MediumCornersIcon,
  RectangularCornersIcon,
  RoundedCornersIcon,
} from '../../CornerIcons';
import ConfigToggleButtons from '../../ConfigToggleButtons';

export type Corner = 'medium' | 'rectangular' | 'rounded';
export type Density = 'medium' | 'compact' | 'spacious';

const colors = {
  default: 'hsl(220, 25%, 35%)',
  purple: 'hsl(239, 100%, 64%)',
  orange: 'hsl(20, 70%, 60%)',
};

type ThemesConfigProps = {
  color: string;
  corner: Corner;
  density: Density;
  showFolderIcon: boolean;
  showChildrenOutline: boolean;
  showSecondaryLabel: boolean;
  showDisableButton: boolean;
  isCheckboxSelectionEnabled: boolean;
  isMultiSelectEnabled: boolean;
  selectionPropagation: TreeViewSelectionPropagation;
  handleChangeCorner: (event: React.MouseEvent<HTMLElement>, newCorner: Corner) => void;
  handleChangeColor: (event: React.MouseEvent<HTMLElement>, newColor: string) => void;
  handleChangeDensity: (event: React.MouseEvent<HTMLElement>, newDensity: Density) => void;
  handleToggleFolderIcon: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleChildrenOutline: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleDisableButton: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleSecondaryLabel: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleCheckboxSelection: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleMultiSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectionPropagation: React.Dispatch<React.SetStateAction<TreeViewSelectionPropagation>>;
};

export default function ThemesConfig({
  color,
  corner,
  density,
  showFolderIcon,
  showChildrenOutline,
  showDisableButton,
  handleChangeCorner,
  handleChangeColor,
  handleChangeDensity,
  handleToggleFolderIcon,
  handleToggleChildrenOutline,
  handleToggleDisableButton,
  showSecondaryLabel,
  handleToggleSecondaryLabel,
  isCheckboxSelectionEnabled,
  isMultiSelectEnabled,
  selectionPropagation,
  setSelectionPropagation,
  handleToggleCheckboxSelection,
  handleToggleMultiSelect,
}: ThemesConfigProps) {
  return (
    <Stack
      justifyContent="flex-start"
      spacing={2}
      sx={(theme) => ({
        minWidth: '300px',
        borderRadius: {
          xs: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
          md: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`,
        },
        padding: 2,
        overflow: 'auto',
      })}
    >
      <Stack spacing={1.5}>
        {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
        <Typography fontSize="0.8rem" gutterBottom color="hsl(220, 25%, 45%)">
          Color
        </Typography>
        <ConfigToggleButtons
          selectedValue={color}
          handleValueSwitch={handleChangeColor}
          values={Object.keys(colors).map((key) => ({
            key,
            icon: <ColorSwatch color={colors[key as keyof typeof colors]} />,
          }))}
        />
      </Stack>
      <Stack spacing={1.5}>
        {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
        <Typography fontSize="0.8rem" gutterBottom color="hsl(220, 25%, 45%)">
          Border radius
        </Typography>
        <ConfigToggleButtons
          selectedValue={corner}
          handleValueSwitch={handleChangeCorner}
          values={[
            {
              key: 'rectangular',
              icon: <RectangularCornersIcon fontSize="small" />,
            },
            {
              key: 'medium',
              icon: <MediumCornersIcon fontSize="small" />,
            },
            {
              key: 'rounded',
              icon: <RoundedCornersIcon fontSize="small" />,
            },
          ]}
        />
      </Stack>
      <Stack spacing={1.5}>
        {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
        <Typography fontSize="0.8rem" gutterBottom color="hsl(220, 25%, 45%)">
          Density
        </Typography>
        <ConfigToggleButtons
          selectedValue={density}
          handleValueSwitch={handleChangeDensity}
          values={[
            {
              key: 'compact',
              icon: <DensitySmallIcon fontSize="small" />,
            },
            {
              key: 'medium',
              icon: <DensityMediumIcon fontSize="small" />,
            },
            {
              key: 'spacious',
              icon: <DensityLargeIcon fontSize="small" />,
            },
          ]}
        />
      </Stack>
      <Stack spacing={1.5}>
        {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
        <Typography gutterBottom fontSize="0.8rem" color="hsl(220, 25%, 45%)">
          Layout
        </Typography>

        <FormControlLabel
          control={<Switch checked={showChildrenOutline} onChange={handleToggleChildrenOutline} />}
          labelPlacement="start"
          label="Add children outline"
          sx={{ gap: 1, justifyContent: 'space-between' }}
          slotProps={{ typography: { fontSize: '0.8rem' } }}
        />
        <FormControlLabel
          control={<Switch checked={showFolderIcon} onChange={handleToggleFolderIcon} />}
          labelPlacement="start"
          label="Mark folders with icon"
          sx={{ gap: 1, justifyContent: 'space-between' }}
          slotProps={{ typography: { fontSize: '0.8rem' } }}
        />
      </Stack>
      <Stack spacing={1.5}>
        {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
        <Typography gutterBottom fontSize="0.8rem" color="hsl(220, 25%, 45%)">
          Behavior
        </Typography>

        <FormControlLabel
          control={<Switch checked={showDisableButton} onChange={handleToggleDisableButton} />}
          labelPlacement="start"
          label="Show disable button"
          sx={{ gap: 1, justifyContent: 'space-between' }}
          slotProps={{ typography: { fontSize: '0.8rem' } }}
        />
        <FormControlLabel
          control={<Switch checked={showSecondaryLabel} onChange={handleToggleSecondaryLabel} />}
          labelPlacement="start"
          label="Add secondary label"
          sx={{ gap: 1, justifyContent: 'space-between' }}
          slotProps={{ typography: { fontSize: '0.8rem' } }}
        />
      </Stack>

      <Stack spacing={1.5}>
        {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
        <Typography gutterBottom fontSize="0.8rem" color="hsl(220, 25%, 45%)">
          Selection behavior
        </Typography>

        <FormControlLabel
          control={
            <Switch checked={isCheckboxSelectionEnabled} onChange={handleToggleCheckboxSelection} />
          }
          labelPlacement="start"
          label="Checkbox selection"
          sx={{ gap: 1, justifyContent: 'space-between' }}
          slotProps={{ typography: { fontSize: '0.8rem' } }}
        />
        <FormControlLabel
          control={<Switch checked={isMultiSelectEnabled} onChange={handleToggleMultiSelect} />}
          labelPlacement="start"
          label="Multiple selection"
          sx={{ gap: 1, justifyContent: 'space-between' }}
          slotProps={{ typography: { fontSize: '0.8rem' } }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={selectionPropagation.parents}
              onChange={(event) =>
                setSelectionPropagation((prev) => ({
                  ...prev,
                  parents: event.target.checked,
                }))
              }
              disabled={!isMultiSelectEnabled}
            />
          }
          labelPlacement="start"
          label="Auto select parents"
          sx={{ gap: 1, justifyContent: 'space-between' }}
          slotProps={{ typography: { fontSize: '0.8rem' } }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={selectionPropagation.descendants}
              onChange={(event) =>
                setSelectionPropagation((prev) => ({
                  ...prev,
                  descendants: event.target.checked,
                }))
              }
              disabled={!isMultiSelectEnabled}
            />
          }
          labelPlacement="start"
          label="Auto select descendants"
          sx={{ gap: 1, justifyContent: 'space-between' }}
          slotProps={{ typography: { fontSize: '0.8rem' } }}
        />
      </Stack>
    </Stack>
  );
}
