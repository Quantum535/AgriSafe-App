export const getSensorData = (isZeroed = false) => {
    if (isZeroed) {
        return {
            soilMoisture: 0,
            co2Levels: 0,
            soilPh: 0,
            npkStatus: 'Waiting...',
            overallHealth: 'Scanning...',
            confidence: 0,
        };
    }

    // Bothell WA in Early March (Cold, wet raining season, pre-spring)
    // High moisture from rain, slightly acidic soil common in PNW, lower CO2 locally outdoors
    const moistureVariance = Math.floor(Math.random() * 5) - 2; // -2 to +2
    const co2Variance = Math.floor(Math.random() * 11) - 5; // -5 to +5
    const confidenceVariance = Math.floor(Math.random() * 3) - 1; // -1 to +1

    return {
        soilMoisture: Math.max(0, Math.min(100, 85 + moistureVariance)), // high moisture
        co2Levels: Math.max(300, 405 + co2Variance), // Ambient outdoor
        soilPh: +(6.2 + (Math.random() * 0.2 - 0.1)).toFixed(1), // 6.1-6.3 slightly acidic
        npkStatus: 'Slightly Low N', // Typical before spring fertilizing
        overallHealth: 'Dormant / Healthy',
        confidence: Math.max(0, Math.min(100, 96 + confidenceVariance)),
    };
};

export const getHistoricalMoisture = () => {
    return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                data: [30, 32, 28, 38, 42, 45, 42],
                color: (opacity = 1) => `rgba(39, 174, 96, ${opacity})`,
                strokeWidth: 2
            }
        ],
        legend: ["Soil Moisture (%)"]
    };
};
