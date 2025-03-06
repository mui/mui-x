import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { styled } from '@mui/material/styles';
import { leafItemGroups } from './items';

const CustomAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  minHeight: 0,
  borderBottom: `1px solid transparent`,
  '&.Mui-expanded': {
    minHeight: 0,
    borderBottomColor: theme.palette.divider,
  },
  '& .MuiAccordionSummary-content': {
    margin: '11px 0',
    '&.Mui-expanded': { margin: '11px 0' },
  },
}));

const StyledPre = styled('pre')(({ theme }) => ({
  margin: `0 !important`,
  borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px !important`,
}));

type CodeAccordionProps = {
  type: 'deleted' | 'added' | 'modified';
  title: string;
  expanded: boolean;
  onChange: () => void;
  code: string;
  language: string;
};

function CodeAccordion({ type, title, expanded, onChange, code, language }: CodeAccordionProps) {
  return (
    <div>
      <Accordion
        disableGutters
        elevation={0}
        variant="outlined"
        expanded={expanded}
        onChange={onChange}
      >
        <CustomAccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${title}-content`}
          id={`${title}-header`}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Stack direction="row" spacing={0.025} alignItems="center">
              <SquareRoundedIcon
                sx={{ fontSize: '16px' }}
                color={type === 'deleted' ? 'error' : 'success'}
              />
              <SquareRoundedIcon
                sx={{ fontSize: '16px' }}
                color={type === 'deleted' ? 'error' : 'success'}
              />
              <SquareRoundedIcon
                sx={{ fontSize: '16px' }}
                color={type === 'added' ? 'success' : 'error'}
              />
              <SquareRoundedIcon
                sx={{ fontSize: '16px' }}
                color={type === 'added' ? 'success' : 'error'}
              />
              <SquareRoundedIcon sx={{ fontSize: '16px' }} color="disabled" />
            </Stack>
            <Typography fontFamily="monospace" color="text.secondary" variant="body2">
              {title}
            </Typography>
          </Stack>
        </CustomAccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <HighlightedCode code={code} language={language} preComponent={StyledPre} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default function GitHubFiles({
  selectedItem,
  setSelectedItem,
}: {
  selectedItem: string | null;
  setSelectedItem: (value: string | null) => void;
}) {
  const handleChange = (itemId: string | null) => {
    if (itemId === selectedItem) {
      setSelectedItem(null);
    } else {
      setSelectedItem(itemId);
    }
  };

  return (
    <Stack
      flexGrow={1}
      p={2}
      spacing={2.5}
      sx={{ overflowY: 'auto', height: '100%', width: '100%', display: { xs: 'none', md: 'flex' } }}
    >
      {leafItemGroups.map((group, index) => (
        <Stack key={index} spacing={1}>
          <Typography
            variant="caption"
            fontWeight={400}
            sx={(theme) => ({ color: theme.palette.grey[700] })}
          >
            {group.parentPath}
          </Typography>
          {group.leafItems.map((item) => (
            <CodeAccordion
              type={item.itemType}
              title={`${item.label}`}
              expanded={item.id === selectedItem}
              onChange={() => handleChange(item.id)}
              code={item.code}
              language={item.language}
            />
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
