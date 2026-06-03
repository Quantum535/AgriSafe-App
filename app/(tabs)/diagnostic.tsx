import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
import { Leaf, Camera, Sprout, CheckCircle2, ChevronRight, Activity } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProbabilityBars } from '@/components/ProbabilityBars';
import { SectionLabel, Pill, hexA } from '@/components/ui';
import { Theme, Spacing, Radius, Font, HealthClass } from '@/constants/Colors';
import { getDiagnosticDistribution, MODEL_INFO, NODE_INFO, TREATMENT_PROTOCOL } from '@/services/MockData';

type Phase = 'idle' | 'scanning' | 'result';

const SCAN_STEPS = [
  { label: 'Capturing canopy frame', model: 'Arducam' },
  { label: 'Vision inference', model: MODEL_INFO.visionBackbone },
  { label: 'Soil telemetry classify', model: MODEL_INFO.soilModel },
  { label: 'Late-fusion meta-learner', model: MODEL_INFO.fusion },
];

export default function DiagnosticScreen() {
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<Phase>('idle');
  const [step, setStep] = useState(0);
  const dist = getDiagnosticDistribution();
  const top = dist.reduce((a, b) => (b.prob > a.prob ? b : a), dist[0]);
  const topMeta = HealthClass[top.key];

  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase !== 'scanning') return;
    const anim = Animated.loop(
      Animated.timing(sweep, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
    );
    anim.start();

    setStep(0);
    const stepTimers = SCAN_STEPS.map((_, i) =>
      setTimeout(() => setStep(i + 1), (i + 1) * 700)
    );
    const done = setTimeout(() => setPhase('result'), SCAN_STEPS.length * 700 + 500);

    return () => {
      anim.stop();
      stepTimers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [phase]);

  const sweepY = sweep.interpolate({ inputRange: [0, 1], outputRange: [12, 252] });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Viewfinder */}
      <View style={styles.viewfinder}>
        <View style={styles.vfTopBar}>
          <View style={styles.vfTag}>
            <Camera size={13} color={Theme.text} />
            <Text style={styles.vfTagText}>{NODE_INFO.id} · CANOPY CAM</Text>
          </View>
          <Pill
            label={phase === 'scanning' ? 'INFERRING' : phase === 'result' ? 'COMPLETE' : 'READY'}
            color={phase === 'result' ? topMeta.color : Theme.accent}
            mono
          />
        </View>

        <View style={styles.frame}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />

          <Leaf size={64} color={phase === 'idle' ? Theme.textTertiary : hexA(Theme.accent, 0.55)} strokeWidth={1.2} />

          {phase === 'scanning' && (
            <Animated.View style={[styles.scanLine, { transform: [{ translateY: sweepY }] }]} />
          )}

          <Text style={styles.vfSpecies}>{NODE_INFO.species}</Text>
        </View>

        {phase === 'scanning' && (
          <View style={styles.steps}>
            {SCAN_STEPS.map((s, i) => {
              const active = i < step;
              return (
                <View key={s.label} style={styles.stepRow}>
                  {active ? (
                    <CheckCircle2 size={14} color={Theme.accent} />
                  ) : (
                    <View style={styles.stepDotPending} />
                  )}
                  <Text style={[styles.stepText, active && { color: Theme.text }]}>{s.label}</Text>
                  <Text style={styles.stepModel}>{s.model}</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Result / control drawer */}
      <ScrollView
        style={styles.drawer}
        contentContainerStyle={styles.drawerContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.handle} />

        {phase !== 'result' ? (
          <>
            <Text style={styles.drawerTitle}>Multimodal Leaf Diagnostic</Text>
            <Text style={styles.drawerSub}>
              Fuses an Arducam canopy frame ({MODEL_INFO.visionBackbone}) with live RS-485 soil telemetry
              ({MODEL_INFO.soilModel}) through a {MODEL_INFO.fusion.toLowerCase()} meta-learner. Inference runs
              fully on-device in ~{(MODEL_INFO.latencyMs / 1000).toFixed(1)}s.
            </Text>
            <TouchableOpacity
              style={[styles.scanBtn, phase === 'scanning' && { opacity: 0.6 }]}
              activeOpacity={0.85}
              disabled={phase === 'scanning'}
              onPress={() => setPhase('scanning')}>
              <Activity size={18} color={Theme.bg} />
              <Text style={styles.scanBtnText}>
                {phase === 'scanning' ? 'Analyzing…' : 'Capture & Analyze'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.resultHead}>
              <View style={{ flex: 1 }}>
                <SectionLabel>Diagnosis</SectionLabel>
                <Text style={[styles.resultClass, { color: topMeta.color }]}>{topMeta.label}</Text>
              </View>
              <View style={[styles.confBadge, { borderColor: hexA(topMeta.color, 0.3), backgroundColor: hexA(topMeta.color, 0.1) }]}>
                <Text style={[styles.confValue, { color: topMeta.color }]}>{(top.prob * 100).toFixed(0)}%</Text>
                <Text style={styles.confLabel}>CONF</Text>
              </View>
            </View>

            <View style={styles.findingCard}>
              <Sprout size={16} color={Theme.warning} />
              <Text style={styles.findingText}>
                Chlorosis along leaf margins consistent with early-stage nitrogen deficiency. Subsurface NPK
                trend corroborates the visual signature.
              </Text>
            </View>

            <SectionLabel style={styles.distLabel}>Class Probabilities</SectionLabel>
            <View style={styles.distBox}>
              <ProbabilityBars data={dist} />
            </View>

            <SectionLabel style={styles.distLabel}>{TREATMENT_PROTOCOL.title}</SectionLabel>
            <View style={styles.protocol}>
              {TREATMENT_PROTOCOL.steps.map((s, i) => (
                <View key={i} style={styles.protocolRow}>
                  <View style={styles.protocolNum}>
                    <Text style={styles.protocolNumText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.protocolText}>{s}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.rescanBtn} activeOpacity={0.85} onPress={() => setPhase('idle')}>
              <Text style={styles.rescanText}>New Scan</Text>
              <ChevronRight size={16} color={Theme.text} />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgElevated },

  viewfinder: { flex: 1, padding: Spacing.xl, justifyContent: 'space-between' },
  vfTopBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vfTag: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  vfTagText: { fontFamily: Font.mono, fontSize: 10, color: Theme.textSecondary, letterSpacing: 0.8 },

  frame: {
    alignSelf: 'center',
    width: 264,
    height: 264,
    borderRadius: Radius.lg,
    backgroundColor: Theme.bg,
    borderWidth: 1,
    borderColor: Theme.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  corner: { position: 'absolute', width: 28, height: 28, borderColor: Theme.accent },
  tl: { top: 12, left: 12, borderTopWidth: 2.5, borderLeftWidth: 2.5, borderTopLeftRadius: 6 },
  tr: { top: 12, right: 12, borderTopWidth: 2.5, borderRightWidth: 2.5, borderTopRightRadius: 6 },
  bl: { bottom: 12, left: 12, borderBottomWidth: 2.5, borderLeftWidth: 2.5, borderBottomLeftRadius: 6 },
  br: { bottom: 12, right: 12, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderBottomRightRadius: 6 },
  scanLine: {
    position: 'absolute',
    left: 12,
    right: 12,
    height: 2,
    backgroundColor: Theme.accent,
    shadowColor: Theme.accent,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  vfSpecies: {
    position: 'absolute',
    bottom: 16,
    fontFamily: Font.mono,
    fontSize: 10,
    color: Theme.textTertiary,
    fontStyle: 'italic',
  },

  steps: { gap: Spacing.sm },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepDotPending: { width: 14, height: 14, borderRadius: 7, borderWidth: 1.5, borderColor: Theme.borderStrong },
  stepText: { flex: 1, fontSize: 12.5, color: Theme.textTertiary },
  stepModel: { fontFamily: Font.mono, fontSize: 10, color: Theme.textTertiary },

  drawer: {
    backgroundColor: Theme.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Theme.border,
    maxHeight: '62%',
  },
  drawerContent: { padding: Spacing.xl, paddingTop: Spacing.md, paddingBottom: 40 },
  handle: { width: 38, height: 4, borderRadius: 2, backgroundColor: Theme.borderStrong, alignSelf: 'center', marginBottom: Spacing.lg },

  drawerTitle: { fontSize: 19, fontWeight: '700', color: Theme.text, letterSpacing: -0.3 },
  drawerSub: { fontSize: 13, color: Theme.textSecondary, lineHeight: 20, marginTop: Spacing.sm, marginBottom: Spacing.xl },

  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Theme.accent,
    paddingVertical: 16,
    borderRadius: Radius.lg,
  },
  scanBtnText: { color: Theme.bg, fontSize: 15.5, fontWeight: '700' },

  resultHead: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
  resultClass: { fontSize: 30, fontWeight: '800', letterSpacing: -0.8, marginTop: 4 },
  confBadge: { alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.md, borderWidth: 1 },
  confValue: { fontFamily: Font.mono, fontSize: 22 },
  confLabel: { fontFamily: Font.mono, fontSize: 8, color: Theme.textTertiary, letterSpacing: 1, marginTop: 1 },

  findingCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: Theme.bgElevated,
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  findingText: { flex: 1, fontSize: 13, color: Theme.text, lineHeight: 19 },

  distLabel: { marginBottom: Spacing.md },
  distBox: { marginBottom: Spacing.xl },

  protocol: { gap: Spacing.md, marginBottom: Spacing.xl },
  protocolRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  protocolNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.accentDim,
    borderWidth: 1,
    borderColor: Theme.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  protocolNumText: { fontFamily: Font.mono, fontSize: 12, color: Theme.accent },
  protocolText: { flex: 1, fontSize: 13, color: Theme.textSecondary, lineHeight: 20 },

  rescanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Theme.borderStrong,
  },
  rescanText: { color: Theme.text, fontSize: 14, fontWeight: '600' },
});
