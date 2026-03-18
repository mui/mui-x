import { createRenderer, screen } from '@mui/internal-test-utils';
import { describeConformance } from 'test/utils/charts/describeConformance';
import { FunnelChart, funnelClasses } from '@mui/x-charts-pro/FunnelChart';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { isJSDOM } from 'test/utils/skipIf';

const config = {
  series: [{ data: [{ value: 200 }, { value: 100 }] }],
  margin: { top: 0, left: 0, bottom: 0, right: 0 },
  width: 400,
  height: 400,
  hideLegend: true,
} as const;

describe('FunnelChart', () => {
  const { render } = createRenderer();

  describeConformance(
    <FunnelChart height={100} width={100} series={[{ data: [{ value: 100 }, { value: 50 }] }]} />,
    () => ({
      classes: {} as any,
      inheritComponent: 'div',
      render,
      muiName: 'MuiFunnelChart',
      testComponentPropWith: 'div',
      refInstanceof: window.HTMLDivElement,
    }),
  );

  it('should render "No data to display" when axes are empty arrays', () => {
    render(<FunnelChart series={[]} width={100} height={100} />);

    expect(screen.getByText('No data to display')).toBeVisible();
  });

  describe('classes', () => {
    it('should apply root class to the funnel plot', () => {
      const { container } = render(<FunnelChart {...config} />);

      expect(container.querySelector(`.${funnelClasses.root}`)).toBeTruthy();
    });

    it('should apply section class to each funnel section element', () => {
      const { container } = render(<FunnelChart {...config} />);

      const sections = container.querySelectorAll(`.${funnelClasses.section}`);
      expect(sections.length).to.equal(2);
    });

    it('should apply sectionFilled class when variant is "filled"', () => {
      const { container } = render(
        <FunnelChart
          {...config}
          series={[{ data: [{ value: 200 }, { value: 100 }], variant: 'filled' }]}
        />,
      );

      const sections = container.querySelectorAll(`.${funnelClasses.sectionFilled}`);
      expect(sections.length).to.equal(2);
    });

    it('should apply sectionOutlined class when variant is "outlined"', () => {
      const { container } = render(
        <FunnelChart
          {...config}
          series={[{ data: [{ value: 200 }, { value: 100 }], variant: 'outlined' }]}
        />,
      );

      const sections = container.querySelectorAll(`.${funnelClasses.sectionOutlined}`);
      expect(sections.length).to.equal(2);
    });

    it('should apply sectionFilled class by default', () => {
      const { container } = render(<FunnelChart {...config} />);

      const sections = container.querySelectorAll(`.${funnelClasses.sectionFilled}`);
      expect(sections.length).to.equal(2);
    });

    it('should apply sectionLabel class to label elements', () => {
      const { container } = render(
        <FunnelChart
          {...config}
          series={[
            {
              data: [
                { value: 200, label: 'A' },
                { value: 100, label: 'B' },
              ],
              sectionLabel: {},
            },
          ]}
        />,
      );

      const labels = container.querySelectorAll(`.${funnelClasses.sectionLabel}`);
      expect(labels.length).to.equal(2);
    });
  });

  describe.skipIf(isJSDOM)('theme style overrides', () => {
    it('should apply MuiFunnelChart section style overrides from the theme', () => {
      const theme = createTheme({
        components: {
          MuiFunnelChart: {
            styleOverrides: {
              section: {
                strokeDashoffset: 10,
              },
            },
          },
        },
      });

      const { container } = render(
        <ThemeProvider theme={theme}>
          <FunnelChart {...config} />
        </ThemeProvider>,
      );

      const section = container.querySelector<SVGElement>(`.${funnelClasses.section}`);
      expect(section).not.to.equal(null);
      expect(section).toHaveComputedStyle({ strokeDashoffset: '10px' });
    });

    it('should apply MuiFunnelChart sectionLabel style overrides from the theme', () => {
      const theme = createTheme({
        components: {
          MuiFunnelChart: {
            styleOverrides: {
              sectionLabel: {
                strokeDashoffset: 10,
              },
            },
          },
        },
      });

      const { container } = render(
        <ThemeProvider theme={theme}>
          <FunnelChart
            {...config}
            series={[
              {
                data: [
                  { value: 200, label: 'A' },
                  { value: 100, label: 'B' },
                ],
                sectionLabel: {},
              },
            ]}
          />
        </ThemeProvider>,
      );

      const label = container.querySelector<SVGElement>(`.${funnelClasses.sectionLabel}`);
      expect(label).not.to.equal(null);
      expect(label).toHaveComputedStyle({ strokeDashoffset: '10px' });
    });
  });

  describe.skipIf(isJSDOM)('gap', () => {
    it('should properly distance sections based on gap', async () => {
      render(<FunnelChart {...config} gap={13} />);
      const paths = document.querySelectorAll<HTMLElement>('path.MuiFunnelSection-root');

      const firstBCR = paths[0].getBoundingClientRect();
      const secondBCR = paths[1].getBoundingClientRect();
      expect(firstBCR.bottom).to.equal(
        secondBCR.top - 13,
        'The gap should be respected between sections',
      );
    });
  });
});
