import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useState } from 'react';
import { Colors } from '@/constants/Colors';
import { getHistoricalMoisture } from '@/services/MockData';

const screenWidth = Dimensions.get('window').width;

export default function TrendsScreen() {
    const [timeframe, setTimeframe] = useState('7d');
    const data = getHistoricalMoisture();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.headerTitle}>Historical Trends</Text>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Soil Moisture</Text>
                    <View style={styles.toggleGroup}>
                        {['24h', '7d', '30d'].map((tf) => (
                            <TouchableOpacity
                                key={tf}
                                style={[styles.toggleBtn, timeframe === tf && styles.toggleBtnActive]}
                                onPress={() => setTimeframe(tf)}
                            >
                                <Text style={[styles.toggleText, timeframe === tf && styles.toggleTextActive]}>{tf}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <LineChart
                    data={data}
                    width={screenWidth - 80}
                    height={220}
                    chartConfig={{
                        backgroundColor: Colors.light.cardBackground,
                        backgroundGradientFrom: Colors.light.cardBackground,
                        backgroundGradientTo: Colors.light.cardBackground,
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(39, 174, 96, ${opacity})`,
                        labelColor: (opacity = 1) => Colors.light.secondaryText,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: '4',
                            strokeWidth: '2',
                            stroke: Colors.light.primary,
                        },
                    }}
                    bezier
                    style={styles.chart}
                />
            </View>
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
    card: {
        backgroundColor: Colors.light.cardBackground,
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#EAEAEA',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.light.text,
    },
    toggleGroup: {
        flexDirection: 'row',
        backgroundColor: '#EAEAEA',
        borderRadius: 8,
        padding: 2,
    },
    toggleBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    toggleBtnActive: {
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    toggleText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.light.secondaryText,
    },
    toggleTextActive: {
        color: Colors.light.text,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
        marginLeft: -16, // Adjust padding inside chart
    },
});
