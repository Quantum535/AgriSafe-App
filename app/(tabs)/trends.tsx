import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TrendingDown, Droplets, Wind, FlaskConical } from 'lucide-react-native';

import { AreaChart } from '@/components/charts/AreaChart';
import { DeprivationChart } from '@/components/charts/DeprivationChart';
import { Card, SectionLabel, hexA } from '@/components/ui';
import { Theme, Spacing, Radius, Font } from '@/constants/Colors';
import {
  getMoistureSeries,
  getCo2Series,
  getPhSeries,
  getWaterDeprivationTrial,
  MODEL_INFO,
  type Series,
} from '@/services/MockData';

const SCREEN_W = Dimensions.get('window').width;
const CHART_W = SCREEN_W - Spacing.xl * 2 - Spacing.xl * 2; // screen padding + card padding
const TIMEFRAMES = ['24h', '7d', '30d'] as const;
type Timeframe = (typeof TIMEFRAMES)[number];

const METRICS = [
  { key: 'moisture', label: 'Soil Moisture', icon: Droplets, color: Theme.accent, get: getMoistureSeries },
  { key: 'co2', label: 'CO₂ Flux', icon: Wind, color: Theme.vision, get: getCo2Series },
  { key: 'ph', label: 'Soil pH', icon: FlaskConical, color: Theme.caution, get: getPhSeries },
] as const;

