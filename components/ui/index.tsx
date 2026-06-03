import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { Theme, Radius, Spacing, Font } from '@/constants/Colors';

/** Elevated surface with a hairline border — the base building block. */
export function Card({
  children,
  style,
  accent,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accent?: string;
}) {
  return (
    <View
      style={[
        styles.card,
        accent ? { borderColor: accent } : null,
        style,
      ]}>
      {children}
    </View>
  );
}

/** Mono, uppercase, tracked-out micro label — the scale.com signature. */
export function SectionLabel({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.sectionLabel, style]}>{children}</Text>;
}

/** Small status / category pill. */
export function Pill({
  label,
  color = Theme.accent,
  tint,
  icon,
  mono,
}: {
  label: string;
  color?: string;
  tint?: string;
  icon?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <View style={[styles.pill, { backgroundColor: tint ?? hexA(color, 0.12), borderColor: hexA(color, 0.3) }]}>
      {icon}
      <Text style={[styles.pillText, { color }, mono && { fontFamily: Font.mono, fontSize: 11 }]}>{label}</Text>
    </View>
  );
}

/** A live pulsing dot. */
export function Dot({ color = Theme.accent, size = 8 }: { color?: string; size?: number }) {
  return (
    <View style={{ width: size, height: size }}>
      <View style={[styles.dotHalo, { backgroundColor: hexA(color, 0.25), width: size * 2, height: size * 2, left: -size / 2, top: -size / 2, borderRadius: size }]} />
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />
    </View>
  );
}

/** Hairline divider. */
export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.divider, style]} />;
}

/** Convert a hex color + alpha to an rgba() string. */
export function hexA(hex: string, alpha: number) {
  if (hex.startsWith('rgb')) return hex;
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Theme.border,
    padding: Spacing.xl,
  },
  sectionLabel: {
    fontFamily: Font.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    color: Theme.textTertiary,
    textTransform: 'uppercase',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dotHalo: {
    position: 'absolute',
  },
  divider: {
    height: 1,
    backgroundColor: Theme.border,
  },
});
