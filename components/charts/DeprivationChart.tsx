import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Line, Circle, Rect } from 'react-native-svg';
import { Theme, Font } from '@/constants/Colors';
import { hexA } from '../ui';

interface Props {
  labels: string[];
  moisture: number[]; // %
  stressConfidence: number[]; // %
  detectionDay: number; // 1-indexed
  wiltOnsetDay: number; // 1-indexed
  width: number;
  height?: number;
}

/**
 * 7-day water-deprivation trial: moisture (emerald, falling) vs model stress
 * confidence (red, rising). A shaded band marks the pre-phenotypic lead window
 * between subterranean detection and visible canopy wilting.
 */
export function DeprivationChart({
  labels,
  moisture,
  stressConfidence,
  detectionDay,
  wiltOnsetDay,
  width,
  height = 240,
}: Props) {
  const padL = 6;
  const padR = 6;
  const padT = 16;
  const padB = 26;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const n = labels.length;
  const x = (i: number) => padL + (i / (n - 1)) * plotW;
  const y = (v: number) => padT + (1 - v / 100) * plotH; // both series are 0..100

  const line = (vals: number[]) =>
    vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');

  const moisturePath = line(moisture);
  const stressPath = line(stressConfidence);
  const stressArea = `${stressPath} L ${x(n - 1).toFixed(1)} ${padT + plotH} L ${x(0).toFixed(1)} ${padT + plotH} Z`;

  const bandX1 = x(detectionDay - 1);
  const bandX2 = x(wiltOnsetDay - 1);

  return (
    <View>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Theme.danger} stopOpacity={0.22} />
            <Stop offset="1" stopColor={Theme.danger} stopOpacity={0.01} />
          </LinearGradient>
        </Defs>

        {/* horizontal gridlines */}
        {[0, 0.5, 1].map((t, i) => (
          <Line
            key={i}
            x1={padL}
            y1={padT + t * plotH}
            x2={width - padR}
            y2={padT + t * plotH}
            stroke={Theme.border}
            strokeWidth={1}
          />
        ))}

        {/* pre-phenotypic lead window */}
        <Rect x={bandX1} y={padT} width={bandX2 - bandX1} height={plotH} fill={hexA(Theme.vision, 0.1)} />
        <Line x1={bandX1} y1={padT} x2={bandX1} y2={padT + plotH} stroke={hexA(Theme.vision, 0.5)} strokeWidth={1} strokeDasharray="3 3" />
        <Line x1={bandX2} y1={padT} x2={bandX2} y2={padT + plotH} stroke={hexA(Theme.danger, 0.5)} strokeWidth={1} strokeDasharray="3 3" />

        {/* stress confidence */}
        <Path d={stressArea} fill="url(#stressGrad)" />
        <Path d={stressPath} fill="none" stroke={Theme.danger} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />

        {/* moisture */}
        <Path d={moisturePath} fill="none" stroke={Theme.accent} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />

        {/* endpoint dots */}
        <Circle cx={x(n - 1)} cy={y(stressConfidence[n - 1])} r={4} fill={Theme.danger} stroke={Theme.bg} strokeWidth={2} />
        <Circle cx={x(n - 1)} cy={y(moisture[n - 1])} r={4} fill={Theme.accent} stroke={Theme.bg} strokeWidth={2} />
      </Svg>

      <View style={[styles.labels, { paddingHorizontal: padL }]}>
        {labels.map((l, i) => (
          <Text key={i} style={styles.label}>
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  label: { fontFamily: Font.mono, fontSize: 10, color: Theme.textTertiary },
});
