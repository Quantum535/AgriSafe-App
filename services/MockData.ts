/**
 * Mock telemetry for the AgriSafe companion app. All values are grounded in the
 * AgriDefend paper (Xu & Vincent, 2026): a multimodal late-fusion edge model
 * (MobileNetV2 vision branch + Random Forest soil branch -> logistic-regression
 * meta-learner) running on a $205 Raspberry Pi 5 node, evaluated in situ on
 * Raphanus raphanistrum at Bothell, WA. Reported metrics: 87% accuracy,
 * R^2 = 0.88, MAE = 0.05, 1.4 s TFLite latency; subterranean stress indicators
 * lead visible canopy wilting by ~4 days.
 */

import { HealthClassKey } from '@/constants/Colors';

// ── Static node / model / hardware metadata ──────────────────────────────────

export const NODE_INFO = {
  id: 'NODE-01',
  name: 'AgriSafe Node 01',
  location: 'Bothell, WA',
  coords: '47.7601° N, 122.2054° W',
  species: 'Raphanus raphanistrum',
  speciesCommon: 'Wild Radish',
  firmware: 'v2.3.1',
};

export const MODEL_INFO = {
  name: 'AgriDefend Late-Fusion v2',
  accuracy: 87,
  r2: 0.88,
  mae: 0.05,
  latencyMs: 1400,
  visionBackbone: 'MobileNetV2',
  soilModel: 'Random Forest',
  fusion: 'Logistic Regression',
  runtime: 'TensorFlow Lite',
  leadTimeDays: 4,
  trainImages: 3165,
};

export const HARDWARE_BOM = [
  { part: 'Raspberry Pi 5', qty: 1, cost: 60 },
  { part: 'Arducam Module', qty: 1, cost: 25 },
  { part: 'RS-485 7-in-1 Soil Sensor', qty: 1, cost: 75 },
  { part: 'MH-Z19C CO₂ Sensor', qty: 1, cost: 20 },
  { part: 'ADS1115 + MAX485 ICs', qty: 1, cost: 10 },
  { part: 'Weatherproof Case (3D)', qty: 1, cost: 15 },
];

export const HARDWARE_TOTAL = HARDWARE_BOM.reduce((s, p) => s + p.cost, 0); // 205

// ── Live sensor frame ────────────────────────────────────────────────────────

export interface SensorFrame {
  soilMoisture: number; // %
  soilTemp: number; // °C
  soilPh: number;
  ec: number; // µS/cm electrical conductivity (7-in-1 sensor)
  nitrogen: number; // mg/kg
  phosphorus: number; // mg/kg
  potassium: number; // mg/kg
  co2Flux: number; // ppm — MH-Z19C differential respiration
  npkStatus: string;
  health: HealthClassKey | 'Scanning…';
  confidence: number; // %
  // Probability split from the two fusion branches.
  visionConf: number;
  soilConf: number;
}

const jitter = (base: number, spread: number, dp = 0) =>
  +(base + (Math.random() * 2 - 1) * spread).toFixed(dp);

export const getSensorData = (isZeroed = false): SensorFrame => {
  if (isZeroed) {
    return {
      soilMoisture: 0,
      soilTemp: 0,
      soilPh: 0,
      ec: 0,
      nitrogen: 0,
      phosphorus: 0,
      potassium: 0,
      co2Flux: 0,
      npkStatus: 'Standby',
      health: 'Scanning…',
      confidence: 0,
      visionConf: 0,
      soilConf: 0,
    };
  }

  // Bothell, WA, early spring: wet PNW soil, slightly acidic, cool ambient.
  return {
    soilMoisture: jitter(58, 2),
    soilTemp: jitter(11.4, 0.4, 1),
    soilPh: jitter(6.2, 0.08, 2),
    ec: jitter(412, 14),
    nitrogen: jitter(38, 3),
    phosphorus: jitter(21, 2),
    potassium: jitter(176, 6),
    co2Flux: jitter(486, 22),
    npkStatus: 'Slightly Low N',
    health: 'Healthy',
    confidence: jitter(91, 1),
    visionConf: jitter(88, 2),
    soilConf: jitter(93, 1),
  };
};

// ── Five-class probability distribution (late-fusion output) ─────────────────

export interface ClassProb {
  key: HealthClassKey;
  prob: number; // 0..1
}

