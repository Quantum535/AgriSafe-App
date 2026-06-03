import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import { Droplets, Wind, FlaskConical, Leaf, Cpu, ArrowUpRight, Clock3, ScanLine } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MetricCard } from '@/components/MetricCard';
import { ProbabilityBars } from '@/components/ProbabilityBars';
import { Card, SectionLabel, Pill, Dot, Divider, hexA } from '@/components/ui';
import { Theme, Spacing, Radius, Font, HealthClass } from '@/constants/Colors';
import {
  getSensorData,
  getHealthDistribution,
  NODE_INFO,
  MODEL_INFO,
  type SensorFrame,
  type ClassProb,
} from '@/services/MockData';

export default function GlanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<SensorFrame>(getSensorData(true));
  const [dist, setDist] = useState<ClassProb[]>(getHealthDistribution());
  const [isLive, setIsLive] = useState(false);

  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLive) {
      setData(getSensorData(false));
      setDist(getHealthDistribution());
      interval = setInterval(() => {
        setData(getSensorData(false));
        setDist(getHealthDistribution());
      }, 1800);
    } else {
      setData(getSensorData(true));
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1100, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1100, easing: Easing.in(Easing.ease), useNativeDriver: true }),
      ])
    );
    if (isLive) loop.start();
    return () => loop.stop();
  }, [isLive]);

  const healthMeta = isLive ? HealthClass[data.health as keyof typeof HealthClass] ?? HealthClass.Healthy : null;
  const accent = healthMeta?.color ?? Theme.textTertiary;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <SectionLabel>{NODE_INFO.id} · {NODE_INFO.location}</SectionLabel>
          <Text style={styles.title}>{NODE_INFO.name}</Text>
        </View>
        <View style={[styles.statusBadge, { borderColor: isLive ? Theme.accentBorder : Theme.border }]}>
          <Dot color={isLive ? Theme.accent : Theme.textTertiary} size={7} />
          <Text style={[styles.statusText, { color: isLive ? Theme.accent : Theme.textTertiary }]}>
            {isLive ? 'STREAMING' : 'IDLE'}
          </Text>
        </View>
      </View>

      {/* Hero — AI health verdict */}
      <TouchableOpacity activeOpacity={0.92} onPress={() => setIsLive((v) => !v)}>
        <View style={[styles.hero, { borderColor: isLive ? hexA(accent, 0.4) : Theme.border }]}>
          <View style={[styles.heroGlow, { backgroundColor: hexA(accent, 0.14) }]} />

          <View style={styles.heroTop}>
            <View style={styles.heroBranch}>
              <Cpu size={13} color={Theme.textSecondary} />
              <Text style={styles.heroBranchText}>{MODEL_INFO.name}</Text>
            </View>
            {isLive ? (
              <Pill label={`${data.confidence}% conf`} color={accent} mono />
            ) : (
              <Text style={styles.tapHint}>TAP TO ANALYZE →</Text>
            )}
          </View>

          <View style={styles.heroMid}>
            <Animated.View
              style={{
                opacity: isLive ? pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) : 1,
              }}>
              <Text style={[styles.heroStatus, { color: isLive ? accent : Theme.textTertiary }]}>
                {isLive ? healthMeta?.label : 'Standby'}
              </Text>
            </Animated.View>
            <Text style={styles.heroSub}>
              {isLive
                ? `Canopy + subsurface fusion · ${NODE_INFO.speciesCommon}`
                : 'Tap the card to run the on-device fusion model'}
            </Text>
          </View>

          {/* Fusion branch split */}
          <View style={styles.fusionRow}>
            <FusionBranch label="VISION" sub={MODEL_INFO.visionBackbone} value={data.visionConf} color={Theme.vision} live={isLive} />
            <View style={styles.fusionDivider} />
            <FusionBranch label="SOIL" sub={MODEL_INFO.soilModel} value={data.soilConf} color={Theme.accent} live={isLive} />
            <View style={styles.fusionDivider} />
            <View style={styles.fusionCol}>
              <Text style={[styles.fusionLabel, { color: Theme.textTertiary }]}>LATENCY</Text>
              <Text style={styles.fusionValue}>
                {isLive ? (MODEL_INFO.latencyMs / 1000).toFixed(1) : '—'}
                {isLive ? <Text style={styles.fusionUnit}>s</Text> : null}
              </Text>
              <Text style={styles.fusionSub}>{MODEL_INFO.runtime}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Pre-phenotypic banner */}
      {isLive && (
        <View style={styles.preBanner}>
          <Clock3 size={16} color={Theme.vision} />
          <Text style={styles.preText}>
            Subsurface indicators lead visible wilt by ~{MODEL_INFO.leadTimeDays} days. No early stress signature detected.
          </Text>
        </View>
      )}

      {/* Probability distribution */}
      <SectionLabel style={styles.blockLabel}>5-Class Distribution</SectionLabel>
      <Card style={{ marginBottom: Spacing.xl }}>
        {isLive ? (
          <ProbabilityBars data={dist} />
        ) : (
          <Text style={styles.emptyText}>Start streaming to compute the late-fusion class distribution.</Text>
        )}
      </Card>

      {/* Sensor telemetry */}
      <View style={styles.telemetryHead}>
        <SectionLabel>Live Telemetry</SectionLabel>
        <Text style={styles.telemetrySrc}>RS-485 · 7-in-1 + MH-Z19C</Text>
      </View>
      <View style={styles.grid}>
        <MetricCard
          label="Soil Moisture"
          value={isLive ? data.soilMoisture.toFixed(0) : '—'}
          unit="%"
          accent={Theme.accent}
          icon={<Droplets size={16} color={Theme.accent} />}
        />
        <MetricCard
          label="CO₂ Flux"
          value={isLive ? data.co2Flux.toFixed(0) : '—'}
          unit="ppm"
          accent={Theme.vision}
          icon={<Wind size={16} color={Theme.vision} />}
        />
        <MetricCard
          label="Soil pH"
          value={isLive ? data.soilPh.toFixed(1) : '—'}
          unit="pH"
          accent={Theme.caution}
          icon={<FlaskConical size={16} color={Theme.caution} />}
        />
        <MetricCard
          label="Nitrogen"
          value={isLive ? data.nitrogen.toFixed(0) : '—'}
          unit="mg/kg"
          accent={Theme.warning}
          icon={<Leaf size={16} color={Theme.warning} />}
          caption={isLive ? 'Slightly low' : undefined}
        />
      </View>

      {/* NPK strip */}
      {isLive && (
        <Card style={styles.npkCard}>
          <NpkCell label="N" value={data.nitrogen} unit="mg/kg" color={Theme.accent} />
          <Divider style={styles.npkSep} />
          <NpkCell label="P" value={data.phosphorus} unit="mg/kg" color={Theme.vision} />
          <Divider style={styles.npkSep} />
          <NpkCell label="K" value={data.potassium} unit="mg/kg" color={Theme.caution} />
          <Divider style={styles.npkSep} />
          <NpkCell label="EC" value={data.ec} unit="µS/cm" color={Theme.textSecondary} />
        </Card>
      )}

      {/* CTA */}
      <TouchableOpacity style={styles.cta} activeOpacity={0.85} onPress={() => router.push('/diagnostic')}>
        <ScanLine size={18} color={Theme.bg} />
        <Text style={styles.ctaText}>Run Visual Diagnostic</Text>
        <ArrowUpRight size={18} color={Theme.bg} />
      </TouchableOpacity>

      <Text style={styles.footnote}>
        AgriDefend · {MODEL_INFO.accuracy}% accuracy · R² {MODEL_INFO.r2} · offline-first edge inference
      </Text>
    </ScrollView>
  );
}

