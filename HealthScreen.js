import { useState, useRef } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Image,
  ActivityIndicator, ScrollView, Animated, Easing,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { detectDisease, getSeverityStyle } from './diseaseDetect';

export default function HealthScreen({ onBack }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const cameraRef = useRef(null);
  const scanLineY = useRef(new Animated.Value(0)).current;

  const startScanAnimation = () => {
    scanLineY.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineY, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanLineY, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const reset = () => {
    setPhoto(null);
    setResult(null);
    setError(null);
    setScanning(false);
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const captured = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setPhoto(captured.uri);
      setScanning(true);
      setError(null);
      startScanAnimation();

      const [diagnosis] = await Promise.all([
        detectDisease(captured.uri),
        new Promise(resolve => setTimeout(resolve, 1500)),
      ]);
      setResult(diagnosis);
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setError(e.message);
    } finally {
      setScanning(false);
    }
  };

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Camera access required</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Result screen
  if (photo) {
    const sevStyle = result ? getSeverityStyle(result.treatment.severity) : null;

    return (
      <View style={styles.container}>
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          {scanning && (
            <Animated.View
              style={[
                styles.scanBeam,
                {
                  transform: [{
                    translateY: scanLineY.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 290],
                    }),
                  }],
                },
              ]}
            />
          )}
        </View>

        <View style={styles.resultPanel}>
          <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
            {scanning && (
              <View style={styles.scanningBox}>
                <ActivityIndicator size="large" color="#ffb454" />
                <Text style={[styles.scanningText, { color: '#ffb454' }]}>
                  DIAGNOSING...
                </Text>
              </View>
            )}

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorTitle}>DIAGNOSIS FAILED</Text>
                <Text style={styles.errorMsg}>{error}</Text>
              </View>
            )}

            {result && sevStyle && (
              <>
                <Text style={styles.diagTag}>DIAGNOSTIC COMPLETE</Text>
                <Text style={styles.plantName}>{result.topResult.plantName}</Text>
                <Text style={styles.diseaseName}>
                  {result.topResult.isHealthy ? 'No disease detected' : result.topResult.diseaseName}
                </Text>

                {/* Severity badge */}
                <View style={[
                  styles.severityBadge,
                  { borderColor: sevStyle.color, backgroundColor: sevStyle.bg },
                ]}>
                  <Text style={[styles.severityLabel, { color: sevStyle.color }]}>
                    {sevStyle.label}
                  </Text>
                  <Text style={styles.severityConf}>
                    {result.topResult.confidence}% confidence
                  </Text>
                </View>

                {/* Low confidence warning */}
                {!result.isReliable && (
                  <View style={styles.unreliableBanner}>
                    <Text style={styles.unreliableText}>
                      ⓘ Low confidence ({result.topResult.confidence}%). This plant may not be in the model's training data. Best used for tomato, apple, corn, grape, potato and pepper plants.
                    </Text>
                  </View>
                )}

                {/* Vitality meters */}
                <View style={styles.metersRow}>
                  <View style={styles.meter}>
                    <Text style={styles.meterLabel}>VITALITY</Text>
                    <Text style={[
                      styles.meterValue,
                      {
                        color: result.vitality > 60
                          ? '#6cd9a3'
                          : result.vitality > 30
                          ? '#ffb454'
                          : '#ff7b8a'
                      },
                    ]}>
                      {result.vitality}%
                    </Text>
                    <View style={styles.meterBar}>
                      <View style={[
                        styles.meterFill,
                        {
                          width: `${result.vitality}%`,
                          backgroundColor: result.vitality > 60
                            ? '#6cd9a3'
                            : result.vitality > 30
                            ? '#ffb454'
                            : '#ff7b8a',
                        },
                      ]} />
                    </View>
                  </View>
                  <View style={styles.meter}>
                    <Text style={styles.meterLabel}>SEVERITY</Text>
                    <Text style={[styles.meterValue, { color: sevStyle.color }]}>
                      {sevStyle.label}
                    </Text>
                    <View style={styles.meterBar}>
                      <View style={[styles.meterFill, {
                        backgroundColor: sevStyle.color,
                        width: result.treatment.severity === 'none'     ? '5%'
                             : result.treatment.severity === 'low'      ? '25%'
                             : result.treatment.severity === 'moderate' ? '50%'
                             : result.treatment.severity === 'high'     ? '75%'
                             : result.treatment.severity === 'critical' ? '95%'
                             : '40%',
                      }]} />
                    </View>
                  </View>
                  <View style={styles.meter}>
                    <Text style={styles.meterLabel}>SPREAD</Text>
                    <Text style={[styles.meterValue, {
                      color: result.treatment.contagious ? '#ff7b8a' : '#6cd9a3',
                    }]}>
                      {result.treatment.contagious ? 'Yes' : 'No'}
                    </Text>
                    <View style={styles.meterBar}>
                      <View style={[styles.meterFill, {
                        backgroundColor: result.treatment.contagious ? '#ff7b8a' : '#6cd9a3',
                        width: result.treatment.contagious ? '80%' : '10%',
                      }]} />
                    </View>
                  </View>
                </View>

                {/* Treatment */}
                <View style={[styles.infoCard, { borderLeftColor: '#6cd9a3' }]}>
                  <Text style={[styles.cardTitle, { color: '#6cd9a3' }]}>TREATMENT</Text>
                  <Text style={styles.cardText}>{result.treatment.treatment}</Text>
                </View>

                {/* Prevention */}
                <View style={styles.infoCard}>
                  <Text style={styles.cardTitle}>PREVENTION</Text>
                  <Text style={styles.cardText}>{result.treatment.prevention}</Text>
                </View>

                {/* Contagious warning */}
                {result.treatment.contagious && !result.topResult.isHealthy && (
                  <View style={styles.contagiousBanner}>
                    <Text style={styles.contagiousText}>
                      ⚠ CONTAGIOUS — Isolate from other plants. Sanitize tools after handling.
                    </Text>
                  </View>
                )}

                {/* Other possibilities */}
                {result.allResults.length > 1 && (
                  <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>OTHER DIAGNOSES</Text>
                    {result.allResults.slice(1, 4).map((r, i) => (
                      <Text key={i} style={styles.cardText}>
                        • {r.plantName} — {r.diseaseName} ({r.confidence}%)
                      </Text>
                    ))}
                  </View>
                )}
              </>
            )}

            <TouchableOpacity style={styles.btn} onPress={reset}>
              <Text style={styles.btnText}>Scan another leaf</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Nav bar */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navBtn} onPress={onBack}>
            <Text style={styles.navIcon}>◎</Text>
            <Text style={styles.navLabel}>SCAN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn}>
            <Text style={[styles.navIcon, { color: '#ffb454' }]}>✚</Text>
            <Text style={[styles.navLabel, { color: '#ffb454' }]}>HEALTH</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Camera viewfinder
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      <View style={styles.hud} pointerEvents="none">
        <View style={[styles.corner, styles.tl, { borderColor: '#ffb454' }]} />
        <View style={[styles.corner, styles.tr, { borderColor: '#ffb454' }]} />
        <View style={[styles.corner, styles.bl, { borderColor: '#ffb454' }]} />
        <View style={[styles.corner, styles.br, { borderColor: '#ffb454' }]} />
      </View>

      <View style={[styles.topLabel, { borderColor: 'rgba(255, 180, 84, 0.45)' }]} pointerEvents="none">
        <Text style={[styles.topLabelText, { color: '#ffb454' }]}>✚ HEALTH SCAN</Text>
      </View>

      <View style={styles.tipBox} pointerEvents="none">
        <Text style={styles.tipText}>
          Best results: tomato, apple, corn, grape, potato, pepper leaves
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.captureBtn, {
          backgroundColor: '#ffb454',
          borderColor: 'rgba(255, 220, 180, 0.85)',
        }]}
        onPress={takePhoto}
      >
        <View style={[styles.captureBtnInner, { backgroundColor: '#e09530' }]} />
      </TouchableOpacity>

      {/* Nav bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBtn} onPress={onBack}>
          <Text style={styles.navIcon}>◎</Text>
          <Text style={styles.navLabel}>SCAN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn}>
          <Text style={[styles.navIcon, { color: '#ffb454' }]}>✚</Text>
          <Text style={[styles.navLabel, { color: '#ffb454' }]}>HEALTH</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1a1f' },
  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#0a1a1f', padding: 24,
  },
  camera: { flex: 1 },
  preview: { width: '100%', height: '100%', resizeMode: 'cover' },
  previewContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
    overflow: 'hidden',
  },
  scanBeam: {
    position: 'absolute', left: 0, right: 0,
    height: 2, backgroundColor: '#ffb454',
    shadowColor: '#ffb454', shadowOpacity: 1, shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 }, elevation: 12,
  },
  text: { color: '#e8fffb', fontSize: 15, marginBottom: 20, textAlign: 'center' },
  topLabel: {
    position: 'absolute', top: 60, alignSelf: 'center',
    backgroundColor: 'rgba(15, 42, 48, 0.85)',
    borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 4,
  },
  topLabelText: { fontSize: 11, letterSpacing: 2, fontWeight: '500' },
  tipBox: {
    position: 'absolute', bottom: 180, alignSelf: 'center',
    backgroundColor: 'rgba(10, 26, 31, 0.85)',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4,
    maxWidth: '80%',
  },
  tipText: {
    color: '#8fb4b0', fontSize: 11, textAlign: 'center', lineHeight: 16,
  },
  hud: { position: 'absolute', top: 110, left: 32, right: 32, bottom: 200 },
  corner: { position: 'absolute', width: 28, height: 28, borderWidth: 2 },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  captureBtn: {
    position: 'absolute', bottom: 100, alignSelf: 'center',
    width: 76, height: 76, borderRadius: 38,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3,
  },
  captureBtnInner: { width: 60, height: 60, borderRadius: 30 },

  resultPanel: {
    position: 'absolute', top: '40%', left: 0, right: 0, bottom: 56,
    backgroundColor: 'rgba(10, 26, 31, 0.97)', padding: 22,
    borderTopWidth: 1, borderColor: 'rgba(255, 180, 84, 0.45)',
  },
  scanningBox: { alignItems: 'center', paddingVertical: 40 },
  scanningText: { marginTop: 16, letterSpacing: 3, fontSize: 12, fontWeight: '500' },
  errorBox: {
    backgroundColor: 'rgba(255, 123, 138, 0.1)',
    borderLeftWidth: 2, borderLeftColor: '#ff7b8a',
    padding: 14, marginBottom: 16, borderRadius: 4,
  },
  errorTitle: {
    color: '#ff7b8a', fontSize: 11, letterSpacing: 2, marginBottom: 6, fontWeight: '600',
  },
  errorMsg: { color: '#e8fffb', fontSize: 13, lineHeight: 18 },

  diagTag: { color: '#ffb454', fontSize: 10, letterSpacing: 2, marginBottom: 6 },
  plantName: { color: '#e8fffb', fontSize: 20, fontWeight: '600', marginBottom: 2 },
  diseaseName: { color: '#ffb454', fontSize: 14, fontStyle: 'italic', marginBottom: 14 },

  severityBadge: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1.5, borderRadius: 6,
    padding: 12, marginBottom: 12,
  },
  severityLabel: { fontSize: 13, letterSpacing: 2.5, fontWeight: '700' },
  severityConf: { color: '#8fb4b0', fontSize: 11, letterSpacing: 1 },

  unreliableBanner: {
    backgroundColor: 'rgba(143, 180, 176, 0.15)',
    borderWidth: 1, borderColor: '#8fb4b0',
    padding: 10, borderRadius: 4, marginBottom: 14,
  },
  unreliableText: {
    color: '#8fb4b0', fontSize: 11, lineHeight: 16, textAlign: 'center',
  },

  metersRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  meter: {
    flex: 1, backgroundColor: 'rgba(15, 42, 48, 0.78)',
    borderWidth: 1, borderColor: 'rgba(79, 229, 212, 0.2)',
    borderRadius: 4, padding: 10, alignItems: 'center',
  },
  meterLabel: {
    color: '#8fb4b0', fontSize: 7, letterSpacing: 1.5, marginBottom: 4,
  },
  meterValue: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  meterBar: {
    width: '100%', height: 3,
    backgroundColor: 'rgba(79, 229, 212, 0.1)',
    borderRadius: 2, overflow: 'hidden',
  },
  meterFill: { height: '100%', borderRadius: 2 },

  infoCard: {
    backgroundColor: 'rgba(15, 42, 48, 0.78)', padding: 14, borderRadius: 4,
    borderWidth: 1, borderColor: 'rgba(79, 229, 212, 0.25)',
    borderLeftWidth: 2, borderLeftColor: '#f3c46a', marginBottom: 12,
  },
  cardTitle: { color: '#f3c46a', fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  cardText: { color: '#e8fffb', fontSize: 13, lineHeight: 20 },

  contagiousBanner: {
    backgroundColor: 'rgba(255, 123, 138, 0.2)',
    borderWidth: 1, borderColor: '#ff7b8a',
    padding: 10, borderRadius: 4, marginBottom: 12,
  },
  contagiousText: {
    color: '#ff7b8a', fontSize: 11, fontWeight: '600',
    letterSpacing: 1, textAlign: 'center', lineHeight: 16,
  },

  btn: {
    backgroundColor: '#ffb454', paddingHorizontal: 28, paddingVertical: 14,
    borderRadius: 6, marginTop: 8, alignSelf: 'center',
  },
  btnText: { color: '#0a1a1f', fontWeight: '700', letterSpacing: 2, fontSize: 12 },

  navBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 56, flexDirection: 'row',
    backgroundColor: 'rgba(6, 18, 22, 0.95)',
    borderTopWidth: 1, borderTopColor: 'rgba(79, 229, 212, 0.2)',
  },
  navBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navIcon: { color: '#8fb4b0', fontSize: 20, marginBottom: 2 },
  navLabel: { color: '#8fb4b0', fontSize: 8, letterSpacing: 2, fontWeight: '600' },
});