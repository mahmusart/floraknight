import { useState, useRef } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Image,
  ActivityIndicator, ScrollView, Animated, Easing,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Sharing from 'expo-sharing';
import { identifyPlant } from './plantNet';
import { getSafetyInfo, getCategoryStyle } from './plantSafety';
import { saveScan } from './database';
import ShareCard from './ShareCard';
import CodexScreen from './CodexScreen';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [screen, setScreen] = useState('scanner'); // 'scanner' or 'codex'
  const [codexEntry, setCodexEntry] = useState(null); // viewing a saved entry
  const cameraRef = useRef(null);
  const shareRef = useRef(null);
  const scanLineY = useRef(new Animated.Value(0)).current;

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>FLORAKNIGHT</Text>
        <Text style={styles.text}>Camera access required to scan plants</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant access</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
    setSharing(false);
    setCodexEntry(null);
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const captured = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setPhoto(captured.uri);
      setScanning(true);
      setError(null);
      startScanAnimation();

      const [identified] = await Promise.all([
        identifyPlant(captured.uri),
        new Promise(resolve => setTimeout(resolve, 1200)),
      ]);
      setResult(identified);

      // Auto-save to codex
      const safety = getSafetyInfo(identified.scientificName) || {
        category: 'unknown', summary: '', uses: [], warnings: [],
      };
      try {
        await saveScan(identified, safety, captured.uri);
      } catch (saveErr) {
        console.log('Save to codex failed:', saveErr);
      }
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setError(e.message);
    } finally {
      setScanning(false);
    }
  };

  const handleShare = async () => {
    if (!shareRef.current) return;
    try {
      setSharing(true);
      const uri = await shareRef.current.capture();
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        alert('Sharing is not available on this device');
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share your FloraKnight discovery',
      });
    } catch (e) {
      console.log('Share cancelled or failed:', e);
    } finally {
      setSharing(false);
    }
  };

  const handleViewEntry = (entry) => {
    setCodexEntry(entry);
    setScreen('scanner');
  };

  // Compute safety
  const activeResult = codexEntry || result;
  const safety = activeResult
    ? getSafetyInfo(activeResult.scientificName) || {
        category: 'unknown',
        summary: 'Safety data not yet in our codex for this species. Research before handling or consuming.',
        uses: [],
        warnings: [],
      }
    : null;
  const catStyle = safety ? getCategoryStyle(safety.category) : null;

  // ========== CODEX SCREEN ==========
  if (screen === 'codex') {
    return (
      <CodexScreen
        onBack={() => { reset(); setScreen('scanner'); }}
        onViewEntry={handleViewEntry}
      />
    );
  }

  // ========== CODEX ENTRY VIEW ==========
  if (codexEntry) {
    return (
      <View style={styles.container}>
        <View style={styles.previewContainer}>
          {codexEntry.photoUri ? (
            <Image source={{ uri: codexEntry.photoUri }} style={styles.preview} />
          ) : (
            <View style={[styles.preview, { backgroundColor: '#0f2a30' }]} />
          )}
        </View>

        <View style={styles.resultPanel}>
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={styles.codexTag}>CODEX ENTRY</Text>
            <Text style={styles.species}>{codexEntry.commonName}</Text>
            <Text style={styles.latin}>{codexEntry.scientificName}</Text>

            {safety && catStyle && (
              <View style={[
                styles.safetyBadge,
                { borderColor: catStyle.color, backgroundColor: catStyle.color + '15' },
              ]}>
                <Text style={[styles.safetyIcon, { color: catStyle.color }]}>
                  {catStyle.icon}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.safetyLabel, { color: catStyle.color }]}>
                    {catStyle.label}
                  </Text>
                  <Text style={styles.safetySummary}>{safety.summary}</Text>
                </View>
              </View>
            )}

            {safety && safety.uses.length > 0 && (
              <View style={styles.infoCard}>
                <Text style={styles.cardTitle}>USES</Text>
                {safety.uses.map((use, i) => (
                  <Text key={i} style={styles.cardText}>• {use}</Text>
                ))}
              </View>
            )}

            {safety && safety.warnings.length > 0 && (
              <View style={[styles.infoCard, { borderLeftColor: '#ffb454' }]}>
                <Text style={[styles.cardTitle, { color: '#ffb454' }]}>WARNINGS</Text>
                {safety.warnings.map((warn, i) => (
                  <Text key={i} style={styles.cardText}>• {warn}</Text>
                ))}
              </View>
            )}

            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>TAXONOMY</Text>
              <Text style={styles.cardText}>Family: {codexEntry.family}</Text>
              <Text style={styles.cardText}>Genus: {codexEntry.genus}</Text>
            </View>

            <Text style={styles.scannedAt}>
              Scanned: {new Date(codexEntry.scannedAt).toLocaleDateString()}
            </Text>

            <TouchableOpacity style={styles.btn} onPress={reset}>
              <Text style={styles.btnText}>Back to scanner</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Nav bar */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navBtn} onPress={reset}>
            <Text style={styles.navIcon}>◎</Text>
            <Text style={styles.navLabel}>SCAN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => { reset(); setScreen('codex'); }}>
            <Text style={[styles.navIcon, { color: '#f3c46a' }]}>☰</Text>
            <Text style={[styles.navLabel, { color: '#f3c46a' }]}>CODEX</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ========== RESULT SCREEN ==========
  if (photo) {
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
                <ActivityIndicator size="large" color="#4fe5d4" />
                <Text style={styles.scanningText}>ANALYZING SUBJECT...</Text>
              </View>
            )}

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorTitle}>SCAN FAILED</Text>
                <Text style={styles.errorMsg}>{error}</Text>
              </View>
            )}

            {result && safety && catStyle && (
              <>
                <Text style={styles.codexTag}>SUBJECT IDENTIFIED</Text>
                <Text style={styles.species}>{result.commonName}</Text>
                <Text style={styles.latin}>{result.scientificName}</Text>

                <View style={[
                  styles.safetyBadge,
                  { borderColor: catStyle.color, backgroundColor: catStyle.color + '15' },
                ]}>
                  <Text style={[styles.safetyIcon, { color: catStyle.color }]}>
                    {catStyle.icon}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.safetyLabel, { color: catStyle.color }]}>
                      {catStyle.label}
                    </Text>
                    <Text style={styles.safetySummary}>{safety.summary}</Text>
                  </View>
                </View>

                {safety.category === 'toxic' && (
                  <View style={styles.dangerBanner}>
                    <Text style={styles.dangerText}>
                      ⚠ DO NOT CONSUME — KEEP AWAY FROM CHILDREN AND PETS
                    </Text>
                  </View>
                )}

                <View style={styles.confidenceBox}>
                  <Text style={styles.label}>MATCH CONFIDENCE</Text>
                  <Text style={styles.confidenceValue}>{result.confidence}%</Text>
                  <View style={styles.confBar}>
                    <View style={[styles.confFill, { width: `${result.confidence}%` }]} />
                  </View>
                </View>

                {safety.uses.length > 0 && (
                  <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>USES</Text>
                    {safety.uses.map((use, i) => (
                      <Text key={i} style={styles.cardText}>• {use}</Text>
                    ))}
                  </View>
                )}

                {safety.warnings.length > 0 && (
                  <View style={[styles.infoCard, { borderLeftColor: '#ffb454' }]}>
                    <Text style={[styles.cardTitle, { color: '#ffb454' }]}>WARNINGS</Text>
                    {safety.warnings.map((warn, i) => (
                      <Text key={i} style={styles.cardText}>• {warn}</Text>
                    ))}
                  </View>
                )}

                <View style={styles.infoCard}>
                  <Text style={styles.cardTitle}>TAXONOMY</Text>
                  <Text style={styles.cardText}>Family: {result.family}</Text>
                  <Text style={styles.cardText}>Genus: {result.genus}</Text>
                </View>

                {result.allMatches.length > 1 && (
                  <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>OTHER POSSIBILITIES</Text>
                    {result.allMatches.slice(1).map((m, i) => (
                      <Text key={i} style={styles.cardText}>
                        {m.commonName} — {m.confidence}%
                      </Text>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={styles.shareBtn}
                  onPress={handleShare}
                  disabled={sharing}
                >
                  <Text style={styles.shareBtnText}>
                    {sharing ? 'PREPARING...' : '↗ SHARE DISCOVERY'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity style={styles.btn} onPress={reset}>
              <Text style={styles.btnText}>Scan another</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Hidden share card */}
        {result && safety && (
          <View style={styles.offscreen}>
            <ShareCard ref={shareRef} photo={photo} result={result} safety={safety} />
          </View>
        )}

        {/* Nav bar */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navBtn} onPress={reset}>
            <Text style={[styles.navIcon, { color: '#4fe5d4' }]}>◎</Text>
            <Text style={[styles.navLabel, { color: '#4fe5d4' }]}>SCAN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => { reset(); setScreen('codex'); }}>
            <Text style={styles.navIcon}>☰</Text>
            <Text style={styles.navLabel}>CODEX</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ========== CAMERA VIEWFINDER ==========
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <View style={styles.hud} pointerEvents="none">
        <View style={[styles.corner, styles.tl]} />
        <View style={[styles.corner, styles.tr]} />
        <View style={[styles.corner, styles.bl]} />
        <View style={[styles.corner, styles.br]} />
      </View>
      <View style={styles.topLabel} pointerEvents="none">
        <Text style={styles.topLabelText}>● SCAN MODE</Text>
      </View>
      <TouchableOpacity style={styles.captureBtn} onPress={takePhoto}>
        <View style={styles.captureBtnInner} />
      </TouchableOpacity>

      {/* Nav bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBtn}>
          <Text style={[styles.navIcon, { color: '#4fe5d4' }]}>◎</Text>
          <Text style={[styles.navLabel, { color: '#4fe5d4' }]}>SCAN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => setScreen('codex')}>
          <Text style={styles.navIcon}>☰</Text>
          <Text style={styles.navLabel}>CODEX</Text>
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
    height: 2, backgroundColor: '#4fe5d4',
    shadowColor: '#4fe5d4', shadowOpacity: 1, shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 }, elevation: 12,
  },
  title: { color: '#f3c46a', fontSize: 24, fontWeight: '600', letterSpacing: 4, marginBottom: 16 },
  text: { color: '#e8fffb', fontSize: 15, marginBottom: 20, textAlign: 'center' },
  topLabel: {
    position: 'absolute', top: 60, alignSelf: 'center',
    backgroundColor: 'rgba(15, 42, 48, 0.85)',
    borderWidth: 1, borderColor: 'rgba(79, 229, 212, 0.45)',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 4,
  },
  topLabelText: { color: '#4fe5d4', fontSize: 11, letterSpacing: 2, fontWeight: '500' },
  hud: { position: 'absolute', top: 110, left: 32, right: 32, bottom: 200 },
  corner: { position: 'absolute', width: 28, height: 28, borderColor: '#4fe5d4', borderWidth: 2 },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  captureBtn: {
    position: 'absolute', bottom: 100, alignSelf: 'center',
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: '#4fe5d4', alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(232, 255, 251, 0.85)',
  },
  captureBtnInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#2cb5a7' },

  resultPanel: {
    position: 'absolute', top: '40%', left: 0, right: 0, bottom: 56,
    backgroundColor: 'rgba(10, 26, 31, 0.97)', padding: 22,
    borderTopWidth: 1, borderColor: 'rgba(79, 229, 212, 0.45)',
  },
  scanningBox: { alignItems: 'center', paddingVertical: 40 },
  scanningText: { color: '#4fe5d4', marginTop: 16, letterSpacing: 3, fontSize: 12, fontWeight: '500' },
  errorBox: {
    backgroundColor: 'rgba(255, 123, 138, 0.1)',
    borderLeftWidth: 2, borderLeftColor: '#ff7b8a',
    padding: 14, marginBottom: 16, borderRadius: 4,
  },
  errorTitle: { color: '#ff7b8a', fontSize: 11, letterSpacing: 2, marginBottom: 6, fontWeight: '600' },
  errorMsg: { color: '#e8fffb', fontSize: 13, lineHeight: 18 },
  codexTag: { color: '#f3c46a', fontSize: 10, letterSpacing: 2, marginBottom: 6 },
  species: { color: '#e8fffb', fontSize: 24, fontWeight: '600', marginBottom: 4 },
  latin: { color: '#4fe5d4', fontSize: 13, fontStyle: 'italic', marginBottom: 18 },

  safetyBadge: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderRadius: 6,
    padding: 12, marginBottom: 12, gap: 12,
  },
  safetyIcon: { fontSize: 28, fontWeight: 'bold', width: 36, textAlign: 'center' },
  safetyLabel: { fontSize: 11, letterSpacing: 2.5, fontWeight: '700', marginBottom: 4 },
  safetySummary: { color: '#e8fffb', fontSize: 12, lineHeight: 17 },
  dangerBanner: {
    backgroundColor: '#ff7b8a', padding: 10, borderRadius: 4, marginBottom: 12,
  },
  dangerText: {
    color: '#0a1a1f', fontSize: 11, fontWeight: '700',
    letterSpacing: 1.5, textAlign: 'center',
  },

  confidenceBox: {
    backgroundColor: 'rgba(15, 42, 48, 0.78)', padding: 12, borderRadius: 4,
    borderWidth: 1, borderColor: 'rgba(79, 229, 212, 0.25)', marginBottom: 12,
  },
  label: { color: '#8fb4b0', fontSize: 10, letterSpacing: 1.5, marginBottom: 4 },
  confidenceValue: { color: '#6cd9a3', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  confBar: { height: 4, backgroundColor: 'rgba(79, 229, 212, 0.1)', borderRadius: 2, overflow: 'hidden' },
  confFill: { height: '100%', backgroundColor: '#6cd9a3' },
  infoCard: {
    backgroundColor: 'rgba(15, 42, 48, 0.78)', padding: 14, borderRadius: 4,
    borderWidth: 1, borderColor: 'rgba(79, 229, 212, 0.25)',
    borderLeftWidth: 2, borderLeftColor: '#f3c46a', marginBottom: 12,
  },
  cardTitle: { color: '#f3c46a', fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  cardText: { color: '#e8fffb', fontSize: 13, lineHeight: 20 },
  btn: {
    backgroundColor: '#4fe5d4', paddingHorizontal: 28, paddingVertical: 14,
    borderRadius: 6, marginTop: 8, alignSelf: 'center',
  },
  btnText: { color: '#0a1a1f', fontWeight: '700', letterSpacing: 2, fontSize: 12 },

  shareBtn: {
    backgroundColor: 'rgba(243, 196, 106, 0.15)',
    borderWidth: 1, borderColor: '#f3c46a',
    paddingHorizontal: 28, paddingVertical: 14,
    borderRadius: 6, marginTop: 4, marginBottom: 4, alignSelf: 'center',
  },
  shareBtnText: {
    color: '#f3c46a', fontWeight: '700', letterSpacing: 2, fontSize: 12,
  },

  scannedAt: {
    color: '#8fb4b0', fontSize: 11, textAlign: 'center',
    marginTop: 12, marginBottom: 8, letterSpacing: 1,
  },

  offscreen: { position: 'absolute', top: -9999, left: -9999 },

  navBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 56, flexDirection: 'row',
    backgroundColor: 'rgba(6, 18, 22, 0.95)',
    borderTopWidth: 1, borderTopColor: 'rgba(79, 229, 212, 0.2)',
  },
  navBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },
  navIcon: {
    color: '#8fb4b0', fontSize: 20, marginBottom: 2,
  },
  navLabel: {
    color: '#8fb4b0', fontSize: 8, letterSpacing: 2, fontWeight: '600',
  },
});