import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme, Font, HealthClass, Spacing } from '@/constants/Colors';
import type { ClassProb } from '@/services/MockData';

/** Horizontal probability distribution across the five crop-health classes. */
export function ProbabilityBars({ data }: { data: ClassProb[] }) {
  const max = Math.max(...data.map((d) => d.prob));
  const top = data.reduce((a, b) => (b.prob > a.prob ? b : a), data[0]);

  return (
    <View style={styles.wrap}>
      {data.map((d) => {
        const meta = HealthClass[d.key];
        const isTop = d.key === top.key;
        return (
          <View key={d.key} style={styles.row}>
            <Text style={[styles.name, isTop && { color: Theme.text }]} numberOfLines={1}>
              {meta.label}
            </Text>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${(d.prob / max) * 100}%`,
                    backgroundColor: meta.color,
                    opacity: isTop ? 1 : 0.55,
                  },
                ]}
              />
            </View>
            <Text style={[styles.pct, { color: isTop ? meta.color : Theme.textSecondary }]}>
              {(d.prob * 100).toFixed(1)}%
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  name: {
    width: 108,
    fontSize: 12.5,
    color: Theme.textSecondary,
    fontWeight: '500',
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.surfaceAlt,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  pct: {
    width: 48,
    textAlign: 'right',
    fontFamily: Font.mono,
    fontSize: 12,
  },
});