export default function TrendsScreen() {
  const insets = useSafeAreaInsets();
  const [metricKey, setMetricKey] = useState<(typeof METRICS)[number]['key']>('moisture');
  const [tf, setTf] = useState<Timeframe>('7d');

  const metric = METRICS.find((m) => m.key === metricKey)!;
  const series: Series = metric.get(tf);
  const last = series.points[series.points.length - 1];
  const first = series.points[0];
  const delta = +(last - first).toFixed(1);

  const trial = getWaterDeprivationTrial();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
      showsVerticalScrollIndicator={false}>
      <SectionLabel>{MODEL_INFO.trainImages.toLocaleString()} frame history</SectionLabel>
      <Text style={styles.title}>Trends</Text>

      {/* Metric selector */}
      <View style={styles.metricTabs}>
        {METRICS.map((m) => {
          const Icon = m.icon;
          const active = m.key === metricKey;
          return (
            <TouchableOpacity
              key={m.key}
              style={[styles.metricTab, active && { borderColor: hexA(m.color, 0.4), backgroundColor: hexA(m.color, 0.08) }]}
              activeOpacity={0.8}
              onPress={() => setMetricKey(m.key)}>
              <Icon size={15} color={active ? m.color : Theme.textTertiary} />
              <Text style={[styles.metricTabText, active && { color: Theme.text }]}>{m.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Primary chart */}
      <Card style={{ marginBottom: Spacing.xl }}>
        <View style={styles.chartHead}>
          <View>
            <View style={styles.valueRow}>
              <Text style={styles.bigValue}>{last.toFixed(metricKey === 'ph' ? 1 : 0)}</Text>
              <Text style={styles.bigUnit}>{series.unit}</Text>
            </View>
            <View style={styles.deltaRow}>
              <Text style={[styles.delta, { color: delta < 0 ? Theme.warning : Theme.accent }]}>
                {delta >= 0 ? '+' : ''}{delta} {series.unit}
              </Text>
              <Text style={styles.deltaLabel}>over {tf}</Text>
            </View>
          </View>

          <View style={styles.tfGroup}>
            {TIMEFRAMES.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.tfBtn, tf === t && styles.tfBtnActive]}
                onPress={() => setTf(t)}>
                <Text style={[styles.tfText, tf === t && styles.tfTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <AreaChart
          points={series.points}
          labels={series.labels}
          unit={series.unit}
          color={metric.color}
          width={CHART_W}
        />
      </Card>

      {/* Signature: pre-phenotypic detection (Figure 11) */}
      <SectionLabel style={styles.blockLabel}>Pre-Phenotypic Detection</SectionLabel>
      <Card>
        <View style={styles.trialHead}>
          <TrendingDown size={16} color={Theme.danger} />
          <Text style={styles.trialTitle}>7-Day Water-Deprivation Trial</Text>
        </View>
        <Text style={styles.trialSub}>
          As root-zone moisture fell 60% → 15%, model stress confidence rose 5% → 92%. Subsurface signal flagged
          stress ~{MODEL_INFO.leadTimeDays} days before visible canopy wilt.
        </Text>

        <View style={styles.legendRow}>
          <Legend color={Theme.accent} label="Soil Moisture %" />
          <Legend color={Theme.danger} label="Stress Conf %" />
          <Legend color={hexA(Theme.vision, 0.7)} label="Lead window" />
        </View>

        <DeprivationChart
          labels={trial.labels}
          moisture={trial.moisture}
          stressConfidence={trial.stressConfidence}
          detectionDay={trial.detectionDay}
          wiltOnsetDay={trial.wiltOnsetDay}
          width={CHART_W}
        />

        <View style={styles.leadCallout}>
          <Text style={styles.leadValue}>~{MODEL_INFO.leadTimeDays}d</Text>
          <Text style={styles.leadText}>
            lead time between subterranean detection (D{trial.detectionDay}) and visible wilt onset (D{trial.wiltOnsetDay})
          </Text>
        </View>
      </Card>

      <Text style={styles.footnote}>
        Single controlled drought trial · field capacity 61.6 kPa · replication pending
      </Text>
    </ScrollView>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legend}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bg },
  content: { padding: Spacing.xl, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '700', color: Theme.text, letterSpacing: -0.6, marginTop: 4, marginBottom: Spacing.xl },

  metricTabs: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  metricTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Theme.border,
    backgroundColor: Theme.surface,
  },
  metricTabText: { fontSize: 11.5, color: Theme.textTertiary, fontWeight: '600' },

  chartHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 5 },
  bigValue: { fontFamily: Font.mono, fontSize: 32, color: Theme.text, letterSpacing: -1 },
  bigUnit: { fontFamily: Font.mono, fontSize: 14, color: Theme.textTertiary },
  deltaRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 },
  delta: { fontFamily: Font.mono, fontSize: 12.5 },
  deltaLabel: { fontSize: 11, color: Theme.textTertiary },

  tfGroup: { flexDirection: 'row', backgroundColor: Theme.bgElevated, borderRadius: Radius.sm, borderWidth: 1, borderColor: Theme.border, padding: 2 },
  tfBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.sm - 2 },
  tfBtnActive: { backgroundColor: Theme.surfaceHover },
  tfText: { fontFamily: Font.mono, fontSize: 11, color: Theme.textTertiary },
  tfTextActive: { color: Theme.text },

  blockLabel: { marginBottom: Spacing.md },
  trialHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.sm },
  trialTitle: { fontSize: 16, fontWeight: '700', color: Theme.text },
  trialSub: { fontSize: 12.5, color: Theme.textSecondary, lineHeight: 19, marginBottom: Spacing.lg },

  legendRow: { flexDirection: 'row', gap: Spacing.lg, marginBottom: Spacing.lg, flexWrap: 'wrap' },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 9, height: 9, borderRadius: 2 },
  legendText: { fontSize: 10.5, color: Theme.textSecondary, fontFamily: Font.mono },

  leadCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Theme.visionDim,
    borderColor: Theme.visionBorder,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
  },
  leadValue: { fontFamily: Font.mono, fontSize: 26, color: Theme.vision },
  leadText: { flex: 1, fontSize: 12, color: Theme.text, lineHeight: 18 },

  footnote: { textAlign: 'center', color: Theme.textTertiary, fontSize: 11, fontFamily: Font.mono, marginTop: Spacing.xl },
});
