// Dataset from https://www.kaggle.com/datasets/datascientist97/astronomical-data/data
// Temperature (K): Dive into the thermal properties of stars, crucial for understanding their lifecycle and energy output.
// Luminosity (L/Lo): Explore stellar brightness relative to our Sun (Lo = 3.828 x 10^26 Watts), offering insights into star size and energy production.
// Radius (R/Ro): Compare star sizes to our Sun (Ro = 6.995 x 10^8 m), essential for grasping stellar evolution and structure.
// Absolute Magnitude (Mv): Analyze intrinsic stellar brightness, standardized for comparative studies across vast cosmic distances.
// Star Type: Categorize celestial objects into six classes (0-Brown Dwarf, 1-Red Dwarf, 2-White Dwarf, 3-Main Sequence, 4-Supergiants, 5-Hypergiants), ideal for classification tasks.
// Star Color: Visualize the spectrum of stellar hues, providing clues about temperature and composition.
// Spectral Class: Examine the visual signatures of stars, offering insights into their chemical makeup and evolutionary stage.

export const stars = [
  {
    temperatureInK: 3042,
    luminosity: 0.0005,
    radius: 0.1542,
    absoluteMagnitude: 16.6,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2600,
    luminosity: 0.0003,
    radius: 0.102,
    absoluteMagnitude: 18.7,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2800,
    luminosity: 0.0002,
    radius: '',
    absoluteMagnitude: 16.65,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 1939,
    luminosity: 0.000138,
    radius: 0.103,
    absoluteMagnitude: 20.06,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2840,
    luminosity: 0,
    radius: 0.11,
    absoluteMagnitude: 16.98,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2637,
    luminosity: 0.00073,
    radius: 0.127,
    absoluteMagnitude: 17.22,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2600,
    luminosity: 0.0004,
    radius: 0.096,
    absoluteMagnitude: 17.4,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2650,
    luminosity: 0.00069,
    radius: 0.11,
    absoluteMagnitude: 17.45,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2700,
    luminosity: 0.00018,
    radius: 0.13,
    absoluteMagnitude: 16.05,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3600,
    luminosity: 0,
    radius: 0.51,
    absoluteMagnitude: 10.69,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3129,
    luminosity: 0.0122,
    radius: 0.3761,
    absoluteMagnitude: 11.79,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3134,
    luminosity: 0.0004,
    radius: 0.196,
    absoluteMagnitude: 13.21,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3628,
    luminosity: 0.0055,
    radius: 0.393,
    absoluteMagnitude: 10.48,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2650,
    luminosity: 0.0006,
    radius: 0.14,
    absoluteMagnitude: 11.782,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3340,
    luminosity: 0.0038,
    radius: 0.24,
    absoluteMagnitude: 13.07,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2799,
    luminosity: 0.0018,
    radius: 0.16,
    absoluteMagnitude: 14.79,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3692,
    luminosity: 0.00367,
    radius: 0.47,
    absoluteMagnitude: 10.8,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3192,
    luminosity: 0,
    radius: 0.1967,
    absoluteMagnitude: 13.53,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3441,
    luminosity: 0.039,
    radius: 0.351,
    absoluteMagnitude: 11.18,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 25000,
    luminosity: 0.056,
    radius: 0.0084,
    absoluteMagnitude: 10.58,
    type: 2,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 7740,
    luminosity: 0.00049,
    radius: 0.01234,
    absoluteMagnitude: 14.02,
    type: 2,
    color: 'White',
    class: 'A',
  },
  {
    temperatureInK: 7220,
    luminosity: 0.00017,
    radius: 0.011,
    absoluteMagnitude: 14.23,
    type: 2,
    color: 'White',
    class: 'F',
  },
  {
    temperatureInK: 8500,
    luminosity: 0.0005,
    radius: 0.01,
    absoluteMagnitude: 14.5,
    type: 2,
    color: '',
    class: 'A',
  },
  {
    temperatureInK: 16500,
    luminosity: 0.013,
    radius: 0.014,
    absoluteMagnitude: 11.89,
    type: 2,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 12990,
    luminosity: 0.000085,
    radius: 0.00984,
    absoluteMagnitude: 12.23,
    type: 2,
    color: 'Yellow-White',
    class: 'F',
  },
  {
    temperatureInK: 8570,
    luminosity: 0.00081,
    radius: 0.0097,
    absoluteMagnitude: 14.2,
    type: 2,
    color: 'Blue-White',
    class: 'A',
  },
  {
    temperatureInK: 7700,
    luminosity: 0.00011,
    radius: 0.0128,
    absoluteMagnitude: 14.47,
    type: 2,
    color: 'Yellow-White',
    class: 'F',
  },
  {
    temperatureInK: 11790,
    luminosity: 0.00015,
    radius: 0.011,
    absoluteMagnitude: 12.59,
    type: 2,
    color: 'Yellow-White',
    class: 'F',
  },
  {
    temperatureInK: 7230,
    luminosity: 0.00008,
    radius: 0.013,
    absoluteMagnitude: 14.08,
    type: 2,
    color: 'Red',
    class: 'F',
  },
  {
    temperatureInK: 39000,
    luminosity: 204000,
    radius: 10.6,
    absoluteMagnitude: -4.7,
    type: 3,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 30000,
    luminosity: 28840,
    radius: 6.3,
    absoluteMagnitude: -4.2,
    type: 3,
    color: '',
    class: 'B',
  },
  {
    temperatureInK: 15276,
    luminosity: 1136,
    radius: 7.2,
    absoluteMagnitude: -1.97,
    type: 3,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 9700,
    luminosity: 74,
    radius: 2.89,
    absoluteMagnitude: 0.16,
    type: 3,
    color: 'White',
    class: 'B',
  },
  {
    temperatureInK: 5800,
    luminosity: 0.81,
    radius: 0.9,
    absoluteMagnitude: 5.05,
    type: 3,
    color: 'Yellow-White',
    class: 'F',
  },
  {
    temperatureInK: 8052,
    luminosity: 8.7,
    radius: 1.8,
    absoluteMagnitude: 2.42,
    type: 3,
    color: 'White',
    class: 'A',
  },
  {
    temperatureInK: 6757,
    luminosity: 1.43,
    radius: 1.12,
    absoluteMagnitude: 2.41,
    type: 3,
    color: 'Yellow-White',
    class: 'F',
  },
  {
    temperatureInK: 5936,
    luminosity: 1.357,
    radius: 1.106,
    absoluteMagnitude: 4.46,
    type: 3,
    color: 'Yellow-White',
    class: 'F',
  },
  {
    temperatureInK: 5587,
    luminosity: 0.819,
    radius: 0.99,
    absoluteMagnitude: 5.03,
    type: 3,
    color: 'Yellow-White',
    class: 'F',
  },
  {
    temperatureInK: 3826,
    luminosity: 200000,
    radius: 19,
    absoluteMagnitude: -6.93,
    type: 4,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3365,
    luminosity: 340000,
    radius: 23,
    absoluteMagnitude: -6.2,
    type: 4,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3270,
    luminosity: 150000,
    radius: 88,
    absoluteMagnitude: -6.02,
    type: 4,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3200,
    luminosity: 195000,
    radius: 17,
    absoluteMagnitude: -7.22,
    type: 4,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3008,
    luminosity: 0,
    radius: 25,
    absoluteMagnitude: -6,
    type: 4,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3600,
    luminosity: 320000,
    radius: 29,
    absoluteMagnitude: -6.6,
    type: 4,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3575,
    luminosity: 123000,
    radius: 45,
    absoluteMagnitude: -6.78,
    type: 4,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3574,
    luminosity: 200000,
    radius: 89,
    absoluteMagnitude: -5.24,
    type: 4,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3625,
    luminosity: 184000,
    radius: 84,
    absoluteMagnitude: -6.74,
    type: 4,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 33750,
    luminosity: 220000,
    radius: 26,
    absoluteMagnitude: -6.1,
    type: 4,
    color: 'Blue',
    class: 'B',
  },
  {
    temperatureInK: 3490,
    luminosity: 270000,
    radius: 1520,
    absoluteMagnitude: -9.4,
    type: 5,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3834,
    luminosity: 272000,
    radius: 1183,
    absoluteMagnitude: -9.2,
    type: 5,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3749,
    luminosity: 550000,
    radius: 1648,
    absoluteMagnitude: -8.05,
    type: 5,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3650,
    luminosity: 310000,
    radius: 1324,
    absoluteMagnitude: -7.79,
    type: 5,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3450,
    luminosity: 263000,
    radius: 1349,
    absoluteMagnitude: -11.75,
    type: 5,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3660,
    luminosity: 363000,
    radius: 1673,
    absoluteMagnitude: -11.92,
    type: 5,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3450,
    luminosity: 174000,
    radius: 1284,
    absoluteMagnitude: -11.28,
    type: 5,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3535,
    luminosity: 195000,
    radius: 1546,
    absoluteMagnitude: -11.36,
    type: 5,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3341,
    luminosity: 0.0056,
    radius: 0.057,
    absoluteMagnitude: 16.23,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3432,
    luminosity: 0.00067,
    radius: 0.19,
    absoluteMagnitude: 16.94,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2983,
    luminosity: 0.00024,
    radius: 0.094,
    absoluteMagnitude: 16.09,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2835,
    luminosity: 0.00034,
    radius: 0.0918,
    absoluteMagnitude: 16.96,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2935,
    luminosity: 0.00014,
    radius: 0.116,
    absoluteMagnitude: 18.89,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3295,
    luminosity: 0.00098,
    radius: '',
    absoluteMagnitude: 17.13,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2945,
    luminosity: 0.00032,
    radius: 0.093,
    absoluteMagnitude: 18.34,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2817,
    luminosity: 0.00098,
    radius: 0.0911,
    absoluteMagnitude: 16.45,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2774,
    luminosity: 0.00036,
    radius: 0.118,
    absoluteMagnitude: 17.39,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2871,
    luminosity: 0.00072,
    radius: 0.12,
    absoluteMagnitude: 19.43,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3345,
    luminosity: 0.021,
    radius: 0.273,
    absoluteMagnitude: 12.3,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3607,
    luminosity: 0.022,
    radius: 0.38,
    absoluteMagnitude: 10.12,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3150,
    luminosity: 0.0088,
    radius: 0.35,
    absoluteMagnitude: 11.94,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3550,
    luminosity: 0.004,
    radius: 0.291,
    absoluteMagnitude: 10.89,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3180,
    luminosity: 0.001,
    radius: 0.35,
    absoluteMagnitude: 11.76,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2890,
    luminosity: 0.0034,
    radius: 0.24,
    absoluteMagnitude: 13.46,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3342,
    luminosity: 0.0015,
    radius: 0.307,
    absoluteMagnitude: 11.87,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2621,
    luminosity: 0.0006,
    radius: 0.098,
    absoluteMagnitude: 12.81,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3158,
    luminosity: 0.00135,
    radius: 0.161,
    absoluteMagnitude: 13.98,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 7100,
    luminosity: 0.00029,
    radius: 0.012,
    absoluteMagnitude: 14.09,
    type: 2,
    color: 'Yellow-White',
    class: 'F',
  },
  {
    temperatureInK: 10574,
    luminosity: 0.00014,
    radius: '',
    absoluteMagnitude: 12.02,
    type: 2,
    color: 'White',
    class: 'F',
  },
  {
    temperatureInK: 8930,
    luminosity: 0.00056,
    radius: 0.0095,
    absoluteMagnitude: 13.78,
    type: 2,
    color: 'White',
    class: 'A',
  },
  {
    temperatureInK: 17200,
    luminosity: 0.00098,
    radius: 0.015,
    absoluteMagnitude: 12.45,
    type: 2,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 14100,
    luminosity: 0.00067,
    radius: 0.0089,
    absoluteMagnitude: 12.17,
    type: 2,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 9675,
    luminosity: 0.00045,
    radius: 0.0109,
    absoluteMagnitude: 13.98,
    type: 2,
    color: 'Blue-White',
    class: 'A',
  },
  {
    temperatureInK: 12010,
    luminosity: 0.00078,
    radius: 0.0092,
    absoluteMagnitude: 12.13,
    type: 2,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 10980,
    luminosity: 0.00074,
    radius: 0.0087,
    absoluteMagnitude: 11.19,
    type: 2,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 13720,
    luminosity: 0.00018,
    radius: 0.00892,
    absoluteMagnitude: 12.97,
    type: 2,
    color: 'White',
    class: 'F',
  },
  {
    temperatureInK: 19860,
    luminosity: 0,
    radius: 0.0131,
    absoluteMagnitude: 11.34,
    type: 2,
    color: 'Blue',
    class: 'B',
  },
  {
    temperatureInK: 5300,
    luminosity: 0.59,
    radius: 0.91,
    absoluteMagnitude: 5.49,
    type: 3,
    color: 'Yellow-White',
    class: 'F',
  },
  {
    temperatureInK: 4526,
    luminosity: 0.153,
    radius: 0.865,
    absoluteMagnitude: 6.506,
    type: 3,
    color: '',
    class: 'K',
  },
  {
    temperatureInK: 4077,
    luminosity: 0.085,
    radius: 0.795,
    absoluteMagnitude: 6.228,
    type: 3,
    color: 'Yellow-White',
    class: 'K',
  },
  {
    temperatureInK: 4980,
    luminosity: 0.357,
    radius: 1.13,
    absoluteMagnitude: 4.78,
    type: 3,
    color: 'Yellow-White',
    class: 'K',
  },
  {
    temperatureInK: 9030,
    luminosity: 45,
    radius: 2.63,
    absoluteMagnitude: 1.45,
    type: 3,
    color: 'Blue-White',
    class: 'A',
  },
  {
    temperatureInK: 11250,
    luminosity: 672,
    radius: 6.98,
    absoluteMagnitude: -2.3,
    type: 3,
    color: 'Blue-White',
    class: 'A',
  },
  {
    temperatureInK: 5112,
    luminosity: 0.63,
    radius: 0.876,
    absoluteMagnitude: 4.68,
    type: 3,
    color: 'Red',
    class: 'K',
  },
  {
    temperatureInK: 7720,
    luminosity: 7.92,
    radius: 1.34,
    absoluteMagnitude: 2.44,
    type: 3,
    color: 'Yellow-White',
    class: 'F',
  },
  {
    temperatureInK: 12098,
    luminosity: 689,
    radius: 7.01,
    absoluteMagnitude: 0.02,
    type: 3,
    color: 'Blue-White',
    class: 'A',
  },
  {
    temperatureInK: 36108,
    luminosity: 198000,
    radius: 10.2,
    absoluteMagnitude: -4.4,
    type: 3,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 33300,
    luminosity: 240000,
    radius: '',
    absoluteMagnitude: -6.5,
    type: 4,
    color: '',
    class: 'B',
  },
  {
    temperatureInK: 40000,
    luminosity: 813000,
    radius: 14,
    absoluteMagnitude: -6.23,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 23000,
    luminosity: 127000,
    radius: 36,
    absoluteMagnitude: -5.76,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 17120,
    luminosity: 235000,
    radius: 83,
    absoluteMagnitude: -6.89,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 11096,
    luminosity: 112000,
    radius: 12,
    absoluteMagnitude: -5.91,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 14245,
    luminosity: 231000,
    radius: 42,
    absoluteMagnitude: -6.12,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 24630,
    luminosity: 363000,
    radius: 63,
    absoluteMagnitude: -5.83,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 12893,
    luminosity: 184000,
    radius: 36,
    absoluteMagnitude: -6.34,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 24345,
    luminosity: 142000,
    radius: 57,
    absoluteMagnitude: -6.24,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 33421,
    luminosity: 352000,
    radius: 67,
    absoluteMagnitude: -5.79,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 3459,
    luminosity: 100000,
    radius: 1289,
    absoluteMagnitude: -10.7,
    type: 5,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3605,
    luminosity: 126000,
    radius: 1124,
    absoluteMagnitude: -10.81,
    type: 5,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3615,
    luminosity: 200000,
    radius: 1635,
    absoluteMagnitude: -11.33,
    type: 5,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3399,
    luminosity: 117000,
    radius: 1486,
    absoluteMagnitude: -10.92,
    type: 5,
    color: 'Red',
    class: 'M',
  },

  {
    temperatureInK: 3553,
    luminosity: 145000,
    radius: 1324,
    absoluteMagnitude: -11.03,
    type: 5,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 4015,
    luminosity: 282000,
    radius: 1534,
    absoluteMagnitude: -11.39,
    type: 5,
    color: 'Red',
    class: 'K',
  },
  {
    temperatureInK: 3625,
    luminosity: 74000,
    radius: 876,
    absoluteMagnitude: -10.25,
    type: 5,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 6850,
    luminosity: 229000,
    radius: 1467,
    absoluteMagnitude: -10.07,
    type: 5,
    color: 'Red',
    class: 'G',
  },
  {
    temperatureInK: 3780,
    luminosity: 200000,
    radius: 1324,
    absoluteMagnitude: -10.7,
    type: 5,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3323,
    luminosity: 0.00043,
    radius: 0.0912,
    absoluteMagnitude: 17.16,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3531,
    luminosity: 0.00093,
    radius: 0.0976,
    absoluteMagnitude: 19.94,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3218,
    luminosity: 0.00054,
    radius: 0.11,
    absoluteMagnitude: 20.02,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3146,
    luminosity: 0.00015,
    radius: 0.0932,
    absoluteMagnitude: 16.92,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3511,
    luminosity: 0.00064,
    radius: 0.109,
    absoluteMagnitude: 17.12,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3225,
    luminosity: 0.00076,
    radius: 0.121,
    absoluteMagnitude: 19.63,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2935,
    luminosity: 0.00087,
    radius: 0.0932,
    absoluteMagnitude: 16.88,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2861,
    luminosity: 0.00019,
    radius: 0.0899,
    absoluteMagnitude: 16.71,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2856,
    luminosity: 0.000896,
    radius: 0.0782,
    absoluteMagnitude: 19.56,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2731,
    luminosity: 0.000437,
    radius: 0.0856,
    absoluteMagnitude: 18.09,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3095,
    luminosity: 0.00019,
    radius: 0.492,
    absoluteMagnitude: 10.87,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3607,
    luminosity: 0.00023,
    radius: 0.38,
    absoluteMagnitude: 10.34,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3100,
    luminosity: 0.008,
    radius: 0.31,
    absoluteMagnitude: 11.17,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2989,
    luminosity: 0.0087,
    radius: 0.34,
    absoluteMagnitude: 13.12,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3542,
    luminosity: 0.0009,
    radius: 0.62,
    absoluteMagnitude: 14.23,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3243,
    luminosity: 0.0023,
    radius: 0.73,
    absoluteMagnitude: 14.75,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3091,
    luminosity: 0.0081,
    radius: 0.24,
    absoluteMagnitude: 11.43,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3598,
    luminosity: 0.0011,
    radius: 0.56,
    absoluteMagnitude: 14.26,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3324,
    luminosity: 0.0034,
    radius: 0.34,
    absoluteMagnitude: 12.23,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3541,
    luminosity: 0.0013,
    radius: 0.256,
    absoluteMagnitude: 14.33,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 13420,
    luminosity: 0.00059,
    radius: 0.00981,
    absoluteMagnitude: 13.67,
    type: 2,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 18290,
    luminosity: 0.0013,
    radius: 0.00934,
    absoluteMagnitude: 12.78,
    type: 2,
    color: 'Blue',
    class: 'B',
  },
  {
    temperatureInK: 14520,
    luminosity: 0.00082,
    radius: 0.00972,
    absoluteMagnitude: 11.92,
    type: 2,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 11900,
    luminosity: 0.00067,
    radius: 0.00898,
    absoluteMagnitude: 11.38,
    type: 2,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 8924,
    luminosity: 0.00028,
    radius: 0.00879,
    absoluteMagnitude: 14.87,
    type: 2,
    color: 'Blue-White',
    class: 'A',
  },
  {
    temperatureInK: 12912,
    luminosity: 0.00071,
    radius: 0.00945,
    absoluteMagnitude: 12.83,
    type: 2,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 14732,
    luminosity: 0.00011,
    radius: 0.00892,
    absoluteMagnitude: 12.89,
    type: 2,
    color: 'White',
    class: 'F',
  },
  {
    temperatureInK: 7723,
    luminosity: 0.00014,
    radius: 0.00878,
    absoluteMagnitude: 14.81,
    type: 2,
    color: 'White',
    class: 'A',
  },
  {
    temperatureInK: 12984,
    luminosity: 0.00088,
    radius: 0.00996,
    absoluteMagnitude: 11.23,
    type: 2,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 29560,
    luminosity: 188000,
    radius: 6.02,
    absoluteMagnitude: -4.01,
    type: 3,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 8945,
    luminosity: 38,
    radius: 2.487,
    absoluteMagnitude: 0.12,
    type: 3,
    color: 'Blue-White',
    class: 'A',
  },
  {
    temperatureInK: 14060,
    luminosity: 1092,
    radius: 5.745,
    absoluteMagnitude: -2.04,
    type: 3,
    color: 'Blue-White',
    class: 'A',
  },
  {
    temperatureInK: 16390,
    luminosity: 1278,
    radius: 5.68,
    absoluteMagnitude: -3.32,
    type: 3,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 25070,
    luminosity: 14500,
    radius: 5.92,
    absoluteMagnitude: -3.98,
    type: 3,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 28700,
    luminosity: 16790,
    radius: 6.4,
    absoluteMagnitude: -4.09,
    type: 3,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 26140,
    luminosity: 14520,
    radius: 5.49,
    absoluteMagnitude: -3.8,
    type: 3,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 20120,
    luminosity: 4720,
    radius: 6.78,
    absoluteMagnitude: -3.4,
    type: 3,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 13023,
    luminosity: 998,
    radius: 6.21,
    absoluteMagnitude: -1.38,
    type: 3,
    color: 'Blue-White',
    class: 'A',
  },
  {
    temperatureInK: 37800,
    luminosity: 202900,
    radius: 6.86,
    absoluteMagnitude: -4.56,
    type: 3,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 25390,
    luminosity: 223000,
    radius: 57,
    absoluteMagnitude: -5.92,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 11567,
    luminosity: 251000,
    radius: 36,
    absoluteMagnitude: -6.245,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 12675,
    luminosity: 0,
    radius: 83,
    absoluteMagnitude: -5.62,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 5752,
    luminosity: 245000,
    radius: 97,
    absoluteMagnitude: -6.63,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 8927,
    luminosity: 239000,
    radius: 35,
    absoluteMagnitude: -7.34,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 7282,
    luminosity: 131000,
    radius: 24,
    absoluteMagnitude: -7.22,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 19923,
    luminosity: 152000,
    radius: 73,
    absoluteMagnitude: -5.69,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 26373,
    luminosity: 198000,
    radius: 39,
    absoluteMagnitude: -5.83,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 17383,
    luminosity: 342900,
    radius: 30,
    absoluteMagnitude: -6.09,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 9373,
    luminosity: 424520,
    radius: 24,
    absoluteMagnitude: -5.99,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 3570,
    luminosity: 320000,
    radius: 1480,
    absoluteMagnitude: -7.58,
    type: 5,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3500,
    luminosity: 138000,
    radius: 1420,
    absoluteMagnitude: -8.18,
    type: 5,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 4287,
    luminosity: 630000,
    radius: 1315,
    absoluteMagnitude: -9.2,
    type: 5,
    color: 'Red',
    class: 'K',
  },
  {
    temperatureInK: 26000,
    luminosity: 316000,
    radius: 1679,
    absoluteMagnitude: -9.1,
    type: 5,
    color: 'Blue',
    class: 'B',
  },
  {
    temperatureInK: 3600,
    luminosity: 240000,
    radius: 1190,
    absoluteMagnitude: -7.89,
    type: 5,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 18000,
    luminosity: 200000,
    radius: 1045,
    absoluteMagnitude: -8.3,
    type: 5,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 11000,
    luminosity: 170000,
    radius: 1779,
    absoluteMagnitude: -9.9,
    type: 5,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 12100,
    luminosity: 120000,
    radius: 708.9,
    absoluteMagnitude: -7.84,
    type: 5,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 24490,
    luminosity: 248490,
    radius: 1134.5,
    absoluteMagnitude: -8.24,
    type: 5,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 2831,
    luminosity: 0.000231,
    radius: 0.0915,
    absoluteMagnitude: 16.21,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2914,
    luminosity: 0.000631,
    radius: 0.116,
    absoluteMagnitude: 18.39,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3419,
    luminosity: 0.000245,
    radius: 0.126,
    absoluteMagnitude: 17.56,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3218,
    luminosity: 0.000452,
    radius: 0.0987,
    absoluteMagnitude: 17.34,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3453,
    luminosity: 0.000621,
    radius: 0.0773,
    absoluteMagnitude: 17.08,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2889,
    luminosity: 0.000352,
    radius: 0.0973,
    absoluteMagnitude: 16.93,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2968,
    luminosity: 0.000461,
    radius: 0.119,
    absoluteMagnitude: 17.45,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3484,
    luminosity: 0.000551,
    radius: 0.0998,
    absoluteMagnitude: 16.67,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2778,
    luminosity: 0.000849,
    radius: 0.112,
    absoluteMagnitude: 19.45,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3523,
    luminosity: 0.000957,
    radius: 0.129,
    absoluteMagnitude: 16.35,
    type: 0,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3462,
    luminosity: 0.0053,
    radius: 0.148,
    absoluteMagnitude: 11.47,
    type: 1,
    color: '',
    class: 'M',
  },
  {
    temperatureInK: 3257,
    luminosity: 0.0024,
    radius: 0.46,
    absoluteMagnitude: 10.73,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 2994,
    luminosity: 0.0072,
    radius: 0.28,
    absoluteMagnitude: 13.45,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3212,
    luminosity: 0.0016,
    radius: 0.378,
    absoluteMagnitude: 12.854,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3523,
    luminosity: 0.0054,
    radius: 0.319,
    absoluteMagnitude: 12.43,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3598,
    luminosity: 0.0027,
    radius: 0.67,
    absoluteMagnitude: 13.667,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3142,
    luminosity: 0.00132,
    radius: 0.258,
    absoluteMagnitude: 14.12,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3496,
    luminosity: 0.00125,
    radius: 0.336,
    absoluteMagnitude: 14.94,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3324,
    luminosity: 0.0065,
    radius: 0.471,
    absoluteMagnitude: 12.78,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 3463,
    luminosity: 0.0027,
    radius: 0.675,
    absoluteMagnitude: 14.776,
    type: 1,
    color: 'Red',
    class: 'M',
  },
  {
    temperatureInK: 16790,
    luminosity: 0.0014,
    radius: 0.0121,
    absoluteMagnitude: 12.87,
    type: 2,
    color: 'Blue',
    class: 'B',
  },
  {
    temperatureInK: 15680,
    luminosity: 0.00122,
    radius: 0.0114,
    absoluteMagnitude: 11.92,
    type: 2,
    color: 'Blue',
    class: 'B',
  },
  {
    temperatureInK: 14982,
    luminosity: 0.00118,
    radius: 0.0113,
    absoluteMagnitude: 12.23,
    type: 2,
    color: 'Blue',
    class: 'B',
  },
  {
    temperatureInK: 13340,
    luminosity: 0.00109,
    radius: 0.0116,
    absoluteMagnitude: 12.9,
    type: 2,
    color: 'Blue',
    class: 'B',
  },
  {
    temperatureInK: 18340,
    luminosity: 0.00134,
    radius: 0.0124,
    absoluteMagnitude: 11.22,
    type: 2,
    color: 'Blue',
    class: 'B',
  },
  {
    temperatureInK: 19920,
    luminosity: 0.00156,
    radius: 0.0142,
    absoluteMagnitude: 11.34,
    type: 2,
    color: 'Blue',
    class: 'B',
  },
  {
    temperatureInK: 24020,
    luminosity: 0.00159,
    radius: 0.0127,
    absoluteMagnitude: 10.55,
    type: 2,
    color: 'Blue',
    class: 'B',
  },
  {
    temperatureInK: 23092,
    luminosity: 0.00132,
    radius: 0.0104,
    absoluteMagnitude: 10.18,
    type: 2,
    color: 'Blue',
    class: 'B',
  },
  {
    temperatureInK: 17920,
    luminosity: 0.00111,
    radius: 0.0106,
    absoluteMagnitude: 11.66,
    type: 2,
    color: 'Blue',
    class: 'B',
  },
  {
    temperatureInK: 19360,
    luminosity: 0.00125,
    radius: '',
    absoluteMagnitude: 11.62,
    type: 2,
    color: 'Blue',
    class: 'B',
  },
  {
    temperatureInK: 22350,
    luminosity: 12450,
    radius: 6.36,
    absoluteMagnitude: -3.67,
    type: 3,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 10012,
    luminosity: 552,
    radius: 5.856,
    absoluteMagnitude: 0.013,
    type: 3,
    color: 'Blue-White',
    class: 'A',
  },
  {
    temperatureInK: 13089,
    luminosity: 788,
    radius: 5.992,
    absoluteMagnitude: -0.12,
    type: 3,
    color: 'Blue-White',
    class: 'A',
  },
  {
    temperatureInK: 22012,
    luminosity: 6748,
    radius: 6.64,
    absoluteMagnitude: -2.55,
    type: 3,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 34190,
    luminosity: 198200,
    radius: 6.39,
    absoluteMagnitude: -4.57,
    type: 3,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 32460,
    luminosity: 173800,
    radius: 6.237,
    absoluteMagnitude: -4.36,
    type: 3,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 9320,
    luminosity: 29,
    radius: 1.91,
    absoluteMagnitude: 1.236,
    type: 3,
    color: 'Blue-White',
    class: 'A',
  },
  {
    temperatureInK: 19400,
    luminosity: 10920,
    radius: 6.03,
    absoluteMagnitude: -3.08,
    type: 3,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 17140,
    luminosity: 883,
    radius: 5.653,
    absoluteMagnitude: -2.64,
    type: 3,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 8250,
    luminosity: 9.25,
    radius: 1.93,
    absoluteMagnitude: -0.98,
    type: 3,
    color: 'Yellow-White',
    class: 'F',
  },
  {
    temperatureInK: 23678,
    luminosity: 244290,
    radius: 35,
    absoluteMagnitude: -6.27,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 12749,
    luminosity: 332520,
    radius: '',
    absoluteMagnitude: -7.02,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 9383,
    luminosity: 342940,
    radius: 98,
    absoluteMagnitude: -6.98,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 23440,
    luminosity: 537430,
    radius: 81,
    absoluteMagnitude: -5.975,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 16787,
    luminosity: 246730,
    radius: 62,
    absoluteMagnitude: -6.35,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 18734,
    luminosity: 224780,
    radius: 46,
    absoluteMagnitude: -7.45,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 9892,
    luminosity: 593900,
    radius: 80,
    absoluteMagnitude: -7.262,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 10930,
    luminosity: 783930,
    radius: 25,
    absoluteMagnitude: -6.224,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 23095,
    luminosity: 347820,
    radius: 86,
    absoluteMagnitude: -5.905,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 21738,
    luminosity: 748890,
    radius: 92,
    absoluteMagnitude: -7.346,
    type: 4,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 24145,
    luminosity: 382993,
    radius: 1494,
    absoluteMagnitude: -8.84,
    type: 5,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 38234,
    luminosity: 272830,
    radius: 1356,
    absoluteMagnitude: -9.29,
    type: 5,
    color: 'Blue',
    class: '',
  },
  {
    temperatureInK: 32489,
    luminosity: 648430,
    radius: 1948.5,
    absoluteMagnitude: -10.84,
    type: 5,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 27739,
    luminosity: 849420,
    radius: 1252,
    absoluteMagnitude: -7.59,
    type: 5,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 21904,
    luminosity: 748490,
    radius: 1130,
    absoluteMagnitude: -7.67,
    type: 5,
    color: 'Blue-White',
    class: 'B',
  },
  {
    temperatureInK: 38940,
    luminosity: 374830,
    radius: 1356,
    absoluteMagnitude: -9.93,
    type: 5,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 30839,
    luminosity: 834042,
    radius: 1194,
    absoluteMagnitude: -10.63,
    type: 5,
    color: 'Blue',
    class: 'O',
  },
  {
    temperatureInK: 8829,
    luminosity: 537493,
    radius: 1423,
    absoluteMagnitude: -10.73,
    type: 5,
    color: 'White',
    class: 'A',
  },
  {
    temperatureInK: 9235,
    luminosity: 404940,
    radius: 1112,
    absoluteMagnitude: -11.23,
    type: 5,
    color: 'White',
    class: 'A',
  },
  {
    temperatureInK: 37882,
    luminosity: 294903,
    radius: 1783,
    absoluteMagnitude: -7.8,
    type: 5,
    color: 'Blue',
    class: 'O',
  },
];

export const starsScatterMagnitudeByTemperature = stars.map((star, i) => ({
  x: star.temperatureInK,
  y: star.absoluteMagnitude,
  id: star.color + star.type + star.class + i,
}));

export const starsScatterMagnitudeByTemperatureByType = stars.reduce(
  (acc, star, i) => {
    acc[star.type].data.push({
      x: star.temperatureInK,
      y: star.absoluteMagnitude,
      id: star.color + star.type + star.class + i,
    });
    return acc;
  },
  [
    {
      label: 'Brown Dwarf',
      // color: 'indianred',
      data: [],
    },
    {
      label: 'Red Dwarf',
      // color: 'rosybrown',
      data: [],
    },
    {
      label: 'White Dwarf',
      // color: 'silver',
      data: [],
    },
    {
      label: 'Main Sequence',
      // color: 'skyblue',
      data: [],
    },
    {
      label: 'Supergiants',
      // color: 'coral',
      data: [],
    },
    {
      label: 'Hypergiants',
      // color: 'brown',
      data: [],
    },
  ] as any,
);
