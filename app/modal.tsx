import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { MapPin, Sprout, Cpu } from 'lucide-react-native';

import { Card, SectionLabel, Divider } from '@/components/ui';
import { Theme, Spacing, Font } from '@/constants/Colors';
import { NODE_INFO, MODEL_INFO } from '@/services/MockData';

export default function ModalScreen() {
  const rows = [
    { label: 'Node ID', value: NODE_INFO.id },
    { label: 'Firmware', value: NODE_INFO.firmware },
    { label: 'Location', value: NODE_INFO.location },
    { label: 'Coordinates', value: NODE_INFO.coords },
    { label: 'Species', value: NODE_INFO.species },
    { label: 'Runtime', value: MODEL_INFO.runtime },
    { label: 'Accuracy', value: `${MODEL_INFO.accuracy}%` },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionLabel>Node Details</SectionLabel>
        <Text style={styles.title}>{NODE_INFO.name}</Text>

        <View style={styles.tags}>
          <Tag icon={<MapPin size={13} color={Theme.accent} />} text={NODE_INFO.location} />
          <Tag icon={<Sprout size={13} color={Theme.vision} />} text={NODE_INFO.speciesCommon} />
          <Tag icon={<Cpu size={13} color={Theme.caution} />} text={MODEL_INFO.visionBackbone} />
        </View>

        <Card>
          {rows.map((r, i) => (
            <View key={r.label}>
              {i > 0 && <Divider />}
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{r.label}</Text>
                <Text style={styles.rowValue}>{r.value}</Text>
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

function Tag({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={styles.tag}>
      {icon}
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bg },
  content: { padding: Spacing.xl },
  title: { fontSize: 26, fontWeight: '700', color: Theme.text, letterSpacing: -0.6, marginTop: 4, marginBottom: Spacing.lg },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Theme.surface,
    borderWidth: 1,
    borderColor: Theme.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: { fontSize: 12, color: Theme.textSecondary },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.md },
  rowLabel: { fontSize: 13.5, color: Theme.textSecondary },
  rowValue: { fontFamily: Font.mono, fontSize: 13, color: Theme.text },
});
