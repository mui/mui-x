import { RadarGridClasses } from './radarGridClasses';

export interface RadarGridProps {
  /**
   * The number of divisions in the radar grid.
   * @default 5
   */
  divisions?: number;
  /**
   * The grid shape.
   * @default 'sharp'
   */
  shape?: 'sharp' | 'circular';
  /**
   * Get stripe fill color. Set it to `null` to remove stripes
   * @param {number} index The index of the stripe band.
   * @returns {string} The color to fill the stripe.
   * @default (index) => index % 2 === 1 ? (theme.vars || theme).palette.text.primary : 'none'
   */
  stripeColor?: ((index: number) => string) | null;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<RadarGridClasses>;
}

export interface RadarGridRenderProps extends Pick<RadarGridProps, 'classes'> {
  center: {
    x: number;
    y: number;
  };
  corners: { x: number; y: number }[];
  divisions: number;
  radius: number;
  strokeColor: string;
}

export interface RadarGridStripeRenderProps
  extends Pick<RadarGridProps, 'stripeColor' | 'classes'> {
  center: {
    x: number;
    y: number;
  };
  corners: { x: number; y: number }[];
  divisions: number;
  radius: number;
}
