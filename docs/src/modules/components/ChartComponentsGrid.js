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
      title: 'Bar Chart',
      href: '/x/react-charts/bars/',
    },
    {
      title: 'Line Chart',
      href: '/x/react-charts/lines/',
    },
    {
      title: 'Area Chart',
      href: '/x/react-charts/areas-demo/',
    },
    {
      title: 'Pie (Donut) Chart',
      href: '/x/react-charts/pie/',
    },
    {
      title: 'Scatter Chart',
      href: '/x/react-charts/scatter/',
    },
    {
      title: 'Sparkline',
      href: '/x/react-charts/sparkline/',
    },
    {
      title: 'Gauge',
      href: '/x/react-charts/gauge/',
    },
    {
      title: 'Radar Chart',
      href: '/x/react-charts/radar/',
    },
    {
      title: 'Heatmap',
      href: '/x/react-charts/heatmap/',
      pro: true,
    },
    {
      title: 'Funnel Chart',
      href: '/x/react-charts/funnel/',
      pro: true,
    },
    {
      title: 'Pyramid Chart',
      href: '/x/react-charts/pyramid/',
      pro: true,
    },
    {
      title: 'Sankey Chart',
      href: '/x/react-charts/sankey/',
      pro: true,
    },
    {
      title: 'Range Bar Chart',
      href: '/x/react-charts/range-bar/',
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
