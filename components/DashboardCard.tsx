import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface DashboardCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

export function DashboardCard({ title, value, icon, fullWidth = false }: DashboardCardProps) {
    return (
        <View style={[styles.card, fullWidth && styles.fullWidth]}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                {icon}
            </View>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.light.cardBackground,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        width: '48%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#EAEAEA',
    },
    fullWidth: {
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 14,
        color: Colors.light.secondaryText,
        fontFamily: 'Helvetica Neue',
        fontWeight: '600',
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
});
