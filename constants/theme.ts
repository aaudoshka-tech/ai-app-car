export const colors = {
  // Warm ivory backgrounds
  ivory: '#F7F5F0',
  ivoryLight: '#FBFAF6',
  ivoryDark: '#EDEAE3',

  // Deep charcoal typography
  charcoal: '#1A1A18',
  charcoalSoft: '#2D2D2A',
  charcoalMuted: '#5C5A55',
  charcoalLight: '#8A8882',
  charcoalFaint: '#B5B3AD',

  // Electric lime accent
  lime: '#D4F542',
  limeDark: '#B8E633',
  limeSoft: '#E8FAB8',

  // Functional
  white: '#FFFFFF',
  black: '#000000',
  red: '#E5484D',
  green: '#3DAD5B',
  blue: '#4A8FDB',

  // Lines & surfaces
  hairline: '#E2DFD8',
  surface: '#F2F0EB',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 36,
} as const;

export const typography = {
  display: {
    fontSize: 42,
    fontWeight: '700' as const,
    lineHeight: 48,
    letterSpacing: -0.8,
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  title1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  title2: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  title3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 23,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 25,
  },
  callout: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  subheadline: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  footnote: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  label: {
    fontSize: 11,
    fontWeight: '600' as const,
    lineHeight: 14,
    letterSpacing: 1.2,
  },
} as const;