export const getHealthDistribution = (): ClassProb[] => {
  const raw = [
    { key: 'Healthy' as const, prob: jitter(0.62, 0.03, 3) },
    { key: 'Mild Stress' as const, prob: jitter(0.24, 0.02, 3) },
    { key: 'Moderate Stress' as const, prob: jitter(0.09, 0.01, 3) },
    { key: 'Severe Stress' as const, prob: jitter(0.035, 0.005, 3) },
    { key: 'Critical' as const, prob: jitter(0.015, 0.004, 3) },
  ];
  const total = raw.reduce((s, r) => s + r.prob, 0);
  return raw.map((r) => ({ ...r, prob: r.prob / total }));
};

// Distribution shown on the Diagnostic screen — a leaf flagged with early
// nitrogen-deficiency signatures (mild stress dominant but not yet critical).
export const getDiagnosticDistribution = (): ClassProb[] => {
  const raw = [
    { key: 'Healthy' as const, prob: 0.18 },
    { key: 'Mild Stress' as const, prob: 0.57 },
    { key: 'Moderate Stress' as const, prob: 0.16 },
    { key: 'Severe Stress' as const, prob: 0.06 },
    { key: 'Critical' as const, prob: 0.03 },
  ];
  const total = raw.reduce((s, r) => s + r.prob, 0);
  return raw.map((r) => ({ ...r, prob: r.prob / total }));
};

// ── Time-series helpers for the Trends screen ────────────────────────────────

export interface Series {
  label: string;
  unit: string;
  points: number[];
  labels: string[];
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOUR_LABELS = ['00', '04', '08', '12', '16', '20', '24'];
const MONTH_LABELS = ['W1', 'W2', 'W3', 'W4'];

type Timeframe = '24h' | '7d' | '30d';

const labelsFor = (tf: Timeframe) =>
  tf === '24h' ? HOUR_LABELS : tf === '30d' ? MONTH_LABELS : DAY_LABELS;

const wobble = (base: number[], amp: number) =>
  base.map((v) => +(v + (Math.random() * 2 - 1) * amp).toFixed(1));

export const getMoistureSeries = (tf: Timeframe = '7d'): Series => {
  const base: Record<Timeframe, number[]> = {
    '24h': [61, 60, 59, 58, 57, 58, 58],
    '7d': [64, 62, 61, 59, 58, 57, 58],
    '30d': [66, 62, 59, 58],
  };
  return { label: 'Soil Moisture', unit: '%', points: wobble(base[tf], 1.2), labels: labelsFor(tf) };
};

export const getCo2Series = (tf: Timeframe = '7d'): Series => {
  const base: Record<Timeframe, number[]> = {
    '24h': [452, 468, 491, 504, 498, 480, 472],
    '7d': [470, 478, 486, 492, 498, 503, 486],
    '30d': [455, 472, 489, 498],
  };
  return { label: 'CO₂ Flux', unit: 'ppm', points: wobble(base[tf], 6), labels: labelsFor(tf) };
};

export const getPhSeries = (tf: Timeframe = '7d'): Series => {
  const base: Record<Timeframe, number[]> = {
    '24h': [6.3, 6.3, 6.2, 6.2, 6.1, 6.2, 6.2],
    '7d': [6.4, 6.3, 6.3, 6.2, 6.2, 6.1, 6.2],
    '30d': [6.5, 6.3, 6.2, 6.2],
  };
  return { label: 'Soil pH', unit: 'pH', points: wobble(base[tf], 0.04), labels: labelsFor(tf) };
};

/**
 * Figure 11 — 7-day water-deprivation trial. As available soil moisture falls
 * from 60% to 15%, the model's "Stressed" confidence rises from 5% to 92%,
 * and subterranean indicators move ~4 days ahead of visible canopy wilting.
 */
export const getWaterDeprivationTrial = () => ({
  labels: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'],
  moisture: [60, 54, 46, 37, 29, 21, 15],
  stressConfidence: [5, 9, 18, 41, 66, 84, 92],
  wiltOnsetDay: 6, // visible canopy wilting observed late...
  detectionDay: 2, // ...but subterranean signal flagged ~4 days earlier
});

// ── Treatment protocol shown after a diagnostic ──────────────────────────────

export const TREATMENT_PROTOCOL = {
  title: 'Nitrogen Deficiency — Early Stage',
  steps: [
    'Apply a light localized nitrogen top-dress (≈30 kg N/ha) to the affected row only.',
    'Re-scan affected canopy in 48 h to confirm chlorophyll recovery in leaf margins.',
    'Hold irrigation — root-zone moisture is above field capacity (61.6 kPa).',
  ],
};
