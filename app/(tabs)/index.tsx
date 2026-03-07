import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Wifi } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { DashboardCard } from '@/components/DashboardCard';
import { Colors } from '@/constants/Colors';
import { getSensorData } from '@/services/MockData';

export default function HomeScreen() {
  const router = useRouter();
  const [data, setData] = useState(getSensorData(true)); // Start at 0
  const [isLive, setIsLive] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLive) {
      // Immediate jump first
      setData(getSensorData(false));
      interval = setInterval(() => {
        setData(getSensorData(false));
      }, 1500);
    } else {
      setData(getSensorData(true)); // Reset to 0 when stopped
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AgriSafe Node 1</Text>
        <View style={styles.onlineBadge}>
          <Wifi size={14} color={Colors.light.primary} />
          <Text style={styles.onlineText}>Online</Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setIsLive(!isLive)}
      >
        <View style={[styles.heroCard, isLive ? styles.healthySkin : styles.dangerSkin]}>
          <Text style={styles.heroTitle}>AI Plant Health (Bothell, WA)</Text>
          <View style={styles.heroStatusRow}>
            <Text style={styles.heroStatus}>{data.overallHealth}</Text>
            {isLive && <Text style={styles.heroConfidence}>{data.confidence}% Conf</Text>}
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.grid}>
        <DashboardCard
          title="Soil Moisture"
          value={`${data.soilMoisture}%`}
        />
        <DashboardCard
          title="CO2 Levels"
          value={`${data.co2Levels} ppm`}
        />
        <DashboardCard
          title="Soil pH"
          value={data.soilPh}
        />
        <DashboardCard
          title="NPK Status"
          value={data.npkStatus}
        />
      </View>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          setShowSuggestion(true);
          setTimeout(() => {
            router.push('/diagnostic');
            setShowSuggestion(false);
          }, 3000);
        }}
      >
        <Text style={styles.actionButtonText}>Run AI Diagnostic</Text>
      </TouchableOpacity>

      {showSuggestion && (
        <View style={styles.suggestionCard}>
          <Text style={styles.suggestionTitle}>AI Insight ✨</Text>
          <Text style={styles.suggestionText}>
            Soil moisture is at 85% due to recent Bothell rainfall. Hold off on irrigation for the next 72 hours. Consider a light localized nitrogen application as spring approaches.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  onlineText: {
    color: Colors.light.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  heroCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  healthySkin: {
    backgroundColor: Colors.light.primary,
  },
  dangerSkin: {
    backgroundColor: Colors.light.danger,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.9,
  },
  heroStatusRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  heroStatus: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  heroConfidence: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionButton: {
    backgroundColor: Colors.light.text,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  suggestionCard: {
    marginTop: 24,
    backgroundColor: '#F0F9FF', // Light blue tint for AI suggestion
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0284C7',
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
});
