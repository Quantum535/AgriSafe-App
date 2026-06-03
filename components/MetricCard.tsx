import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { Theme, Radius, Spacing, Font } from '@/constants/Colors';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  accent?: string;
  trend?: number[];
  caption?: string;
  fullWidth?: boolean;
}

/** Compact sensor tile: mono readout + unit, optional inline sparkline. */
export function MetricCard({
  label,
  value,
  unit,
  icon,
  accent = Theme.accent,
  trend,
  caption,
  fullWidth = false,
}: MetricCardProps) {
  return (
    <View style={[styles.card, fullWidth && styles.fullWidth]}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {icon}
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>

      {trend ? <Sparkline data={trend} color={accent} /> : null}
      {caption ? <Text style={[styles.caption, { color: accent }]}>{caption}</Text> : null}
    </View>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 100;
  const h = 26;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data
    .map((v, i) => `${(i * step).toFixed(1)},${(h - ((v - min) / range) * (h - 4) - 2).toFixed(1)}`)
    .join(' ');

  return (
    <View style={styles.spark}>
      <Svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <Polyline
          points={pts}
          fill="none"
          stroke={color}
          strokeWidth={1.6}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Theme.border,
    padding: Spacing.lg,
    width: '48%',
    marginBottom: Spacing.md,
  },
  fullWidth: { width: '100%' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 12.5,
    color: Theme.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontFamily: Font.mono,
    fontSize: 26,
    color: Theme.text,
    letterSpacing: -0.5,
  },
  unit: {
    fontFamily: Font.mono,
    fontSize: 13,
    color: Theme.textTertiary,
  },
  spark: {
    marginTop: Spacing.md,
    opacity: 0.9,
  },
  caption: {
    marginTop: Spacing.sm,
    fontSize: 11,
    fontWeight: '600',
  },
});