function FusionBranch({ label, sub, value, color, live }: { label: string; sub: string; value: number; color: string; live: boolean }) {
  return (
    <View style={styles.fusionCol}>
      <Text style={[styles.fusionLabel, { color }]}>{label}</Text>
      <Text style={styles.fusionValue}>
        {live ? value.toFixed(0) : '—'}
        {live ? <Text style={styles.fusionUnit}>%</Text> : null}
      </Text>
      <Text style={styles.fusionSub}>{sub}</Text>
    </View>
  );
}

function NpkCell({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <View style={styles.npkCell}>
      <Text style={[styles.npkLabel, { color }]}>{label}</Text>
      <Text style={styles.npkValue}>{value.toFixed(0)}</Text>
      <Text style={styles.npkUnit}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bg },
  content: { padding: Spacing.xl, paddingBottom: 48 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  title: { fontSize: 26, fontWeight: '700', color: Theme.text, letterSpacing: -0.6, marginTop: 4 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    borderWidth: 1,
    backgroundColor: Theme.surface,
  },
  statusText: { fontFamily: Font.mono, fontSize: 10, letterSpacing: 1 },

  hero: {
    backgroundColor: Theme.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: -90,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroBranch: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroBranchText: { color: Theme.textSecondary, fontSize: 12, fontFamily: Font.mono },
  tapHint: { color: Theme.textTertiary, fontSize: 10, fontFamily: Font.mono, letterSpacing: 0.5 },
  heroMid: { marginTop: Spacing.xl, marginBottom: Spacing.xl },
  heroStatus: { fontSize: 40, fontWeight: '800', letterSpacing: -1.2 },
  heroSub: { color: Theme.textSecondary, fontSize: 13, marginTop: 6 },

  fusionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.bgElevated,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Theme.border,
    paddingVertical: Spacing.md,
  },
  fusionCol: { flex: 1, alignItems: 'center', gap: 3 },
  fusionDivider: { width: 1, height: 34, backgroundColor: Theme.border },
  fusionLabel: { fontFamily: Font.mono, fontSize: 9.5, letterSpacing: 1 },
  fusionValue: { fontFamily: Font.mono, fontSize: 18, color: Theme.text },
  fusionUnit: { fontSize: 11, color: Theme.textTertiary },
  fusionSub: { fontSize: 9.5, color: Theme.textTertiary },

  preBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Theme.visionDim,
    borderColor: Theme.visionBorder,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  preText: { flex: 1, color: Theme.text, fontSize: 12.5, lineHeight: 18 },

  blockLabel: { marginBottom: Spacing.md },
  emptyText: { color: Theme.textTertiary, fontSize: 13, lineHeight: 19 },

  telemetryHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  telemetrySrc: { fontFamily: Font.mono, fontSize: 10, color: Theme.textTertiary },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },

  npkCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.lg, marginTop: Spacing.xs, marginBottom: Spacing.xl },
  npkCell: { flex: 1, alignItems: 'center', gap: 3 },
  npkLabel: { fontFamily: Font.mono, fontSize: 13, fontWeight: '700' },
  npkValue: { fontFamily: Font.mono, fontSize: 18, color: Theme.text },
  npkUnit: { fontSize: 9.5, color: Theme.textTertiary },
  npkSep: { width: 1, height: 36 },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Theme.accent,
    paddingVertical: 17,
    borderRadius: Radius.lg,
    marginTop: Spacing.xs,
  },
  ctaText: { color: Theme.bg, fontSize: 15.5, fontWeight: '700' },

  footnote: {
    textAlign: 'center',
    color: Theme.textTertiary,
    fontSize: 11,
    fontFamily: Font.mono,
    marginTop: Spacing.xl,
  },
});
