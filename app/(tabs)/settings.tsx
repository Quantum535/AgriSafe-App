import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DownloadCloud,
  WifiOff,
  RadioTower,
  Cpu,
  CircuitBoard,
  Check,
  ChevronRight,
} from 'lucide-react-native';

import { Card, SectionLabel, Pill, Dot, Divider, hexA } from '@/components/ui';
import { Theme, Spacing, Radius, Font } from '@/constants/Colors';
import { NODE_INFO, MODEL_INFO, HARDWARE_BOM, HARDWARE_TOTAL } from '@/services/MockData';

export default function NodeScreen() {
  const insets = useSafeAreaInsets();
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [exported, setExported] = useState(false);

  const handleConnect = () => {
    if (connected) return;
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 1600);
  };

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2200);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
      showsVerticalScrollIndicator={false}>
      <SectionLabel>{NODE_INFO.id} · {NODE_INFO.firmware}</SectionLabel>
      <Text style={styles.title}>Node & Sync</Text>

      {/* Connectivity */}
      <Card style={[styles.connCard, { borderColor: connected ? Theme.accentBorder : Theme.border }]}>
        <View style={styles.connTop}>
          <View style={[styles.connIcon, { backgroundColor: connected ? Theme.accentDim : Theme.cautionDim }]}>
            {connected ? <RadioTower size={20} color={Theme.accent} /> : <WifiOff size={20} color={Theme.caution} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.connTitle}>{connected ? 'Connected to Node' : 'Offline Mode'}</Text>
            <Text style={styles.connSub}>
              {connected
                ? `Synced over local AP · ${NODE_INFO.coords}`
                : 'Operating without internet. Telemetry is buffered locally.'}
            </Text>
          </View>
          <Dot color={connected ? Theme.accent : Theme.caution} size={8} />
        </View>

        <Divider style={{ marginVertical: Spacing.lg }} />

        <TouchableOpacity
          style={[styles.primaryBtn, connected && styles.primaryBtnDone]}
          activeOpacity={0.85}
          onPress={handleConnect}>
          {connected ? (
            <>
              <Check size={18} color={Theme.accent} />
              <Text style={[styles.primaryBtnText, { color: Theme.accent }]}>Node Linked</Text>
            </>
          ) : (
            <>
              <RadioTower size={18} color={Theme.bg} />
              <Text style={styles.primaryBtnText}>{connecting ? 'Pairing…' : 'Connect to AgriSafe Node'}</Text>
            </>
          )}
        </TouchableOpacity>
      </Card>

      {/* Data export */}
      <SectionLabel style={styles.blockLabel}>Data Retention</SectionLabel>
      <TouchableOpacity activeOpacity={0.85} onPress={handleExport}>
        <Card style={styles.row}>
          <View style={[styles.rowIcon, { backgroundColor: Theme.visionDim }]}>
            <DownloadCloud size={18} color={Theme.vision} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{exported ? 'Exported to device' : 'Export Time-Series to CSV'}</Text>
            <Text style={styles.rowSub}>Save historical telemetry for offline trend analysis</Text>
          </View>
          {exported ? <Check size={18} color={Theme.accent} /> : <ChevronRight size={18} color={Theme.textTertiary} />}
        </Card>
      </TouchableOpacity>

      {/* Model card */}
      <SectionLabel style={styles.blockLabel}>On-Device Model</SectionLabel>
      <Card>
        <View style={styles.modelHead}>
          <Cpu size={16} color={Theme.accent} />
          <Text style={styles.modelName}>{MODEL_INFO.name}</Text>
          <Pill label={MODEL_INFO.runtime} color={Theme.textSecondary} mono />
        </View>

        <View style={styles.statGrid}>
          <Stat label="ACCURACY" value={`${MODEL_INFO.accuracy}%`} />
          <Stat label="R²" value={MODEL_INFO.r2.toFixed(2)} />
          <Stat label="MAE" value={MODEL_INFO.mae.toFixed(2)} />
          <Stat label="LATENCY" value={`${(MODEL_INFO.latencyMs / 1000).toFixed(1)}s`} />
        </View>

        <Divider style={{ marginVertical: Spacing.lg }} />

        <ArchRow label="Vision branch" value={MODEL_INFO.visionBackbone} color={Theme.vision} />
        <ArchRow label="Soil branch" value={MODEL_INFO.soilModel} color={Theme.accent} />
        <ArchRow label="Fusion" value={MODEL_INFO.fusion} color={Theme.caution} />
      </Card>

      {/* Hardware BOM */}
      <SectionLabel style={styles.blockLabel}>Hardware · Bill of Materials</SectionLabel>
      <Card>
        <View style={styles.bomHead}>
          <CircuitBoard size={16} color={Theme.textSecondary} />
          <Text style={styles.bomTitle}>Edge Node</Text>
          <Text style={styles.bomTotal}>${HARDWARE_TOTAL}</Text>
        </View>
        <Divider style={{ marginBottom: Spacing.sm }} />
        {HARDWARE_BOM.map((p) => (
          <View key={p.part} style={styles.bomRow}>
            <Text style={styles.bomPart}>{p.part}</Text>
            <Text style={styles.bomCost}>${p.cost}</Text>
          </View>
        ))}
        <Text style={styles.bomNote}>
          ~5× cheaper than commercial precision-ag nodes ($1,000+). Offline-first, no cellular required.
        </Text>
      </Card>

      <Text style={styles.footnote}>
        AgriDefend · {NODE_INFO.species} · {NODE_INFO.location}
      </Text>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ArchRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.archRow}>
      <View style={[styles.archDot, { backgroundColor: color }]} />
      <Text style={styles.archLabel}>{label}</Text>
      <Text style={styles.archValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bg },
  content: { padding: Spacing.xl, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '700', color: Theme.text, letterSpacing: -0.6, marginTop: 4, marginBottom: Spacing.xl },

  connCard: { marginBottom: Spacing.xl },
  connTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  connIcon: { width: 42, height: 42, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  connTitle: { fontSize: 16, fontWeight: '700', color: Theme.text },
  connSub: { fontSize: 12.5, color: Theme.textSecondary, lineHeight: 18, marginTop: 2 },

  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Theme.accent,
    paddingVertical: 15,
    borderRadius: Radius.md,
  },
  primaryBtnDone: { backgroundColor: Theme.accentDim, borderWidth: 1, borderColor: Theme.accentBorder },
  primaryBtnText: { color: Theme.bg, fontSize: 15, fontWeight: '700' },

  blockLabel: { marginBottom: Spacing.md, marginTop: Spacing.xs },

  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl },
  rowIcon: { width: 38, height: 38, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: 14.5, fontWeight: '600', color: Theme.text },
  rowSub: { fontSize: 12, color: Theme.textTertiary, marginTop: 2 },

  modelHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.lg },
  modelName: { flex: 1, fontSize: 15, fontWeight: '700', color: Theme.text },

  statGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { fontFamily: Font.mono, fontSize: 20, color: Theme.text },
  statLabel: { fontFamily: Font.mono, fontSize: 9, color: Theme.textTertiary, letterSpacing: 1, marginTop: 4 },

  archRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  archDot: { width: 8, height: 8, borderRadius: 4 },
  archLabel: { flex: 1, fontSize: 13, color: Theme.textSecondary },
  archValue: { fontFamily: Font.mono, fontSize: 12.5, color: Theme.text },

  bomHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.md },
  bomTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: Theme.text },
  bomTotal: { fontFamily: Font.mono, fontSize: 20, color: Theme.accent },
  bomRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7 },
  bomPart: { fontSize: 13, color: Theme.textSecondary },
  bomCost: { fontFamily: Font.mono, fontSize: 13, color: Theme.text },
  bomNote: { fontSize: 11.5, color: Theme.textTertiary, lineHeight: 17, marginTop: Spacing.md },

  footnote: { textAlign: 'center', color: Theme.textTertiary, fontSize: 11, fontFamily: Font.mono, marginTop: Spacing.xl },
});
