import React, { ChangeEvent, useCallback, useState } from 'react';
import { StyledPanels } from './styled-panel';
import { Panel } from '@material-ui-x/panel';
import { FormControl, FormGroup, Button, FormLabel, MenuItem, Select } from '@material-ui/core';
import { darkThemeId, lightThemeId } from '../../theme';
import { useTheme } from '../../theme/useTheme';

export interface SettingsPanelProps {
  onApply: ({ size: number, type: string }) => void;
  type: string;
  size: number;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onApply, type, size }) => {
  const [sizeState, setSize] = useState<number>(size);
  const [typeState, setType] = useState<string>(type);
  const [theme, themeId, toggleTheme, isDark] = useTheme();

  const applyChanges = useCallback(() => {
    onApply({ size: sizeState, type: typeState });
  }, [sizeState, typeState, onApply]);

  const onDatasetChange = useCallback(
    (e: ChangeEvent<{ name?: string; value: any }>) => {
      setType(e.target.value);
    },
    [setType],
  );

  const onSizeChange = useCallback(
    (e: ChangeEvent<{ name?: string; value: any }>) => {
      setSize(Number(e.target.value));
    },
    [setSize],
  );

  return (
    <StyledPanels>
      {/*<Panel title={'Settings'}>*/}
      <div className={'panel'}>
        <FormGroup row className={'center'}>
          <FormControl className={'dataset-control input-text'} size={'small'} component="fieldset">
            <FormLabel component="legend">Dataset</FormLabel>
            <Select value={typeState} onChange={onDatasetChange}>
              <MenuItem value={'employee'}>Employee</MenuItem>
              <MenuItem value={'commodity'}>Commodity</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={'dataset-control input-text'} size={'small'} component="fieldset">
            <FormLabel component="legend">Rows</FormLabel>
            <Select value={sizeState} onChange={onSizeChange}>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={1000}>{Number(1000).toLocaleString()}</MenuItem>
              <MenuItem value={10000}>{Number(10000).toLocaleString()}</MenuItem>
              <MenuItem value={100000}>{Number(100000).toLocaleString()}</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={'dataset-control input-text'} size={'small'} component="fieldset">
            <FormLabel component="legend">Themes</FormLabel>
            <Select value={themeId} onChange={toggleTheme}>
              <MenuItem value={lightThemeId}>Light</MenuItem>
              <MenuItem value={darkThemeId}>Dark</MenuItem>
            </Select>
          </FormControl>
          <div>
          <Button size="small" className={'apply-btn'} variant={'outlined'} color={'primary'} onClick={applyChanges}>
            Apply
          </Button>
          </div>
        </FormGroup>
      </div>
    </StyledPanels>
  );
};
