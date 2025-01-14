import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { describeConformance } from 'test/utils/describeConformance';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ChartsLabelGradient } from '@mui/x-charts/ChartsLabel/ChartsLabelGradient';
import { labelGradientClasses } from '@mui/x-charts/ChartsLabel';
import { expect } from 'chai';
import { describeSkipIf, isJSDOM } from 'test/utils/skipIf';
import RtlProvider from '@mui/system/RtlProvider';

describe('<ChartsLabelGradient />', () => {
  const { render } = createRenderer();

  describeConformance(<ChartsLabelGradient gradientId="gradient.test-id" />, () => ({
    classes: labelGradientClasses,
    inheritComponent: 'div',
    render: (node) =>
      render(node, {
        wrapper: ({ children }) => (
          <React.Fragment>
            {children}
            <Gradient id="gradient.test-id" />
          </React.Fragment>
        ),
      }),
    muiName: 'MuiChartsLabelGradient',
    testComponentPropWith: 'div',
    refInstanceof: window.HTMLDivElement,
    ThemeProvider,
    createTheme,
    // SKIP
    skip: ['themeVariants', 'componentProp', 'componentsProp'],
  }));

  // JSDOM does not support SVGMatrix
  describeSkipIf(isJSDOM)('rotation', () => {
    const matrixToRotation = (element: SVGSVGElement | null) => {
      if (!element) {
        throw new Error('Svg element not found');
      }

      const matrix = new DOMMatrix(getComputedStyle(element).transform);
      return (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI;
    };

    describe('horizontal', () => {
      it('should render a gradient in the correct orientation', () => {
        const { container } = render(<ChartsLabelGradient gradientId="gradient.test-id" />);
        const svg = container.querySelector('svg');
        expect(matrixToRotation(svg)).to.equal(0);
      });

      it('should reverse the gradient', () => {
        const { container } = render(<ChartsLabelGradient gradientId="gradient.test-id" reverse />);
        const svg = container.querySelector('svg');
        expect(matrixToRotation(svg)).to.equal(180);
      });

      it('should rotate the gradient', () => {
        const { container } = render(<ChartsLabelGradient gradientId="gradient.test-id" rotate />);
        const svg = container.querySelector('svg');
        expect(matrixToRotation(svg)).to.equal(90);
      });

      it('should reverse and rotate the gradient', () => {
        const { container } = render(
          <ChartsLabelGradient gradientId="gradient.test-id" reverse rotate />,
        );
        const svg = container.querySelector('svg');
        expect(matrixToRotation(svg)).to.equal(-90);
      });
    });

    describe('vertical', () => {
      it('should render a gradient in the correct orientation', () => {
        const { container } = render(
          <ChartsLabelGradient gradientId="gradient.test-id" direction="vertical" />,
        );
        const svg = container.querySelector('svg');
        expect(matrixToRotation(svg)).to.equal(-90);
      });

      it('should reverse the gradient', () => {
        const { container } = render(
          <ChartsLabelGradient gradientId="gradient.test-id" direction="vertical" reverse />,
        );
        const svg = container.querySelector('svg');
        expect(matrixToRotation(svg)).to.equal(90);
      });

      it('should rotate the gradient', () => {
        const { container } = render(
          <ChartsLabelGradient gradientId="gradient.test-id" direction="vertical" rotate />,
        );
        const svg = container.querySelector('svg');
        expect(matrixToRotation(svg)).to.equal(0);
      });

      it('should reverse and rotate the gradient', () => {
        const { container } = render(
          <ChartsLabelGradient gradientId="gradient.test-id" direction="vertical" reverse rotate />,
        );
        const svg = container.querySelector('svg');
        expect(matrixToRotation(svg)).to.equal(180);
      });
    });

    describe('RTL', () => {
      describe('horizontal', () => {
        it('should render a gradient in the correct orientation', () => {
          const { container } = render(<ChartsLabelGradient gradientId="gradient.test-id" />, {
            wrapper: RtlWrapper,
          });
          const svg = container.querySelector('svg');
          // Technically it is -180, but the browser will normalize it to 180
          expect(matrixToRotation(svg)).to.equal(180);
        });

        it('should reverse the gradient', () => {
          const { container } = render(
            <ChartsLabelGradient gradientId="gradient.test-id" reverse />,
            { wrapper: RtlWrapper },
          );
          const svg = container.querySelector('svg');
          expect(matrixToRotation(svg)).to.equal(0);
        });

        it('should rotate the gradient', () => {
          const { container } = render(
            <ChartsLabelGradient gradientId="gradient.test-id" rotate />,
            { wrapper: RtlWrapper },
          );
          const svg = container.querySelector('svg');
          expect(matrixToRotation(svg)).to.equal(-90);
        });

        it('should reverse and rotate the gradient', () => {
          const { container } = render(
            <ChartsLabelGradient gradientId="gradient.test-id" reverse rotate />,
            { wrapper: RtlWrapper },
          );
          const svg = container.querySelector('svg');
          expect(matrixToRotation(svg)).to.equal(90);
        });
      });

      describe('vertical', () => {
        it('should render a gradient in the correct orientation', () => {
          const { container } = render(
            <ChartsLabelGradient gradientId="gradient.test-id" direction="vertical" />,
            { wrapper: RtlWrapper },
          );
          const svg = container.querySelector('svg');
          expect(matrixToRotation(svg)).to.equal(-90);
        });

        it('should reverse the gradient', () => {
          const { container } = render(
            <ChartsLabelGradient gradientId="gradient.test-id" direction="vertical" reverse />,
            { wrapper: RtlWrapper },
          );
          const svg = container.querySelector('svg');
          expect(matrixToRotation(svg)).to.equal(90);
        });

        it('should rotate the gradient', () => {
          const { container } = render(
            <ChartsLabelGradient gradientId="gradient.test-id" direction="vertical" rotate />,
            { wrapper: RtlWrapper },
          );
          const svg = container.querySelector('svg');
          expect(matrixToRotation(svg)).to.equal(0);
        });

        it('should reverse and rotate the gradient', () => {
          const { container } = render(
            <ChartsLabelGradient
              gradientId="gradient.test-id"
              direction="vertical"
              reverse
              rotate
            />,
            { wrapper: RtlWrapper },
          );
          const svg = container.querySelector('svg');
          expect(matrixToRotation(svg)).to.equal(180);
        });
      });
    });
  });
});

function Gradient({ id }: any) {
  return (
    <svg width="0" height="0" viewBox="0 0 0 0" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#CAD4EE" />
          <stop offset="0.5" stopColor="#4254FB" />
          <stop offset="1" stopColor="#091159" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function RtlWrapper({ children }: any) {
  return (
    <RtlProvider value>
      <div dir="rtl">{children}</div>
    </RtlProvider>
  );
}
