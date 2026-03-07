import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Scan, ChevronsUp } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function DiagnosticScreen() {
    return (
        <View style={styles.container}>
            {/* Camera/Image Placeholder View */}
            <View style={styles.cameraPlaceholder}>
                <View style={styles.scannerOverlay}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                    <Scan size={48} color={Colors.light.primary} style={styles.scanIcon} />
                </View>
                <Text style={styles.placeholderText}>Camera Feed Placeholder</Text>
            </View>

            {/* Results Drawer (Bottom Sheet Mock) */}
            <View style={styles.drawer}>
                <View style={styles.drawerHandle} />
                <View style={styles.drawerHeader}>
                    <Text style={styles.drawerTitle}>Diagnostic Results</Text>
                    <ChevronsUp size={20} color={Colors.light.secondaryText} />
                </View>
                <View style={styles.resultItem}>
                    <View style={styles.resultBadge}>
                        <Text style={styles.resultBadgeText}>Detection</Text>
                    </View>
                    <Text style={styles.resultText}>Signs of nitrogen deficiency detected in leaf edges.</Text>
                </View>

                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>View Treatment Protocol</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Dark bg for camera view
    },
    cameraPlaceholder: {
        flex: 1,
        backgroundColor: '#2C3E50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scannerOverlay: {
        width: 250,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: Colors.light.primary,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 4,
        borderLeftWidth: 4,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 4,
        borderRightWidth: 4,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 4,
        borderRightWidth: 4,
    },
    scanIcon: {
        opacity: 0.8,
    },
    placeholderText: {
        color: '#FFF',
        marginTop: 24,
        fontSize: 16,
        opacity: 0.6,
    },
    drawer: {
        backgroundColor: Colors.light.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingTop: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    drawerHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#EAEAEA',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    drawerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    drawerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    resultItem: {
        backgroundColor: Colors.light.cardBackground,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.light.border,
        marginBottom: 24,
    },
    resultBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 8,
    },
    resultBadgeText: {
        color: Colors.light.danger,
        fontSize: 12,
        fontWeight: '600',
    },
    resultText: {
        fontSize: 15,
        color: Colors.light.text,
        lineHeight: 22,
    },
    actionButton: {
        backgroundColor: Colors.light.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
