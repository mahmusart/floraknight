import { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Image,
  ActivityIndicator, ScrollView, Animated, Easing, Modal, Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Sharing from 'expo-sharing';
import * as SplashScreen from 'expo-splash-screen';
import { identifyPlant } from './plantNet';
import { getSafetyInfo, getCategoryStyle } from './plantSafety';
import { saveScan } from './database';
import { narrateScan, stopNarration } from './narrator';
import { identifyAndJoke } from './notAPlant';
import ShareCard from './ShareCard';
import CodexScreen from './CodexScreen';
import HealthScreen from './HealthScreen';
import PrivacyPolicyScreen from './PrivacyPolicyScreen';
import DisclaimerScreen from './DisclaimerScreen';
import AdBanner from './AdBanner';
import {
  canScan,
  incrementScanCount,
  getScansRemaining,
  DAILY_SCAN_LIMIT,
} from './scanLimits';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [narrating, setNarrating] = useState(false);
  const [screen, setScreen] = useState('scanner');
  const [codexEntry, setCodexEntry] = useState(null);
  const [appReady, setAppReady] = useState(false);
  const [scansRemaining, setScansRemaining] = useState(DAILY_SCAN_LIMIT);
  const [showPaywall, setShowPaywall] = useState(false);

  const cameraRef = useRef(null);
  const shareRef = useRef(null);
  const scanLineY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function prepare() {
      const remaining = await getScansRemaining();
      setScansRemaining(remaining);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAppReady(true);
      await SplashScreen.hideAsync();
    }
    prepare();
  }, []);

  useEffect(() => {
    if (screen === 'scanner') {
      getScansRemaining().then(setScansRemaining);
    }
  }, [screen]);

  if (!appReady) return null;
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
        Animated.timing(scanLineY, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scanLineY, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
  };

  const reset = () => {
    stopNarration();
    setPhoto(null);
    setResult(null);
    setError(null);
    setScanning(false);
    setSharing(false);
    setNarrating(false);
    setCodexEntry(null);
  };

  const switchScreen = (name) => {
    reset();
    setScreen(name);
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    const allowed = await canScan();
    if (!allowed) {
      setShowPaywall(true);
      return;
    }

    let capturedUri = null;
    try {
      const captured = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      capturedUri = captured.uri;
      setPhoto(capturedUri);
      setScanning(true);
      setError(null);
      startScanAnimation();

      const [identified] = await Promise.all([
        identifyPlant(capturedUri),
        new Promise(resolve => setTimeout(resolve, 1200)),
      ]);
      setResult(identified);

      const remaining = await incrementScanCount();
      setScansRemaining(remaining);

      const safety = getSafetyInfo(identified.scientificName) || {
        category: 'unknown', summary: '', uses: [], warnings: [],
      };
      try {
        await saveScan(identified, safety, capturedUri);
      } catch (saveErr) {
        console.log('Save to codex failed:', saveErr);
      }
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (capturedUri) {
        try {
          const jokeResult = await identifyAndJoke(capturedUri);
          setError(`NOT A PLANT: ${jokeResult.objectName.toUpperCase()}\n\n${jokeResult.joke}`);
          const remaining = await incrementScanCount();
          setScansRemaining(remaining);
        } catch (jokeErr) {
          setError(e.message);
        }
      } else {
        setError(e.message);
      }
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
      if (!isAvailable) { alert('Sharing is not available on this device'); return; }
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Share your FloraKnight discovery' });
    } catch (e) {
      console.log('Share cancelled or failed:', e);
    } finally {
      setSharing(false);
    }
  };

  const handleNarrate = async () => {
    const activeData = codexEntry || result;
    if (!activeData || !safety) return;
    if (narrating) {
      await stopNarration();
      setNarrating(false);
      return;
    }
    setNarrating(true);
    await narrateScan(activeData, safety, {
      onDone: () => setNarrating(false),
      onStopped: () => setNarrating(false),
      onError: () => setNarrating(false),
    });
  };

  const handleViewEntry = (entry) => {
    setCodexEntry(entry);
    setScreen('scanner');
  };

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

  // ── Scan counter badge ───────────────────────────────────────────
  const renderScanCounter = () => {
    const atLimit = scansRemaining === 0;
    const lowScans = scansRemaining <= 2 && scansRemaining > 0;
    const counterColor = atLimit ? '#ff7b8a' : lowScans ? '#ffb454' : '#4fe5d4';
    const borderColor = atLimit ? 'rgba(255,123,138,0.5)' : lowScans ? 'rgba(255,180,84,0.5)' : 'rgba(79,229,212,0.45)';
    return (
      <View style={[styles.scanCounter, { borderColor }]}>
        <Text style={[styles.scanCounterText, { color: counterColor }]}>
          {atLimit ? '⚠ LIMIT REACHED' : `◉ ${scansRemaining} / ${DAILY_SCAN_LIMIT} SCANS`}
        </Text>
      </View>
    );
  };

  // ── Paywall modal ────────────────────────────────────────────────
  const renderPaywall = () => (
    <Modal visible={showPaywall} transparent animationType="fade" onRequestClose={() => setShowPaywall(false)}>
      <View style={styles.paywallOverlay}>
        <View style={styles.paywallCard}>
          <View style={styles.paywallHeader}>
            <Text style={styles.paywallIcon}>⬡</Text>
            <Text style={styles.paywallTitle}>DAILY LIMIT REACHED</Text>
          </View>
          <View style={styles.paywallMeter}>
            <Text style={styles.paywallMeterLabel}>SCANS USED TODAY</Text>
            <View style={styles.paywallMeterBar}>
              <View style={styles.paywallMeterFill} />
            </View>
            <Text style={styles.paywallMeterCount}>{DAILY_SCAN_LIMIT} / {DAILY_SCAN_LIMIT}</Text>
          </View>
          <View style={styles.sproutBox}>
            <Text style={styles.sproutLabel}>🌿 SPROUT SAYS</Text>
            <Text style={styles.sproutMsg}>
              You've used all {DAILY_SCAN_LIMIT} scans for today, partner. Your codex recharges at midnight — or go Pro for unlimited scanning every day.
            </Text>
          </View>
          <View style={styles.proFeatures}>
            <Text style={styles.proFeaturesTitle}>FLORA KNIGHT PRO</Text>
            <Text style={styles.proFeatureItem}>✦  Unlimited daily scans</Text>
            <Text style={styles.proFeatureItem}>✦  Premium Sprout voice lines</Text>
            <Text style={styles.proFeatureItem}>✦  Cloud codex sync</Text>
            <Text style={styles.proFeatureItem}>✦  Support the mission</Text>
          </View>
          <TouchableOpacity style={styles.upgradeBtn} onPress={() => {
            Alert.alert('Coming Soon', 'FloraKnight Pro subscriptions are launching soon. Stay tuned!', [{ text: 'Got it' }]);
          }}>
            <Text style={styles.upgradeBtnText}>⬡ UPGRADE TO PRO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dismissBtn} onPress={() => setShowPaywall(false)}>
            <Text style={styles.dismissBtnText}>COME BACK TOMORROW</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // ── Nav bar ──────────────────────────────────────────────────────
  const renderNavBar = () => (
    <View style={styles.navBar}>
      <TouchableOpacity style={styles.navBtn} onPress={() => switchScreen('scanner')}>
        <Text style={[styles.navIcon, screen === 'scanner' && { color: '#4fe5d4' }]}>◎</Text>
        <Text style={[styles.navLabel, screen === 'scanner' && { color: '#4fe5d4' }]}>SCAN</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navBtn} onPress={() => switchScreen('health')}>
        <Text style={[styles.navIcon, screen === 'health' && { color: '#ffb454' }]}>✚</Text>
        <Text style={[styles.navLabel, screen === 'health' && { color: '#ffb454' }]}>HEALTH</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navBtn} onPress={() => switchScreen('codex')}>
        <Text style={[styles.navIcon, screen === 'codex' && { color: '#f3c46a' }]}>☰</Text>
        <Text style={[styles.navLabel, screen === 'codex' && { color: '#f3c46a' }]}>CODEX</Text>
      </TouchableOpacity>
    </View>
  );

  // ── Screen routing ───────────────────────────────────────────────
  if (screen === 'health') {
    return <HealthScreen onBack={() => switchScreen('scanner')} />;
  }

  if (screen === 'codex') {
    return (
      <CodexScreen
        onBack={() => switchScreen('scanner')}
        onViewEntry={handleViewEntry}
        renderNavBar={renderNavBar}
      />
    );
  }

  if (screen === 'privacy') {
    return <PrivacyPolicyScreen onBack={() => switchScreen('scanner')} />;
  }

  if (screen === 'disclaimer') {
    return <DisclaimerScreen onBack={() => switchScreen('scanner')} />;
  }

  // ── Codex entry view ─────────────────────────────────────────────
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
          <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
            <Text style={styles.codexTag}>CODEX ENTRY</Text>
            <Text style={styles.species}>{codexEntry.commonName}</Text>
            <Text style={styles.latin}>{codexEntry.scientificName}</Text>

            {safety && catStyle && (
              <View style={[styles.safetyBadge, { borderColor: catStyle.color, backgroundColor: catStyle.color + '15' }]}>
                <Text style={[styles.safetyIcon, { color: catStyle.color }]}>{catStyle.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.safetyLabel, { color: catStyle.color }]}>{catStyle.label}</Text>
                  <Text style={styles.safetySummary}>{safety.summary}</Text>
                </View>
              </View>
            )}

            {safety && safety.category === 'toxic' && (
              <View style={styles.dangerBanner}>
                <Text style={styles.dangerText}>⚠ DO NOT CONSUME — KEEP AWAY FROM CHILDREN AND PETS</Text>
              </View>
            )}

            {safety && safety.uses.length > 0 && (
              <View style={styles.infoCard}>
                <Text style={styles.cardTitle}>USES</Text>
                {safety.uses.map((use, i) => <Text key={i} style={styles.cardText}>• {use}</Text>)}
              </View>
            )}

            {safety && safety.warnings.length > 0 && (
              <View style={[styles.infoCard, { borderLeftColor: '#ffb454' }]}>
                <Text style={[styles.cardTitle, { color: '#ffb454' }]}>WARNINGS</Text>
                {safety.warnings.map((warn, i) => <Text key={i} style={styles.cardText}>• {warn}</Text>)}
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

            <TouchableOpacity style={styles.narrateBtn} onPress={handleNarrate}>
              <Text style={styles.narrateBtnText}>
                {narrating ? '◼ STOP NARRATION' : '▶ NARRATE WITH SPROUT'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={reset}>
              <Text style={styles.btnText}>Back to scanner</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <AdBanner />
        {renderNavBar()}
      </View>
    );
  }

  // ── Scan results view ────────────────────────────────────────────
  if (photo) {
    return (
      <View style={styles.container}>
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          {scanning && (
            <Animated.View style={[styles.scanBeam, {
              transform: [{ translateY: scanLineY.interpolate({ inputRange: [0, 1], outputRange: [10, 290] }) }],
            }]} />
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
              <View style={error.startsWith('NOT A PLANT') ? styles.jokeBox : styles.errorBox}>
                <Text style={error.startsWith('NOT A PLANT') ? styles.jokeTitle : styles.errorTitle}>
                  {error.startsWith('NOT A PLANT') ? '🌿 SPROUT SAYS...' : 'SCAN FAILED'}
                </Text>
                <Text style={error.startsWith('NOT A PLANT') ? styles.jokeMsg : styles.errorMsg}>
                  {error.startsWith('NOT A PLANT') ? error.replace('NOT A PLANT: ', '') : error}
                </Text>
              </View>
            )}

            {result && safety && catStyle && (
              <>
                <Text style={styles.codexTag}>SUBJECT IDENTIFIED</Text>
                <Text style={styles.species}>{result.commonName}</Text>
                <Text style={styles.latin}>{result.scientificName}</Text>

                <View style={[styles.safetyBadge, { borderColor: catStyle.color, backgroundColor: catStyle.color + '15' }]}>
                  <Text style={[styles.safetyIcon, { color: catStyle.color }]}>{catStyle.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.safetyLabel, { color: catStyle.color }]}>{catStyle.label}</Text>
                    <Text style={styles.safetySummary}>{safety.summary}</Text>
                  </View>
                </View>

                {safety.category === 'toxic' && (
                  <View style={styles.dangerBanner}>
                    <Text style={styles.dangerText}>⚠ DO NOT CONSUME — KEEP AWAY FROM CHILDREN AND PETS</Text>
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
                    {safety.uses.map((use, i) => <Text key={i} style={styles.cardText}>• {use}</Text>)}
                  </View>
                )}

                {safety.warnings.length > 0 && (
                  <View style={[styles.infoCard, { borderLeftColor: '#ffb454' }]}>
                    <Text style={[styles.cardTitle, { color: '#ffb454' }]}>WARNINGS</Text>
                    {safety.warnings.map((warn, i) => <Text key={i} style={styles.cardText}>• {warn}</Text>)}
                  </View>
                )}

                <View style={styles.infoCard}>
                  <Text style={styles.cardTitle}>TAXONOMY</Text>
                  <Text style={styles.cardText}>Family: {result.family}</Text>
                  <Text style={styles.cardText}>Genus: {result.genus}</Text>
                </View>

                {result.allMatches && result.allMatches.length > 1 && (
                  <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>OTHER POSSIBILITIES</Text>
                    {result.allMatches.slice(1).map((m, i) => (
                      <Text key={i} style={styles.cardText}>{m.commonName} — {m.confidence}%</Text>
                    ))}
                  </View>
                )}

                <TouchableOpacity style={styles.narrateBtn} onPress={handleNarrate}>
                  <Text style={styles.narrateBtnText}>
                    {narrating ? '◼ STOP NARRATION' : '▶ NARRATE WITH SPROUT'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.shareBtn} onPress={handleShare} disabled={sharing}>
                  <Text style={styles.shareBtnText}>{sharing ? 'PREPARING...' : '↗ SHARE DISCOVERY'}</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity style={styles.btn} onPress={reset}>
              <Text style={styles.btnText}>Scan another</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {result && safety && (
          <View style={styles.offscreen}>
            <ShareCard ref={shareRef} photo={photo} result={result} safety={safety} />
          </View>
        )}

        <AdBanner />
        {renderNavBar()}
      </View>
    );
  }

  // ── Camera view (default) ────────────────────────────────────────
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

      {renderScanCounter()}

      <TouchableOpacity
        style={[styles.captureBtn, scansRemaining === 0 && styles.captureBtnDisabled]}
        onPress={takePhoto}
      >
        <View style={[styles.captureBtnInner, scansRemaining === 0 && styles.captureBtnInnerDisabled]} />
      </TouchableOpacity>

      {/* Legal footer */}
      <View style={styles.legalFooter}>
        <TouchableOpacity onPress={() => switchScreen('disclaimer')}>
          <Text style={styles.legalLink}>Disclaimer</Text>
        </TouchableOpacity>
        <Text style={styles.legalDot}>·</Text>
        <TouchableOpacity onPress={() => switchScreen('privacy')}>
          <Text style={styles.legalLink}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>

      {renderPaywall()}
      {renderNavBar()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1a1f' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a1a1f', padding: 24 },
  camera: { flex: 1 },
  preview: { width: '100%', height: '100%', resizeMode: 'cover' },
  previewContainer: { position: 'absolute', top: 0, left: 0, right: 0, height: '40%', overflow: 'hidden' },
  scanBeam: {
    position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: '#4fe5d4',
    shadowColor: '#4fe5d4', shadowOpacity: 1, shadowRadius: 12, shadowOffset: { width: 0, height: 0 }, elevation: 12,
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
  scanCounter: {
    position: 'absolute', top: 108, alignSelf: 'center',
    backgroundColor: 'rgba(10, 26, 31, 0.82)',
    borderWidth: 1, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4,
  },
  scanCounterText: { fontSize: 10, letterSpacing: 2, fontWeight: '600' },
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
  captureBtnDisabled: { backgroundColor: 'rgba(255, 123, 138, 0.3)', borderColor: 'rgba(255, 123, 138, 0.5)' },
  captureBtnInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#2cb5a7' },
  captureBtnInnerDisabled: { backgroundColor: '#7a3040' },
  resultPanel: {
    position: 'absolute', top: '40%', left: 0, right: 0, bottom: 56,
    backgroundColor: 'rgba(10, 26, 31, 0.97)', padding: 22,
    borderTopWidth: 1, borderColor: 'rgba(79, 229, 212, 0.45)',
  },
  scanningBox: { alignItems: 'center', paddingVertical: 40 },
  scanningText: { color: '#4fe5d4', marginTop: 16, letterSpacing: 3, fontSize: 12, fontWeight: '500' },
  errorBox: { backgroundColor: 'rgba(255, 123, 138, 0.1)', borderLeftWidth: 2, borderLeftColor: '#ff7b8a', padding: 14, marginBottom: 16, borderRadius: 4 },
  errorTitle: { color: '#ff7b8a', fontSize: 11, letterSpacing: 2, marginBottom: 6, fontWeight: '600' },
  errorMsg: { color: '#e8fffb', fontSize: 13, lineHeight: 18 },
  jokeBox: { backgroundColor: 'rgba(108, 217, 163, 0.1)', borderLeftWidth: 2, borderLeftColor: '#6cd9a3', padding: 14, marginBottom: 16, borderRadius: 4 },
  jokeTitle: { color: '#6cd9a3', fontSize: 11, letterSpacing: 2, marginBottom: 8, fontWeight: '600' },
  jokeMsg: { color: '#e8fffb', fontSize: 14, lineHeight: 22 },
  codexTag: { color: '#f3c46a', fontSize: 10, letterSpacing: 2, marginBottom: 6 },
  species: { color: '#e8fffb', fontSize: 24, fontWeight: '600', marginBottom: 4 },
  latin: { color: '#4fe5d4', fontSize: 13, fontStyle: 'italic', marginBottom: 18 },
  safetyBadge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 6, padding: 12, marginBottom: 12, gap: 12 },
  safetyIcon: { fontSize: 28, fontWeight: 'bold', width: 36, textAlign: 'center' },
  safetyLabel: { fontSize: 11, letterSpacing: 2.5, fontWeight: '700', marginBottom: 4 },
  safetySummary: { color: '#e8fffb', fontSize: 12, lineHeight: 17 },
  dangerBanner: { backgroundColor: '#ff7b8a', padding: 10, borderRadius: 4, marginBottom: 12 },
  dangerText: { color: '#0a1a1f', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textAlign: 'center' },
  confidenceBox: { backgroundColor: 'rgba(15, 42, 48, 0.78)', padding: 12, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(79, 229, 212, 0.25)', marginBottom: 12 },
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
  btn: { backgroundColor: '#4fe5d4', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 6, marginTop: 8, alignSelf: 'center' },
  btnText: { color: '#0a1a1f', fontWeight: '700', letterSpacing: 2, fontSize: 12 },
  shareBtn: { backgroundColor: 'rgba(243, 196, 106, 0.15)', borderWidth: 1, borderColor: '#f3c46a', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 6, marginTop: 4, marginBottom: 4, alignSelf: 'center' },
  shareBtnText: { color: '#f3c46a', fontWeight: '700', letterSpacing: 2, fontSize: 12 },
  narrateBtn: { backgroundColor: 'rgba(108, 217, 163, 0.15)', borderWidth: 1, borderColor: '#6cd9a3', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 6, marginTop: 4, marginBottom: 4, alignSelf: 'center' },
  narrateBtnText: { color: '#6cd9a3', fontWeight: '700', letterSpacing: 2, fontSize: 12 },
  scannedAt: { color: '#8fb4b0', fontSize: 11, textAlign: 'center', marginTop: 12, marginBottom: 8, letterSpacing: 1 },
  offscreen: { position: 'absolute', top: -9999, left: -9999 },
  navBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 56, flexDirection: 'row',
    backgroundColor: 'rgba(6, 18, 22, 0.95)', borderTopWidth: 1, borderTopColor: 'rgba(79, 229, 212, 0.2)',
  },
  navBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navIcon: { color: '#8fb4b0', fontSize: 20, marginBottom: 2 },
  navLabel: { color: '#8fb4b0', fontSize: 8, letterSpacing: 2, fontWeight: '600' },

  // Paywall
  paywallOverlay: { flex: 1, backgroundColor: 'rgba(6, 14, 17, 0.92)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  paywallCard: { width: '100%', backgroundColor: '#0f2a30', borderWidth: 1.5, borderColor: '#f3c46a', borderRadius: 8, padding: 24, shadowColor: '#f3c46a', shadowOpacity: 0.25, shadowRadius: 20, shadowOffset: { width: 0, height: 0 }, elevation: 20 },
  paywallHeader: { alignItems: 'center', marginBottom: 20 },
  paywallIcon: { fontSize: 36, color: '#f3c46a', marginBottom: 8 },
  paywallTitle: { color: '#f3c46a', fontSize: 14, fontWeight: '700', letterSpacing: 3 },
  paywallMeter: { backgroundColor: 'rgba(255, 123, 138, 0.08)', borderWidth: 1, borderColor: 'rgba(255, 123, 138, 0.3)', borderRadius: 4, padding: 12, marginBottom: 16, alignItems: 'center' },
  paywallMeterLabel: { color: '#8fb4b0', fontSize: 9, letterSpacing: 2, marginBottom: 8 },
  paywallMeterBar: { width: '100%', height: 6, backgroundColor: 'rgba(255, 123, 138, 0.15)', borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  paywallMeterFill: { width: '100%', height: '100%', backgroundColor: '#ff7b8a', borderRadius: 3 },
  paywallMeterCount: { color: '#ff7b8a', fontSize: 13, fontWeight: '700', letterSpacing: 2 },
  sproutBox: { backgroundColor: 'rgba(108, 217, 163, 0.08)', borderLeftWidth: 2, borderLeftColor: '#6cd9a3', padding: 12, borderRadius: 4, marginBottom: 16 },
  sproutLabel: { color: '#6cd9a3', fontSize: 9, letterSpacing: 2, marginBottom: 6, fontWeight: '600' },
  sproutMsg: { color: '#e8fffb', fontSize: 13, lineHeight: 19 },
  proFeatures: { marginBottom: 20 },
  proFeaturesTitle: { color: '#f3c46a', fontSize: 10, letterSpacing: 2.5, fontWeight: '700', marginBottom: 10 },
  proFeatureItem: { color: '#8fb4b0', fontSize: 13, lineHeight: 22 },
  upgradeBtn: { backgroundColor: '#f3c46a', paddingVertical: 14, borderRadius: 6, alignItems: 'center', marginBottom: 10 },
  upgradeBtnText: { color: '#0a1a1f', fontWeight: '700', letterSpacing: 2.5, fontSize: 12 },
  dismissBtn: { paddingVertical: 12, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(79, 229, 212, 0.35)', alignItems: 'center' },
  dismissBtnText: { color: '#4fe5d4', fontWeight: '600', letterSpacing: 2, fontSize: 11 },

  // Legal footer
  legalFooter: { position: 'absolute', bottom: 64, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8 },
  legalLink: { color: '#8fb4b0', fontSize: 10, letterSpacing: 1.5 },
  legalDot: { color: '#8fb4b0', fontSize: 10 },
});