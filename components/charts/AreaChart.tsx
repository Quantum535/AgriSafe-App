import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Line } from 'react-native-svg';
import { Theme, Font } from '@/constants/Colors';

interface AreaChartProps {
  points: number[];
  labels: string[];
  unit?: string;
  color?: string;
  width: number;
  height?: number;
}

/** Smooth (Catmull-Rom) gradient area chart with a hairline baseline grid. */
export function AreaChart({
  points,
  labels,
  unit = '',
  color = Theme.accent,
  width,
  height = 200,
}: AreaChartProps) {
  const padL = 8;
  const padR = 8;
  const padT = 14;
  const padB = 26;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  // Pad the value range so the line never hugs the top/bottom edge.
  const lo = min - range * 0.15;
  const hi = max + range * 0.15;
  const vRange = hi - lo;

  const x = (i: number) => padL + (i / (points.length - 1)) * plotW;
  const y = (v: number) => padT + (1 - (v - lo) / vRange) * plotH;

  const coords = points.map((v, i) => ({ x: x(i), y: y(v) }));
  const linePath = smoothPath(coords);
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${padT + plotH} L ${coords[0].x.toFixed(1)} ${padT + plotH} Z`;

  const gridYs = [0.25, 0.5, 0.75].map((t) => padT + t * plotH);
  const gid = `grad-${color.replace(/[^a-z0-9]/gi, '')}`;

  return (
    <View>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity={0.28} />
            <Stop offset="1" stopColor={color} stopOpacity={0.02} />
          </LinearGradient>
        </Defs>

        {gridYs.map((gy, i) => (
          <Line key={i} x1={padL} y1={gy} x2={width - padR} y2={gy} stroke={Theme.border} strokeWidth={1} />
        ))}

        <Path d={areaPath} fill={`url(#${gid})`} />
        <Path d={linePath} fill="none" stroke={color} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />

        {coords.map((c, i) => {
          const isLast = i === coords.length - 1;
          return (
            <Circle
              key={i}
              cx={c.x}
              cy={c.y}
              r={isLast ? 4.5 : 0}
              fill={isLast ? color : 'transparent'}
              stroke={Theme.bg}
              strokeWidth={isLast ? 2.5 : 0}
            />
          );
        })}
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

/** Catmull-Rom spline → cubic-bezier path string for a smooth line. */
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

const styles = StyleSheet.create({
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  label: {
    fontFamily: Font.mono,
    fontSize: 10,
    color: Theme.textTertiary,
  },
});
