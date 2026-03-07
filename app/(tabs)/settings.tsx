import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { DownloadCloud, CloudOff, RefreshCw } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function SettingsScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.headerTitle}>Offline & Sync</Text>

            <View style={styles.statusCard}>
                <View style={styles.statusHeaderRow}>
                    <CloudOff size={24} color={Colors.light.warning} />
                    <Text style={styles.statusTitle}>Offline Mode</Text>
                </View>
                <Text style={styles.statusText}>
                    AgriSafe is currently operating without internet access. Data is stored locally and will sync when connected to an AgriSafe Node.
                </Text>
            </View>

            <TouchableOpacity style={styles.primaryBtn}>
                <RefreshCw size={20} color="#FFF" />
                <Text style={styles.btnText}>Connect to AgriSafe Node</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn}>
                <DownloadCloud size={20} color={Colors.light.primary} />
                <Text style={styles.secondaryBtnText}>Export Data to CSV</Text>
            </TouchableOpacity>
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
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 32,
    },
    statusCard: {
        backgroundColor: '#FFF8E1', // Warning light bg
        borderRadius: 16,
        padding: 24,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(243, 156, 18, 0.2)',
    },
    statusHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D68910',
    },
    statusText: {
        fontSize: 15,
        color: Colors.light.text,
        lineHeight: 22,
        opacity: 0.8,
    },
    primaryBtn: {
        backgroundColor: Colors.light.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        gap: 12,
        marginBottom: 16,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    btnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryBtn: {
        backgroundColor: Colors.light.cardBackground,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: Colors.light.primary,
    },
    secondaryBtnText: {
        color: Colors.light.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
