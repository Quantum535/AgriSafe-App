/**
 * AgriSafe design system — a refined dark theme inspired by premium technical
 * products (e.g. scale.com). System font for prose, SpaceMono for numeric /
 * technical readouts. Two signature accents reinforce the multimodal-fusion
 * story from the AgriDefend paper: emerald = soil/telemetry branch (Random
 * Forest), blue = vision branch (MobileNetV2).
 */

export const Theme = {
  // Canvas
  bg: '#08090B',
  bgElevated: '#0E1013',
  surface: '#14171C',
  surfaceAlt: '#1A1E24',
  surfaceHover: '#20252C',

  // Hairlines / borders
  border: '#21262E',
  borderStrong: '#2C333C',

  // Type
  text: '#F4F6F8',
  textSecondary: '#9AA1AC',
  textTertiary: '#5C636E',

  // Signature accents
  accent: '#34E29B', // soil / telemetry (emerald)
  accentDim: 'rgba(52, 226, 155, 0.12)',
  accentBorder: 'rgba(52, 226, 155, 0.30)',
  vision: '#6E8BFF', // vision branch (blue/violet)
  visionDim: 'rgba(110, 139, 255, 0.12)',
  visionBorder: 'rgba(110, 139, 255, 0.30)',

  // Status
  healthy: '#34E29B',
  caution: '#FACC15',
  warning: '#FB923C',
  danger: '#F4595B',
  dangerDim: 'rgba(244, 89, 91, 0.12)',
  cautionDim: 'rgba(250, 204, 21, 0.12)',

  white: '#FFFFFF',
  black: '#000000',
} as const;

// Five-class crop-health scale from the AgriDefend late-fusion model.
export const HealthClass = {
  Healthy: { label: 'Healthy', color: '#34E29B', tint: 'rgba(52, 226, 155, 0.14)' },
  'Mild Stress': { label: 'Mild Stress', color: '#A3E635', tint: 'rgba(163, 230, 53, 0.14)' },
  'Moderate Stress': { label: 'Moderate Stress', color: '#FACC15', tint: 'rgba(250, 204, 21, 0.14)' },
  'Severe Stress': { label: 'Severe Stress', color: '#FB923C', tint: 'rgba(251, 146, 60, 0.14)' },
  Critical: { label: 'Critical', color: '#F4595B', tint: 'rgba(244, 89, 91, 0.14)' },
} as const;

export type HealthClassKey = keyof typeof HealthClass;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const Font = {
  mono: 'SpaceMono',
} as const;

// Backwards-compatible map consumed by @react-navigation Themed.tsx helpers.
const palette = {
  background: Theme.bg,
  cardBackground: Theme.surface,
  primary: Theme.accent,
  text: Theme.text,
  secondaryText: Theme.textSecondary,
  border: Theme.border,
  danger: Theme.danger,
  warning: Theme.warning,
};

export const Colors = {
  light: palette,
  dark: palette,
};
