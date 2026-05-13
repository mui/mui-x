import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import Paper from '@mui/material/Paper';
import ClosedCaptionOutlinedIcon from '@mui/icons-material/ClosedCaptionOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    border: 0,
    borderRadius: theme.shape.borderRadius,
  },
}));

export type ChatView = 'messenger' | 'agent' | 'widget' | 'captions';

export type ViewToggleGroupProps = {
  selected: ChatView;
  onToggleChange: (value: ChatView) => void;
};

export default function ViewToggleGroup({ selected, onToggleChange }: ViewToggleGroupProps) {
  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        display: 'flex',
        border: `1px solid ${theme.palette.divider}`,
        flexWrap: 'wrap',
        width: 'fit-content',
      })}
    >
      <StyledToggleButtonGroup
        orientation="horizontal"
        value={selected}
        exclusive
        size="small"
        onChange={(_event, value) => {
          if (value && value !== selected) {
            onToggleChange(value);
          }
        }}
      >
        <ToggleButton value="messenger" title="Messenger" sx={{ gap: 1 }}>
          <ForumOutlinedIcon fontSize="small" />
          Messenger
        </ToggleButton>
        <ToggleButton value="agent" title="AI Agent" sx={{ gap: 1 }}>
          <SmartToyOutlinedIcon fontSize="small" />
          AI Agent
        </ToggleButton>
        <ToggleButton value="widget" title="Widget" sx={{ gap: 1 }}>
          <SupportAgentOutlinedIcon fontSize="small" />
          Widget
        </ToggleButton>
        <ToggleButton value="captions" title="Captions" sx={{ gap: 1 }}>
          <ClosedCaptionOutlinedIcon fontSize="small" />
          Captions
        </ToggleButton>
      </StyledToggleButtonGroup>
    </Paper>
  );
}
