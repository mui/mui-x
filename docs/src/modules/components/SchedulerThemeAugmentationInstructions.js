import SchedulerPlanCode from './SchedulerPlanCode';

const getCode = (licenceType, componentPackage) =>
  [
    `import type {} from '${componentPackage}/theme-augmentation';`,
    '',
    'const theme = createTheme({',
    '  components: {',
    '    MuiEventCalendar: {',
    '      styleOverrides: {',
    '        root: {',
    "          backgroundColor: 'lightblue',",
    '        },',
    '      },',
    '    },',
    '  },',
    '});',
  ].join('\n');

export default function SchedulerThemeAugmentationInstructions() {
  return <SchedulerPlanCode getCode={getCode} />;
}
