import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Link } from '@mui/docs/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircleIcon from '@mui/icons-material/Circle';

function getComponents() {
  return [
    {
      title: 'Linear Gauge',
      href: 'https://github.com/mui/mui-x/issues/13084',
    },
    {
      title: 'Bubble Chart',
      href: 'https://github.com/mui/mui-x/issues/17275',
    },
    {
      title: 'Range Area',
      href: 'https://github.com/mui/mui-x/issues/13988',
      premium: true,
    },
    {
      title: 'Treemap',
      href: '/x/react-charts/treemap/',
      pro: true,
    },
    {
      title: 'Maps',
      href: 'https://github.com/mui/mui-x/issues/12690',
      pro: true,
    },
    {
      title: 'Polar Line Chart',
      href: 'https://github.com/mui/mui-x/issues/17305',
      pro: true,
    },
    {
      title: 'Chord Chart',
      href: 'https://github.com/mui/mui-x/issues/19070',
      pro: true,
    },
    {
      title: 'Waterfall Chart',
      href: 'https://github.com/mui/mui-x/issues/11318',
      premium: true,
    },
    {
      title: 'Gantt Chart',
      href: '/x/react-charts/gantt/',
      premium: true,
    },
    {
      title: 'Boxplot Chart',
      href: 'https://github.com/mui/mui-x/issues/15025',
      premium: true,
    },
    {
      title: 'OHLC Chart',
      href: 'https://github.com/mui/mui-x/issues/13045',
      premium: true,
    },
    {
      title: 'Sunburst Chart',
      href: 'https://github.com/mui/mui-x/issues/11319',
      premium: true,
    },
    {
      title: '3D Chart',
      href: 'https://github.com/mui/mui-x/issues/18825',
      premium: true,
    },
  ];
}

export default function ChartComponentsGrid() {
  return (
    <List dense>
      {getComponents().map((component) => (
        <ListItem key={component.title}>
          <ListItemText
            primary={
              <Stack direction="row" alignItems="center" spacing={1}>
                <CircleIcon sx={{ fontSize: 10 }} />
                <Link
                  href={component.href}
                  underline="hover"
                  sx={{ fontWeight: 500, fontSize: 16 }}
                  pl={0.5}
                >
                  {component.title}
                </Link>
                {component.pro && <span className="plan-pro" />}
                {component.premium && <span className="plan-premium" />}
                {component.planned && (
                  <Chip
                    label="Planned"
                    size="small"
                    variant="outlined"
                    color="grey"
                    sx={(theme) => ({
                      height: 20,
                      backgroundColor: 'grey.50',
                      borderColor: 'grey.200',
                      '.MuiChip-label': {
                        px: '6px',
                        fontSize: '0.65rem',
                        letterSpacing: '.04rem',
                        textTransform: 'uppercase',
                        color: 'text.primary',
                      },
                      ...theme.applyDarkStyles({
                        backgroundColor: 'divider',
                        borderColor: 'divider',
                      }),
                    })}
                  />
                )}
              </Stack>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}
